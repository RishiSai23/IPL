// file: src/pages/PlayerScorecard.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listMatches } from "@/lib/localStore";
import { computeScoresForMatch } from "@/lib/scoring";
import PerformanceChart from "@/components/PerformanceChart";
import { ArrowLeft, Calendar, MapPin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
type BatRole = "opener" | "middle" | "finisher";

type Role = "batter" | "bowler" | "all-rounder" | "wicket-keeper" | undefined;

type PlayerEvent = {
  matchId: string;
  createdAt: string; // ISO
  venue: string;
  pitch: string;
  inningsNo: "1" | "2";
  opp: string; // 1–5
  name: string;
  role?: Role;
  bat?: number | null;
  bowl?: number | null;
  field?: number | null;
  ti: number;
  // badge fields
  batRole?: BatRole; // opener | middle | finisher
  finisher?: boolean; // from batting.finisherFlag
  deathOvers?: number; // from bowling.oversInDeath
  catches?: number; // from fielding.catches
};

function shortDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function PlayerScorecard() {
  const { playerKey } = useParams<{ playerKey: string }>();
  const navigate = useNavigate();
  const [events, setEvents] = useState<PlayerEvent[]>([]);

  useEffect(() => {
    const key = (playerKey ? decodeURIComponent(playerKey) : "").toLowerCase();
    const matches = listMatches();

    const evts: PlayerEvent[] = [];
    for (const m of matches) {
      const scores = computeScoresForMatch(m);
      for (const s of scores) {
        const nameKey = (s.name?.trim() || "unnamed").toLowerCase();
        if (nameKey === key) {
          // Find the raw player entry in this match to access extra fields for badges
          const pRaw = m.players.find(
            (pp) => (pp.name?.trim().toLowerCase() || "unnamed") === nameKey
          );

          evts.push({
            matchId: m.id,
            createdAt: m.createdAt,
            venue: m.matchInfo.venue || "—",
            pitch: m.matchInfo.pitch,
            inningsNo: m.matchInfo.inningsNo,
            opp: m.matchInfo.oppositionStrength,
            name: s.name,
            role: s.primaryRole,
            bat: s.battingCXI,
            bowl: s.bowlingCXI,
            field: s.fieldingPM,
            ti: s.talentIndex,
            // badge fields
            batRole: pRaw?.batting?.roleInMatch as BatRole | undefined,
            finisher: !!(pRaw as any)?.batting?.finisherFlag,
            deathOvers:
              typeof (pRaw as any)?.bowling?.oversInDeath === "number"
                ? (pRaw as any).bowling.oversInDeath
                : 0,
            catches:
              typeof pRaw?.fielding?.catches === "number"
                ? pRaw.fielding.catches
                : 0,
          });
        }
      }
    }

    // newest first
    evts.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    setEvents(evts);
  }, [playerKey]);

  const name =
    events[0]?.name || (playerKey ? decodeURIComponent(playerKey) : "Player");
  const role: Role = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((e) => {
      if (e.role) counts[e.role] = (counts[e.role] || 0) + 1;
    });
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return (best?.[0] as Role) || undefined;
  }, [events]);

  const aggregates = useMemo(() => {
    if (events.length === 0) {
      return {
        matches: 0,
        avgTI: 0,
        avgBat: null as number | null,
        avgBowl: null as number | null,
        avgField: null as number | null,
      };
    }
    let tiSum = 0,
      tiCount = 0;
    let batSum = 0,
      batCount = 0;
    let bowlSum = 0,
      bowlCount = 0;
    let fieldSum = 0,
      fieldCount = 0;

    for (const e of events) {
      tiSum += e.ti;
      tiCount++;
      if (typeof e.bat === "number") {
        batSum += e.bat;
        batCount++;
      }
      if (typeof e.bowl === "number") {
        bowlSum += e.bowl;
        bowlCount++;
      }
      if (typeof e.field === "number") {
        fieldSum += e.field;
        fieldCount++;
      }
    }
    return {
      matches: events.length,
      avgTI: Math.round(tiSum / (tiCount || 1)),
      avgBat: batCount ? Math.round(batSum / batCount) : null,
      avgBowl: bowlCount ? Math.round(bowlSum / bowlCount) : null,
      avgField: fieldCount ? Math.round(fieldSum / fieldCount) : null,
    };
  }, [events]);

  const trendData = useMemo(() => {
    // oldest -> newest for chart
    const asc = [...events].sort(
      (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
    );
    return asc.map((e) => ({
      label: `${shortDate(e.createdAt)}`,
      ti: e.ti,
    }));
  }, [events]);

  // Badges based on simple rules
  const badges = useMemo(() => {
    const out: string[] = [];
    if (events.length === 0) return out;

    // Chase Master: 3+ chase matches and avg TI in chases >= 65
    const chases = events.filter((e) => e.inningsNo === "2");
    if (chases.length >= 3) {
      const avgChaseTI =
        chases.reduce((sum, e) => sum + e.ti, 0) / chases.length;
      if (avgChaseTI >= 65) out.push("Chase Master");
    }

    // Finisher: 3+ matches marked as finisher role or finisherFlag true
    const finisherCount = events.filter(
      (e) => e.batRole === "finisher" || e.finisher
    ).length;
    if (finisherCount >= 3) out.push("Finisher");

    // Death Specialist: total death overs >= 3 and avg bowl CXI in those matches >= 55
    const deathEvts = events.filter((e) => (e.deathOvers || 0) > 0);
    const totalDeathOvers = deathEvts.reduce(
      (sum, e) => sum + (e.deathOvers || 0),
      0
    );
    if (totalDeathOvers >= 3) {
      const avgDeathBowl =
        deathEvts.reduce((sum, e) => sum + (e.bowl ?? 0), 0) /
        (deathEvts.length || 1);
      if (avgDeathBowl >= 55) out.push("Death Specialist");
    }

    // Safe Hands: total catches >= 5
    const totalCatches = events.reduce((sum, e) => sum + (e.catches || 0), 0);
    if (totalCatches >= 5) out.push("Safe Hands");

    return out;
  }, [events]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/leaderboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {role ? (
            <Badge variant="outline" className="capitalize">
              {role}
            </Badge>
          ) : (
            <Badge variant="outline">—</Badge>
          )}
        </div>

        {/* Header */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 3)}
                </span>
                <div className="space-y-0.5">
                  <div className="text-xl text-foreground font-bold">
                    {name}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      Matches: {aggregates.matches}
                    </span>
                    {events[0] && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Last:{" "}
                          {new Date(events[0].createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {events[0].venue}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gradient-stats rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {aggregates.avgTI}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Talent Index
                  </div>
                </div>
                <div className="p-3 bg-gradient-stats rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {aggregates.avgBat ?? "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Bat CXI
                  </div>
                </div>
                <div className="p-3 bg-gradient-stats rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {aggregates.avgBowl ?? "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Bowl CXI
                  </div>
                </div>
                <div className="p-3 bg-gradient-stats rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {aggregates.avgField ?? "—"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg Field PM
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {badges.map((b) => (
                  <Badge
                    key={b}
                    variant="outline"
                    className={
                      b === "Chase Master"
                        ? "border-primary text-primary"
                        : b === "Finisher"
                        ? "border-secondary text-secondary"
                        : b === "Death Specialist"
                        ? "border-warning text-warning"
                        : "border-success text-success"
                    }
                  >
                    {b}
                  </Badge>
                ))}
              </div>
            )}

            <PerformanceChart
              type="line"
              data={trendData}
              dataKey="ti"
              xAxisKey="label"
              color="hsl(var(--primary))"
              height={260}
            />
          </CardContent>
        </Card>

        {/* Match-by-Match breakdown */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle>Match-by-Match</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {events.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No matches found for this player on this device.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-10 text-xs text-muted-foreground px-2">
                  <div>Date</div>
                  <div className="col-span-2">Venue</div>
                  <div>Pitch</div>
                  <div>Inns</div>
                  <div className="text-right">Opp</div>
                  <div className="text-right">Bat CXI</div>
                  <div className="text-right">Bowl CXI</div>
                  <div className="text-right">TI</div>
                  <div className="text-right">Action</div>
                </div>
                <div className="h-px bg-border" />
                {events.map((e) => (
                  <div
                    key={e.matchId + e.createdAt}
                    className="grid grid-cols-10 items-center text-sm px-2 py-2 rounded-lg hover:bg-muted/40 transition-smooth"
                  >
                    <div>{shortDate(e.createdAt)}</div>
                    <div className="col-span-2 truncate">{e.venue}</div>
                    <div className="capitalize">
                      {e.pitch.replace("_", " ")}
                    </div>
                    <div>{e.inningsNo === "1" ? "1st" : "2nd"}</div>
                    <div className="text-right">{e.opp}/5</div>
                    <div className="text-right">
                      {typeof e.bat === "number" ? e.bat : "—"}
                    </div>
                    <div className="text-right">
                      {typeof e.bowl === "number" ? e.bowl : "—"}
                    </div>
                    <div className="text-right font-semibold">{e.ti}</div>
                    <div className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/matches/${e.matchId}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
