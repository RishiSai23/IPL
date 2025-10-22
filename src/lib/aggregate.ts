// file: src/lib/aggregate.ts
import type { SavedMatch } from "@/lib/localStore";
import { computeScoresForMatch, type PlayerScore } from "@/lib/scoring";
// Define a local alias to avoid importing a non-exported type from the component
type PlayerPrimaryRole = "batter" | "bowler" | "all-rounder" | "wicket-keeper";

export type LeaderboardRow = {
  key: string; // grouping key (lowercased name)
  name: string;
  primaryRole?: PlayerPrimaryRole;
  matches: number;
  avgTalentIndex: number; // 0–100
  avgBattingCXI: number | null; // 0–100 or null if no batting
  avgBowlingCXI: number | null; // 0–100 or null if no bowling
  avgFieldingPM: number | null; // 0–100 or null if no fielding
  lastPlayedAt: string; // ISO
};

type Acc = {
  name: string;
  roleCounts: Partial<Record<PlayerPrimaryRole, number>>;
  tiSum: number;
  tiCount: number;
  batSum: number;
  batCount: number;
  bowlSum: number;
  bowlCount: number;
  fieldSum: number;
  fieldCount: number;
  matches: number;
  lastPlayedAt: string; // ISO
};

function chooseRole(
  roleCounts: Acc["roleCounts"]
): PlayerPrimaryRole | undefined {
  let best: { role?: PlayerPrimaryRole; count: number } = {
    role: undefined,
    count: 0,
  };
  (
    ["batter", "bowler", "all-rounder", "wicket-keeper"] as PlayerPrimaryRole[]
  ).forEach((r) => {
    const c = roleCounts[r] ?? 0;
    if (c > best.count) best = { role: r, count: c };
  });
  return best.role;
}

export function buildLeaderboard(matches: SavedMatch[]): LeaderboardRow[] {
  const map = new Map<string, Acc>();

  for (const m of matches) {
    const scores: PlayerScore[] = computeScoresForMatch(m);
    for (const s of scores) {
      const rawName = s.name?.trim() || "Unnamed";
      const key = rawName.toLowerCase();

      const prev = map.get(key);
      const acc: Acc = prev ?? {
        name: rawName,
        roleCounts: {},
        tiSum: 0,
        tiCount: 0,
        batSum: 0,
        batCount: 0,
        bowlSum: 0,
        bowlCount: 0,
        fieldSum: 0,
        fieldCount: 0,
        matches: 0,
        lastPlayedAt: "",
      };

      // role count
      if (s.primaryRole) {
        acc.roleCounts[s.primaryRole] =
          (acc.roleCounts[s.primaryRole] ?? 0) + 1;
      }

      // totals
      acc.tiSum += s.talentIndex;
      acc.tiCount += 1;

      if (typeof s.battingCXI === "number") {
        acc.batSum += s.battingCXI;
        acc.batCount += 1;
      }
      if (typeof s.bowlingCXI === "number") {
        acc.bowlSum += s.bowlingCXI;
        acc.bowlCount += 1;
      }
      if (typeof s.fieldingPM === "number") {
        acc.fieldSum += s.fieldingPM;
        acc.fieldCount += 1;
      }

      // count match appearance
      acc.matches += 1;

      // last played at (max)
      if (
        !acc.lastPlayedAt ||
        new Date(m.createdAt) > new Date(acc.lastPlayedAt)
      ) {
        acc.lastPlayedAt = m.createdAt;
      }

      map.set(key, acc);
    }
  }

  const rows: LeaderboardRow[] = Array.from(map.entries()).map(([key, acc]) => {
    const primaryRole = chooseRole(acc.roleCounts);
    const avgTI = acc.tiCount ? Math.round(acc.tiSum / acc.tiCount) : 0;
    const avgBat = acc.batCount ? Math.round(acc.batSum / acc.batCount) : null;
    const avgBowl = acc.bowlCount
      ? Math.round(acc.bowlSum / acc.bowlCount)
      : null;
    const avgField = acc.fieldCount
      ? Math.round(acc.fieldSum / acc.fieldCount)
      : null;

    return {
      key,
      name: acc.name,
      primaryRole,
      matches: acc.matches,
      avgTalentIndex: avgTI,
      avgBattingCXI: avgBat,
      avgBowlingCXI: avgBowl,
      avgFieldingPM: avgField,
      lastPlayedAt: acc.lastPlayedAt,
    };
  });

  // sort by avgTalentIndex desc, ties by matches desc
  rows.sort((a, b) => {
    if (b.avgTalentIndex !== a.avgTalentIndex)
      return b.avgTalentIndex - a.avgTalentIndex;
    return b.matches - a.matches;
  });

  return rows;
}
