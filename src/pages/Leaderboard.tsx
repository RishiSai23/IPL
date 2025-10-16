// file: src/pages/Leaderboard.tsx
import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listMatches } from "@/lib/localStore";
import { buildLeaderboard, type LeaderboardRow } from "@/lib/aggregate";
import { Trophy, RefreshCw, Filter, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";

type RoleFilter = "all" | "batter" | "bowler" | "all-rounder" | "wicket-keeper";
type SortKey = "avgTalentIndex" | "matches" | "avgBattingCXI" | "avgBowlingCXI" | "avgFieldingPM";

export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [role, setRole] = useState<RoleFilter>("all");
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("avgTalentIndex");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const refresh = () => {
    const matches = listMatches();
    const lb = buildLeaderboard(matches);
    setRows(lb);
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    let data = [...rows];

    if (role !== "all") {
      data = data.filter((r) => r.primaryRole === role);
    }
    if (q.trim()) {
      const needle = q.toLowerCase();
      data = data.filter((r) => r.name.toLowerCase().includes(needle));
    }

    data.sort((a, b) => {
      const dir = sortOrder === "desc" ? -1 : 1;

      const get = (r: LeaderboardRow) => {
        switch (sortKey) {
          case "avgTalentIndex":
            return r.avgTalentIndex ?? -1;
          case "matches":
            return r.matches ?? -1;
          case "avgBattingCXI":
            return r.avgBattingCXI ?? -1;
          case "avgBowlingCXI":
            return r.avgBowlingCXI ?? -1;
          case "avgFieldingPM":
            return r.avgFieldingPM ?? -1;
        }
      };

      const av = get(a);
      const bv = get(b);
      if (av === bv) {
        // tie-breaker by matches desc
        return (b.matches - a.matches) * (sortOrder === "desc" ? 1 : -1);
      }
      return av > bv ? dir : -dir;
    });

    return data;
  }, [rows, role, q, sortKey, sortOrder]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="w-7 h-7 text-primary" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              Context-adjusted Talent Index across saved matches on this device
            </p>
          </div>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search player by name"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <Select value={role} onValueChange={(val) => setRole(val as RoleFilter)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="batter">Batter</SelectItem>
                  <SelectItem value="bowler">Bowler</SelectItem>
                  <SelectItem value="all-rounder">All-Rounder</SelectItem>
                  <SelectItem value="wicket-keeper">Wicket-Keeper</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Select value={sortKey} onValueChange={(val) => setSortKey(val as SortKey)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avgTalentIndex">Talent Index</SelectItem>
                  <SelectItem value="matches">Matches</SelectItem>
                  <SelectItem value="avgBattingCXI">Batting CXI</SelectItem>
                  <SelectItem value="avgBowlingCXI">Bowling CXI</SelectItem>
                  <SelectItem value="avgFieldingPM">Fielding PM</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(val) => setSortOrder(val as "asc" | "desc")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle>Rankings</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {filtered.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  No results yet. Add matches or adjust filters.
                </p>
                <Button asChild className="bg-gradient-primary text-primary-foreground">
                  <Link to="/add-match">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Match
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-8 text-xs text-muted-foreground px-2">
                  <div>#</div>
                  <div className="col-span-2">Player</div>
                  <div>Role</div>
                  <div className="text-right">Matches</div>
                  <div className="text-right">Bat CXI</div>
                  <div className="text-right">Bowl CXI</div>
                  <div className="text-right">TI</div>
                </div>
                <div className="h-px bg-border" />

                {filtered.map((r, i) => (
                  <div
                    key={r.key}
                    className="grid grid-cols-8 items-center text-sm px-2 py-2 rounded-lg hover:bg-muted/40 transition-smooth"
                  >
                    <div className="font-medium text-muted-foreground">{i + 1}</div>
                    <div className="col-span-2 truncate">
                      <Link
                        to={`/scorecard/${encodeURIComponent(r.name)}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors"
                        title={`Open scorecard for ${r.name}`}
                      >
                        {r.name}
                      </Link>
                      <span className="ml-2 text-xs text-muted-foreground">
                        Last: {new Date(r.lastPlayedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      {r.primaryRole ? (
                        <Badge variant="outline" className="capitalize">
                          {r.primaryRole}
                        </Badge>
                      ) : (
                        <Badge variant="outline">—</Badge>
                      )}
                    </div>
                    <div className="text-right">{r.matches}</div>
                    <div className="text-right">{r.avgBattingCXI ?? "—"}</div>
                    <div className="text-right">{r.avgBowlingCXI ?? "—"}</div>
                    <div className="text-right font-semibold">{r.avgTalentIndex}</div>
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