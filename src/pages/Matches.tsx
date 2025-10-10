// file: src/pages/Matches.tsx
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listMatches, deleteMatch, type SavedMatch } from "@/lib/localStore";
import { toast } from "sonner";
import { Calendar, MapPin, Target, Trophy, RefreshCw, Trash2, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";

const pitchLabel: Record<string, string> = {
  flat: "Flat",
  green: "Green",
  dry_turning: "Dry & Turning",
  slow_low: "Slow & Low",
  two_paced: "Two-paced",
};

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

export default function Matches() {
  const [matches, setMatches] = useState<SavedMatch[]>([]);

  const refresh = () => {
    const all = listMatches();
    setMatches(all);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = (id: string) => {
    deleteMatch(id);
    toast.success("Match deleted");
    refresh();
  };

  const handleExport = () => {
    const data = listMatches();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cricscout-matches-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Matches</h1>
            <p className="text-muted-foreground">Saved locally on your device (no login required)</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild className="bg-gradient-primary text-primary-foreground">
              <Link to="/add-match">
                <Plus className="w-4 h-4 mr-2" />
                Add Match
              </Link>
            </Button>
            <Button variant="outline" onClick={refresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {matches.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12 text-center">
              <p className="text-foreground font-medium mb-2">No matches saved yet</p>
              <p className="text-muted-foreground mb-4">
                Use “Add Match” to enter a new T20 innings and player contributions.
              </p>
              <Button asChild className="bg-gradient-primary text-primary-foreground">
                <Link to="/add-match">Add Match</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((m) => (
              <Card key={m.id} className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                        {m.innings.runs || 0}/{m.innings.wickets || 0}
                      </span>
                      <div className="space-y-0.5">
                        <div className="text-sm text-foreground font-semibold">
                          {m.innings.battingTeam || "Batting Team"} vs {m.innings.bowlingTeam || "Bowling Team"}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(m.createdAt)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                            {m.matchInfo.result.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{pitchLabel[m.matchInfo.pitch] || m.matchInfo.pitch}</Badge>
                      <Badge variant="outline">Opp: {m.matchInfo.oppositionStrength}/5</Badge>
                      <Badge variant="outline">{m.matchInfo.inningsNo === "1" ? "1st Inns" : "2nd Inns"}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{m.matchInfo.venue || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Overs: <span className="font-medium">{m.innings.overs || "—"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button asChild variant="outline">
                      <Link to={`/matches/${m.id}`}>View Details</Link>
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(m.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}