import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PlayerContributions, {
  type PlayerContribution,
} from "@/components/match/PlayerContributions";
import { saveNewMatch, listMatches } from "@/lib/localStore";
import { toast } from "sonner";

type Pitch = "flat" | "green" | "dry_turning" | "slow_low" | "two_paced";
type Result = "win" | "loss" | "tie" | "nr";

type MatchInfo = {
  date: string;
  venue: string;
  pitch: Pitch;
  oppositionStrength: "1" | "2" | "3" | "4" | "5";
  inningsNo: "1" | "2";
  targetRuns?: number | "";
  result: Result;
};

type InningsSummary = {
  battingTeam: string;
  bowlingTeam: string;
  runs: number | "";
  wickets: number | "";
  overs: number | "";
};

const pitchOptions: { value: Pitch; label: string }[] = [
  { value: "flat", label: "Flat" },
  { value: "green", label: "Green" },
  { value: "dry_turning", label: "Dry & Turning" },
  { value: "slow_low", label: "Slow & Low" },
  { value: "two_paced", label: "Two-paced" },
];

const resultOptions: Result[] = ["win", "loss", "tie", "nr"];

// ✅ Helpers
const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p_${Math.random().toString(36).slice(2)}_${Date.now()}`;

function clonePlayers(players: PlayerContribution[]) {
  return players.map((p) => ({
    ...p,
    id: genId(),
    batting: p.batting ? { ...p.batting } : undefined,
    bowling: p.bowling ? { ...p.bowling } : undefined,
    fielding: p.fielding ? { ...p.fielding } : undefined,
  }));
}

const getGeo = (): Promise<{ lat: number; lng: number } | null> =>
  new Promise((resolve) => {
    if (!("geolocation" in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
    );
  });

const initialMatchInfo: MatchInfo = {
  date: "",
  venue: "",
  pitch: "flat",
  oppositionStrength: "3",
  inningsNo: "1",
  targetRuns: "",
  result: "win",
};

const initialInnings: InningsSummary = {
  battingTeam: "",
  bowlingTeam: "",
  runs: "",
  wickets: "",
  overs: "",
};

export default function MatchWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [matchInfo, setMatchInfo] = useState<MatchInfo>(initialMatchInfo);
  const [innings, setInnings] = useState<InningsSummary>(initialInnings);
  const [players, setPlayers] = useState<PlayerContribution[]>([]);

  // ✅ Prefill logic
  const [searchParams] = useSearchParams();
  const prefilledRef = useRef(false);

  useEffect(() => {
    const dupId = searchParams.get("duplicateFrom");
    if (!dupId || prefilledRef.current) return;

    const src = listMatches().find((m) => m.id === dupId);
    if (!src) return;

    setMatchInfo(src.matchInfo);
    setInnings(src.innings);
    setPlayers(clonePlayers(src.players));

    prefilledRef.current = true;
    toast.success("Prefilled from saved match", {
      description: `Source ID: ${dupId}`,
    });
  }, [searchParams]);

  const hasPlayers = players.length > 0;

  const canGoNext = (() => {
    if (step === 1) {
      return (
        !!matchInfo.date &&
        !!matchInfo.venue &&
        !!matchInfo.pitch &&
        !!matchInfo.oppositionStrength &&
        !!matchInfo.inningsNo &&
        (matchInfo.inningsNo === "1" || matchInfo.targetRuns !== "")
      );
    }
    if (step === 2) {
      return (
        !!innings.battingTeam &&
        !!innings.bowlingTeam &&
        innings.runs !== "" &&
        innings.wickets !== "" &&
        innings.overs !== ""
      );
    }
    if (step === 3) {
      return hasPlayers;
    }
    return true;
  })();

  const goNext = () => setStep(step === 4 ? 4 : ((step + 1) as 1 | 2 | 3 | 4));
  const goBack = () => setStep(step === 1 ? 1 : ((step - 1) as 1 | 2 | 3 | 4));

  const handleSave = async () => {
    const geo = await getGeo();
    const saved = saveNewMatch({
      matchInfo,
      innings,
      players,
      geo: geo ?? { lat: null, lng: null },
    });

    toast.success("Match saved", {
      description: `Saved with ID: ${saved.id}${
        geo ? ` • Geo: ${geo.lat.toFixed(4)}, ${geo.lng.toFixed(4)}` : ""
      }`,
    });

    // Reset wizard
    setStep(1);
    setMatchInfo(initialMatchInfo);
    setInnings(initialInnings);
    setPlayers([]);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {/* Step header */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
          {step}
        </span>
        <span className="font-medium text-foreground">
          {step === 1 && "Match Info"}
          {step === 2 && "Innings Summary"}
          {step === 3 && "Player Contributions"}
          {step === 4 && "Review & Save"}
        </span>
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Date
              </label>
              <Input
                type="date"
                value={matchInfo.date}
                onChange={(e) =>
                  setMatchInfo((p) => ({ ...p, date: e.target.value }))
                }
              />
            </div>

            {/* Venue */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Venue
              </label>
              <Input
                placeholder="Ground or school name"
                value={matchInfo.venue}
                onChange={(e) =>
                  setMatchInfo((p) => ({ ...p, venue: e.target.value }))
                }
              />
            </div>

            {/* Pitch */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Pitch Type
              </label>
              <Select
                value={matchInfo.pitch}
                onValueChange={(value) =>
                  setMatchInfo((p) => ({ ...p, pitch: value as Pitch }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pitch type" />
                </SelectTrigger>
                <SelectContent>
                  {pitchOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opposition */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Opposition Strength (1–5)
              </label>
              <Select
                value={matchInfo.oppositionStrength}
                onValueChange={(value) =>
                  setMatchInfo((p) => ({
                    ...p,
                    oppositionStrength:
                      value as MatchInfo["oppositionStrength"],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {(["1", "2", "3", "4", "5"] as const).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Innings */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Innings
              </label>
              <Select
                value={matchInfo.inningsNo}
                onValueChange={(value) =>
                  setMatchInfo((p) => ({ ...p, inningsNo: value as "1" | "2" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="1st or 2nd innings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Innings</SelectItem>
                  <SelectItem value="2">2nd Innings (Chase)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Target */}
            {matchInfo.inningsNo === "2" && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Target Runs
                </label>
                <Input
                  type="number"
                  min={1}
                  value={matchInfo.targetRuns}
                  onChange={(e) =>
                    setMatchInfo((p) => ({
                      ...p,
                      targetRuns:
                        e.target.value === ""
                          ? ""
                          : Math.max(1, Number(e.target.value)),
                    }))
                  }
                />
              </div>
            )}

            {/* Result */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Result
              </label>
              <Select
                value={matchInfo.result}
                onValueChange={(value) =>
                  setMatchInfo((p) => ({ ...p, result: value as Result }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Result" />
                </SelectTrigger>
                <SelectContent>
                  {resultOptions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Teams */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Batting Team
              </label>
              <Input
                placeholder="e.g., My Club"
                value={innings.battingTeam}
                onChange={(e) =>
                  setInnings((p) => ({ ...p, battingTeam: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Bowling Team
              </label>
              <Input
                placeholder="e.g., Opponent Club"
                value={innings.bowlingTeam}
                onChange={(e) =>
                  setInnings((p) => ({ ...p, bowlingTeam: e.target.value }))
                }
              />
            </div>

            {/* Score summary */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Runs
              </label>
              <Input
                type="number"
                min={0}
                value={innings.runs}
                onChange={(e) =>
                  setInnings((p) => ({
                    ...p,
                    runs:
                      e.target.value === ""
                        ? ""
                        : Math.max(0, Number(e.target.value)),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Wickets
              </label>
              <Input
                type="number"
                min={0}
                max={10}
                value={innings.wickets}
                onChange={(e) =>
                  setInnings((p) => ({
                    ...p,
                    wickets:
                      e.target.value === ""
                        ? ""
                        : Math.max(
                            0,
                            Math.min(10, Number(e.target.value))
                          ),
                  }))
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Overs (e.g., 20 or 19.4)
              </label>
              <Input
                type="number"
                step="0.1"
                min={0}
                max={20}
                value={innings.overs}
                onChange={(e) =>
                  setInnings((p) => ({
                    ...p,
                    overs:
                      e.target.value === ""
                        ? ""
                        : Math.max(0, Math.min(20, Number(e.target.value))),
                  }))
                }
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <PlayerContributions value={players} onChange={setPlayers} />
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review your inputs before saving.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold mb-2">Match Info</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(matchInfo, null, 2)}
                </pre>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold mb-2">Innings Summary</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(innings, null, 2)}
                </pre>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold mb-2">Players</h3>
                <pre className="text-xs whitespace-pre-wrap">
                  {JSON.stringify(players, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav controls */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="outline" onClick={goBack} disabled={step === 1}>
          Back
        </Button>
        {step < 4 ? (
          <Button onClick={goNext} disabled={!canGoNext}>
            Next
          </Button>
        ) : (
          <Button
            className="bg-gradient-primary text-primary-foreground"
            onClick={handleSave}
          >
            Save Match (UI-only)
          </Button>
        )}
      </div>
    </div>
  );
}
