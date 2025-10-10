// file: src/lib/scoring.ts
import type { SavedMatch, MatchInfo } from "@/lib/localStore";
import type {
  PlayerContribution,
  BattingEntry,
  BowlingEntry,
  FieldingEntry,
  PlayerPrimaryRole,
} from "@/components/match/PlayerContributions";

type Pitch = "flat" | "green" | "dry_turning" | "slow_low" | "two_paced";

const BASE_RPB = 1.25; // ~7.5 rpo in T20

const PF_BAT: Record<Pitch, number> = {
  flat: 1.1,
  green: 0.95,
  dry_turning: 0.9,
  slow_low: 0.9,
  two_paced: 0.92,
};

const PF_BOWL: Record<Pitch, number> = {
  flat: 0.9,
  green: 1.05,
  dry_turning: 1.1,
  slow_low: 1.1,
  two_paced: 1.08,
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const scaleTo100 = (raw: number, minRaw = -25, maxRaw = 40) => {
  const z = (raw - minRaw) / (maxRaw - minRaw);
  return clamp(Math.round(100 * z), 0, 100);
};

const n = (v: number | "" | undefined | null): number => (typeof v === "number" ? v : 0);

// Convert cricket-style overs (e.g., 3.4) to balls (3 overs + 4 balls = 22 balls)
function oversToBalls(overs: number): number {
  const whole = Math.trunc(overs);
  const frac = Math.round((overs - whole) * 10); // 0–5 balls
  return whole * 6 + clamp(frac, 0, 5);
}

function oppAdjForBat(opp: "1" | "2" | "3" | "4" | "5"): number {
  // Stronger opposition -> lower expected runs (makes actual more valuable)
  return 1 - 0.05 * (Number(opp) - 3);
}

function oppAdjForBowl(opp: "1" | "2" | "3" | "4" | "5"): number {
  // Stronger opposition -> higher expected concession (makes saving runs easier)
  return 1 + 0.05 * (Number(opp) - 3);
}

export function battingCXIInnings(b: BattingEntry | undefined, info: MatchInfo): number | null {
  if (!b) return null;
  const balls = n(b.balls);
  const runs = n(b.runs);
  if (balls <= 0 && runs <= 0) return null;

  const pf = PF_BAT[info.pitch as Pitch] ?? 1;
  const oAdj = oppAdjForBat(info.oppositionStrength);
  const xRuns = BASE_RPB * pf * oAdj * balls;

  let rawImpact = runs - xRuns;

  // Wicket penalty (apply only if actually out and faced balls)
  const isOut = b.notOut ? false : balls > 0;
  const topOrder = n(b.battingPosition) > 0 && n(b.battingPosition) <= 3;
  const wicketPenalty = isOut ? 5 + (topOrder ? 1 : 0) + (info.inningsNo === "2" ? 1 : 0) : 0;
  rawImpact -= wicketPenalty;

  // Pressure weight (only for chases with a known target)
  let pressureWeight = 1;
  if (info.inningsNo === "2" && typeof info.targetRuns === "number") {
    const rrr = info.targetRuns / 20; // T20
    const pressureIdx = clamp((rrr - 7.5) / 3, -0.2, 0.5);
    pressureWeight = 1 + pressureIdx;
  }
  if (b.finisherFlag) rawImpact *= 1.05;

  const weighted = rawImpact * pressureWeight;
  return scaleTo100(weighted, -20, 40);
}

export function bowlingCXIInnings(w: BowlingEntry | undefined, info: MatchInfo): number | null {
  if (!w) return null;
  const overs = n(w.overs);
  const balls = oversToBalls(overs);
  const runsConceded = n(w.runsConceded);
  if (balls <= 0 && runsConceded <= 0 && n(w.wickets) <= 0) return null;

  const pf = PF_BOWL[info.pitch as Pitch] ?? 1;
  const oAdj = oppAdjForBowl(info.oppositionStrength);

  // Phase-aware expected runs if PP/Death provided
  const ppBalls = oversToBalls(n(w.oversInPowerplay));
  const deathBalls = oversToBalls(n(w.oversInDeath));
  const midBalls = Math.max(0, balls - ppBalls - deathBalls);
  const rpbPP = 1.25; // ~7.5 rpo
  const rpbMid = 1.17; // ~7.0 rpo
  const rpbDeath = 1.5; // ~9.0 rpo

  let xCon =
    (ppBalls * rpbPP + midBalls * rpbMid + deathBalls * rpbDeath) *
    (oAdj / pf);

  // If no phase info, fall back to uniform
  if (ppBalls + midBalls + deathBalls === 0) {
    xCon = BASE_RPB * balls * (oAdj / pf);
  }

  let rawImpact = xCon - runsConceded;

  // Wicket value
  let wicketValue = 6;
  if (n(w.oversInDeath) >= 1) wicketValue += 1;
  if (Number(info.oppositionStrength) >= 4) wicketValue += 1;
  rawImpact += n(w.wickets) * wicketValue;

  return scaleTo100(rawImpact, -20, 35);
}

export function fieldingPlusMinus(f: FieldingEntry | undefined): number | null {
  if (!f) return null;
  const pm =
    n(f.catches) * 3 +
    n(f.runouts) * 4 +
    n(f.stumpings) * 4 +
    n(f.boundarySaves) * 1 -
    n(f.drops) * 3;

  // Return a 0–100 scale for UI consistency
  return scaleTo100(pm, -6, 18);
}

export function talentIndex(
  bat: number | null,
  bowl: number | null,
  field: number | null,
  primaryRole: PlayerPrimaryRole | undefined
): number {
  const b = bat ?? 0;
  const w = bowl ?? 0;
  const f = field ?? 50; // neutral default if fielding not provided

  const weights =
    primaryRole === "batter"
      ? [0.6, 0.25, 0.15]
      : primaryRole === "bowler"
      ? [0.25, 0.6, 0.15]
      : primaryRole === "all-rounder"
      ? [0.45, 0.45, 0.1]
      : [0.4, 0.4, 0.2];

  return Math.round(b * weights[0] + w * weights[1] + f * weights[2]);
}

export type PlayerScore = {
  playerId: string;
  name: string;
  primaryRole?: PlayerPrimaryRole;
  battingCXI: number | null;
  bowlingCXI: number | null;
  fieldingPM: number | null;
  talentIndex: number;
};

export function computeScoresForMatch(match: SavedMatch): PlayerScore[] {
  const info = match.matchInfo;
  return match.players.map((p: PlayerContribution) => {
    const bat = battingCXIInnings(p.batting, info);
    const bowl = bowlingCXIInnings(p.bowling, info);
    const field = fieldingPlusMinus(p.fielding);
    const ti = talentIndex(bat, bowl, field, p.primaryRole);
    return {
      playerId: p.id,
      name: p.name || "Unnamed",
      primaryRole: p.primaryRole,
      battingCXI: bat,
      bowlingCXI: bowl,
      fieldingPM: field,
      talentIndex: ti,
    };
  });
}