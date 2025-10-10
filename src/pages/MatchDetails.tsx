// file: src/pages/MatchDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listMatches, type SavedMatch } from "@/lib/localStore";
import { computeScoresForMatch, type PlayerScore } from "@/lib/scoring";
import { ArrowLeft, Calendar, MapPin, Target, Trophy, Copy, ShieldCheck } from "lucide-react";

const pitchLabel: Record<string, string> = {
  flat: "Flat",
  green: "Green",
  dry_turning: "Dry & Turning",
  slow_low: "Slow & Low",
  two_paced: "Two-paced",
};

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<SavedMatch | null>(null);

  useEffect(() => {
    const all = listMatches();
    const m = all.find((x) => x.id === id) || null;
    setMatch(m);
  }, [id]);

  const batters = useMemo(() => {
    if (!match) return [];
    return match.players.filter((p) => {
      const b = p.batting;
      return b && (b.runs !== "" || b.balls !== "" || b.fours !== "" || b.sixes !== "");
    });
  }, [match]);

  const bowlers = useMemo(() => {
    if (!match) return [];
    return match.players.filter((p) => {
      const b = p.bowling;
      return b && (b.overs !== "" || b.runsConceded !== "" || b.wickets !== "");
    });
  }, [match]);

  const fielders = useMemo(() => {
    if (!match) return [];
    return match.players.filter((p) => {
      const f = p.fielding;
      if (!f) return false;
      const vals = [f.catches, f.runouts, f.stumpings, f.drops, f.boundarySaves].map((x) =>
        typeof x === "number" ? x : x === "" ? 0 : Number(x || 0)
      );
      return vals.some((n) => (Number.isFinite(n) ? n > 0 : false));
    });
  }, [match]);

  const scores = useMemo<PlayerScore[]>(() => (match ? computeScoresForMatch(match) : []), [match]);
  const sortedScores = useMemo(() => [...scores].sort((a, b) => b.talentIndex - a.talentIndex), [scores]);

  if (!match) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Card className="shadow-card">
            <CardContent className="py-10 text-center space-y-4">
              <h1 className="text-xl font-semibold text-foreground">Match not found</h1>
              <p className="text-muted-foreground text-sm">
                The match you’re looking for does not exist on this device.
              </p>
              <Button onClick={() => navigate("/matches")} className="bg-gradient-primary text-primary-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Matches
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/matches")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button asChild className="bg-gradient-primary text-primary-foreground">
              <Link to={`/add-match?duplicateFrom=${match.id}`}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate as new
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline">{pitchLabel[match.matchInfo.pitch] || match.matchInfo.pitch}</Badge>
            <Badge variant="outline">Opp: {match.matchInfo.oppositionStrength}/5</Badge>
            <Badge variant="outline">{match.matchInfo.inningsNo === "1" ? "1st Inns" : "2nd Inns"}</Badge>
          </div>
        </div>

        {/* Header */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-bold">
                  {match.innings.runs || 0}/{match.innings.wickets || 0}
                </span>
                <div className="space-y-0.5">
                  <div className="text-base text-foreground font-semibold">
                    {match.innings.battingTeam || "Batting Team"} vs {match.innings.bowlingTeam || "Bowling Team"}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(match.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" />
                      {match.matchInfo.result.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      Overs: {match.innings.overs || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[220px]">{match.matchInfo.venue || "—"}</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-0">
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">Match Info</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Date: <span className="text-foreground">{match.matchInfo.date || "—"}</span>
                </p>
                <p>
                  Pitch:{" "}
                  <span className="text-foreground">
                    {pitchLabel[match.matchInfo.pitch] || match.matchInfo.pitch}
                  </span>
                </p>
                <p>
                  Opposition Strength:{" "}
                  <span className="text-foreground">{match.matchInfo.oppositionStrength}/5</span>
                </p>
                <p>
                  Innings:{" "}
                  <span className="text-foreground">
                    {match.matchInfo.inningsNo === "1" ? "1st" : "2nd (Chase)"}{" "}
                  </span>
                </p>
                {match.matchInfo.inningsNo === "2" && (
                  <p>
                    Target: <span className="text-foreground">{match.matchInfo.targetRuns || "—"}</span>
                  </p>
                )}
                <p>
                  Result: <span className="text-foreground uppercase">{match.matchInfo.result}</span>
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">Innings Summary</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Batting Team: <span className="text-foreground">{match.innings.battingTeam || "—"}</span>
                </p>
                <p>
                  Bowling Team: <span className="text-foreground">{match.innings.bowlingTeam || "—"}</span>
                </p>
                <p>
                  Score:{" "}
                  <span className="text-foreground">
                    {match.innings.runs || 0}/{match.innings.wickets || 0}
                  </span>
                </p>
                <p>
                  Overs: <span className="text-foreground">{match.innings.overs || "—"}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batting, Bowling, Fielding, Context sections remain unchanged */}
        {/* ... (rest of file unchanged) */}
        {/* Player Contributions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batting */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle>Batting</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {batters.length === 0 ? (
                <p className="text-sm text-muted-foreground">No batting entries.</p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-6 text-xs text-muted-foreground">
                    <div className="col-span-2">Player</div>
                    <div className="text-right">R</div>
                    <div className="text-right">B</div>
                    <div className="text-right">4s</div>
                    <div className="text-right">6s</div>
                  </div>
                  <div className="h-px bg-border" />
                  {batters.map((p) => (
                    <div key={p.id} className="grid grid-cols-6 text-sm items-center">
                      <div className="col-span-2 truncate">
                        <span className="font-medium text-foreground">{p.name || "Unnamed"}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {p.batting?.roleInMatch || "—"}
                          {p.batting?.notOut ? " • NO" : ""}
                          {p.batting?.finisherFlag ? " • Finisher" : ""}
                        </span>
                      </div>
                      <div className="text-right">{p.batting?.runs ?? "—"}</div>
                      <div className="text-right">{p.batting?.balls ?? "—"}</div>
                      <div className="text-right">{p.batting?.fours ?? "—"}</div>
                      <div className="text-right">{p.batting?.sixes ?? "—"}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bowling */}
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle>Bowling</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {bowlers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bowling entries.</p>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-7 text-xs text-muted-foreground">
                    <div className="col-span-2">Player</div>
                    <div className="text-right">O</div>
                    <div className="text-right">R</div>
                    <div className="text-right">W</div>
                    <div className="text-right">Wd</div>
                    <div className="text-right">Nb</div>
                  </div>
                  <div className="h-px bg-border" />
                  {bowlers.map((p) => (
                    <div key={p.id} className="grid grid-cols-7 text-sm items-center">
                      <div className="col-span-2 truncate">
                        <span className="font-medium text-foreground">{p.name || "Unnamed"}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{p.primaryRole || "—"}</span>
                      </div>
                      <div className="text-right">{p.bowling?.overs ?? "—"}</div>
                      <div className="text-right">{p.bowling?.runsConceded ?? "—"}</div>
                      <div className="text-right">{p.bowling?.wickets ?? "—"}</div>
                      <div className="text-right">{p.bowling?.wides ?? "—"}</div>
                      <div className="text-right">{p.bowling?.noBalls ?? "—"}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Fielding */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle>Fielding</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {fielders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No fielding entries.</p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-7 text-xs text-muted-foreground">
                  <div className="col-span-2">Player</div>
                  <div className="text-right">Catches</div>
                  <div className="text-right">Run-outs</div>
                  <div className="text-right">Stumpings</div>
                  <div className="text-right">Drops</div>
                  <div className="text-right">Saves</div>
                </div>
                <div className="h-px bg-border" />
                {fielders.map((p) => (
                  <div key={p.id} className="grid grid-cols-7 text-sm items-center">
                    <div className="col-span-2 truncate">
                      <span className="font-medium text-foreground">{p.name || "Unnamed"}</span>
                    </div>
                    <div className="text-right">{p.fielding?.catches ?? 0}</div>
                    <div className="text-right">{p.fielding?.runouts ?? 0}</div>
                    <div className="text-right">{p.fielding?.stumpings ?? 0}</div>
                    <div className="text-right">{p.fielding?.drops ?? 0}</div>
                    <div className="text-right">{p.fielding?.boundarySaves ?? 0}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Context Scores (Preview) */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle>Context Scores (Preview)</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {sortedScores.length === 0 ? (
              <p className="text-sm text-muted-foreground">No player contributions to score.</p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-6 text-xs text-muted-foreground">
                  <div className="col-span-2">Player</div>
                  <div className="text-right">Bat CXI</div>
                  <div className="text-right">Bowl CXI</div>
                  <div className="text-right">Field PM</div>
                  <div className="text-right">Talent Index</div>
                </div>
                <div className="h-px bg-border" />
                {sortedScores.map((s) => (
                  <div key={s.playerId} className="grid grid-cols-6 text-sm items-center">
                    <div className="col-span-2 truncate">
                      <span className="font-medium text-foreground">{s.name}</span>
                      {s.primaryRole && (
                        <span className="ml-2 text-xs text-muted-foreground capitalize">• {s.primaryRole}</span>
                      )}
                    </div>
                    <div className="text-right">{s.battingCXI ?? "—"}</div>
                    <div className="text-right">{s.bowlingCXI ?? "—"}</div>
                    <div className="text-right">{s.fieldingPM ?? "—"}</div>
                    <div className="text-right font-semibold text-foreground">{s.talentIndex}</div>
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
