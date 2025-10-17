import PlayerContributions, {
  type PlayerContribution,
} from "@/components/match/PlayerContributions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { saveMatch, type SaveMatchInput } from "@/utils/matchService";


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

// ID Helper
const genId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `p_${Math.random().toString(36).slice(2)}_${Date.now()}`;

// Clone player data when duplicating
function clonePlayers(players: PlayerContribution[]) {
  return players.map((p) => ({
    ...p,
    id: genId(),
    batting: p.batting ? { ...p.batting } : undefined,
    bowling: p.bowling ? { ...p.bowling } : undefined,
    fielding: p.fielding ? { ...p.fielding } : undefined,
  }));
}



// Default states
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
  const [innings1, setInnings1] = useState<InningsSummary>(initialInnings);
  const [innings2, setInnings2] = useState<InningsSummary>(initialInnings);
  const [players, setPlayers] = useState<PlayerContribution[]>([]);
  const [openInnings, setOpenInnings] = useState<string>("1");
  const [playerType, setPlayerType] = useState<"all" | "batsman" | "bowler">("all");

  const [searchParams] = useSearchParams();
  const prefilledRef = useRef(false);

  // Prefill logic
  useEffect(() => {
    const dupId = searchParams.get("duplicateFrom");
    if (!dupId || prefilledRef.current) return;

    // NOTE: You can replace this with a Supabase fetch later
    prefilledRef.current = true;
    toast.success("Prefilled from saved match", {
      description: `Source ID: ${dupId}`,
    });
  }, [searchParams]);

  const hasPlayers = players.length > 0;

  // Step validation
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
      const validInnings = (inn: InningsSummary) =>
        !!inn.battingTeam &&
        !!inn.bowlingTeam &&
        inn.runs !== "" &&
        inn.wickets !== "" &&
        inn.overs !== "";
      return validInnings(innings1) || validInnings(innings2);
    }
    if (step === 3) {
      return hasPlayers;
    }
    return true;
  })();

  const goNext = () => setStep(step === 4 ? 4 : ((step + 1) as 1 | 2 | 3 | 4));
  const goBack = () => setStep(step === 1 ? 1 : ((step - 1) as 1 | 2 | 3 | 4));

  // --- SAVE TO SUPABASE ---
  // --- SAVE TO SUPABASE ---
  const handleSave = async () => {
    try {
      // Convert matchInfo to match table fields
      const matchToSave: SaveMatchInput = {
        date: matchInfo.date,
        venue: matchInfo.venue,
        pitch: matchInfo.pitch,
        opposition_strength: +matchInfo.oppositionStrength, // string -> number
        innings_no: +matchInfo.inningsNo, // string -> number
        target_runs: matchInfo.targetRuns !== "" ? matchInfo.targetRuns : null,
        result: matchInfo.result,
        innings1,
        innings2,
        players,
      };
  
      const savedMatch = await saveMatch(matchToSave);
  
      toast.success("✅ Match and players saved successfully", {
        description: `Match ID: ${savedMatch.id}`,
      });
  
      // Reset form
      setStep(1);
      setMatchInfo(initialMatchInfo);
      setInnings1(initialInnings);
      setInnings2(initialInnings);
      setPlayers([]);
    } catch (err: any) {
      toast.error("❌ Failed to save match", {
        description: err.message || "Unknown error",
      });
    }
  };
  


  const today = new Date().toISOString().split("T")[0];

  const renderInningsFields = (
    innings: InningsSummary,
    setInnings: (fn: (p: InningsSummary) => InningsSummary) => void
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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
              runs: e.target.value === "" ? "" : Math.max(0, +e.target.value),
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
                e.target.value === "" ? "" : Math.max(0, Math.min(10, +e.target.value)),
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
                e.target.value === "" ? "" : Math.max(0, Math.min(20, +e.target.value)),
            }))
          }
        />
      </div>
    </div>
  );

  const filteredPlayers = players.filter((p) => {
    if (playerType === "all") return true;
    if (playerType === "batsman") return !!p.batting;
    if (playerType === "bowler") return !!p.bowling;
    return true;
  });

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      {/* Step Header */}
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

      <div className="space-y-6">
        {/* Step 1 */}
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
                max={today}
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
            {/* Pitch Type */}
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
            {/* Opposition Strength */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Opposition Strength (1–5)
              </label>
              <Select
                value={matchInfo.oppositionStrength}
                onValueChange={(value) =>
                  setMatchInfo((p) => ({
                    ...p,
                    oppositionStrength: value as MatchInfo["oppositionStrength"],
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

        {/* Step 2 */}
        {step === 2 && (
          <Accordion
            type="single"
            collapsible
            value={openInnings}
            onValueChange={setOpenInnings}
          >
            <AccordionItem value="1">
              <AccordionTrigger>Innings 1 Summary</AccordionTrigger>
              <AccordionContent>
                {renderInningsFields(innings1, setInnings1)}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="2">
              <AccordionTrigger>Innings 2 Summary</AccordionTrigger>
              <AccordionContent>
                {renderInningsFields(innings2, setInnings2)}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <div className="mb-4">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Filter Player Type
              </label>
              <Select
                value={playerType}
                onValueChange={(value) =>
                  setPlayerType(value as "all" | "batsman" | "bowler")
                }
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select player type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="batsman">Batsman</SelectItem>
                  <SelectItem value="bowler">Bowler</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <PlayerContributions value={filteredPlayers} onChange={setPlayers} />
          </div>
        )}

        {/* Step 4 */}
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
                  {JSON.stringify({ innings1, innings2 }, null, 2)}
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

      {/* Navigation */}
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
            Save Match
          </Button>
        )}
      </div>
    </div>
  );
}

