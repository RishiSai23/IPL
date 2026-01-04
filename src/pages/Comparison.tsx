import { useEffect, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import ScoreBlock from "@/components/compare/ScoreBlock";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Trophy, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type Mode = "batting" | "bowling";

const ComparisonPage = () => {
  const [mode, setMode] = useState<Mode>("batting");
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectingFor, setSelectingFor] =
    useState<"player1" | "player2" | null>(null);
  const [player1, setPlayer1] = useState<any>();
  const [player2, setPlayer2] = useState<any>();
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // FETCH PLAYERS (STRICTLY MODE-DEPENDENT)
  // --------------------------------------------------
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);

        // 🔒 HARD RESET — prevents stale UI
        setPlayers([]);
        setPlayer1(undefined);
        setPlayer2(undefined);

        const tnURL =
          mode === "batting"
            ? "http://localhost:5000/api/v1/players/tn-smat-batters"
            : "http://localhost:5000/api/v1/players/tn-smat-bowlers";

        const klURL =
          mode === "batting"
            ? "http://localhost:5000/api/v1/players/ker-smat-batters"
            : "http://localhost:5000/api/v1/players/ker-smat-bowlers";

        const [tnRes, klRes] = await Promise.all([
          fetch(tnURL),
          fetch(klURL),
        ]);

        const tnData = await tnRes.json();
        const klData = await klRes.json();

        // 🛡️ DEFENSIVE ARRAY CHECK (CRITICAL)
        const tnPlayers = Array.isArray(tnData.players)
          ? tnData.players
          : [];
        const klPlayers = Array.isArray(klData.players)
          ? klData.players
          : [];

        setPlayers(
          [...tnPlayers, ...klPlayers].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
      } catch (err) {
        console.error("Failed to load players", err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [mode]);

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------------------------------
  // WINNING METRIC
  // --------------------------------------------------
  let winningMetricKey: string | null = null;

  if (player1 && player2) {
    const diffs: [string, number][] = [
      [
        "Pressure",
        Math.abs(
          player1.stats.pressureScore - player2.stats.pressureScore
        ),
      ],
      [
        "Base Skill",
        Math.abs(
          player1.stats.baseSkillScore - player2.stats.baseSkillScore
        ),
      ],
      [
        "Consistency",
        Math.abs(
          player1.stats.consistencyScore - player2.stats.consistencyScore
        ),
      ],
      [
        "Opposition",
        Math.abs(
          player1.stats.oppositionQualityScore -
            player2.stats.oppositionQualityScore
        ),
      ],
    ];

    winningMetricKey = diffs.sort((a, b) => b[1] - a[1])[0][0];
  }

  const winner =
    player1 && player2
      ? player1.stats.finalScore > player2.stats.finalScore
        ? player1
        : player2
      : null;

  const explanation =
    winner && winningMetricKey
      ? `${winner.name} is recommended due to superior ${winningMetricKey.toLowerCase()} performance in ${mode}.`
      : "";

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="text-cyan-400" />
              Compare SMAT {mode === "batting" ? "Batters" : "Bowlers"}
            </h1>
            <p className="text-gray-400 mt-1">
              Real Syed Mushtaq Ali Trophy data • Explainable intelligence
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={mode === "batting" ? "default" : "outline"}
              onClick={() => setMode("batting")}
            >
              Batting
            </Button>
            <Button
              variant={mode === "bowling" ? "default" : "outline"}
              onClick={() => setMode("bowling")}
            >
              Bowling
            </Button>
          </div>
        </div>

        {/* Player Cards */}
        <div className="flex justify-center gap-8">
          <PlayerCard
            title="Player 1"
            player={player1}
            onSelectPlayer={() => setSelectingFor("player1")}
          />
          <div className="text-2xl font-bold pt-10">VS</div>
          <PlayerCard
            title="Player 2"
            player={player2}
            onSelectPlayer={() => setSelectingFor("player2")}
          />
        </div>

        {/* Scores */}
        {player1 && player2 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[player1, player2].map((p) => (
                <Card
                  key={p.name}
                  className="bg-slate-900 border border-cyan-500/30"
                >
                  <CardHeader>
                    <CardTitle>{p.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScoreBlock
                      title="Pressure"
                      score={p.stats.pressureScore}
                      highlight={winningMetricKey === "Pressure"}
                    />
                    <ScoreBlock
                      title="Base Skill"
                      score={p.stats.baseSkillScore}
                      highlight={winningMetricKey === "Base Skill"}
                    />
                    <ScoreBlock
                      title="Consistency"
                      score={p.stats.consistencyScore}
                      highlight={winningMetricKey === "Consistency"}
                    />
                    <ScoreBlock
                      title="Opposition"
                      score={p.stats.oppositionQualityScore}
                      highlight={winningMetricKey === "Opposition"}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-cyan-500/10 border border-cyan-500/20">
              <CardContent className="text-center py-6 space-y-4">
                <Trophy className="mx-auto text-cyan-400" size={40} />
                <h2 className="text-xl font-bold">
                  Recommended Pick: {winner?.name}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Info size={16} />
                  {explanation}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Selection Dialog */}
        <Dialog open={!!selectingFor} onOpenChange={() => setSelectingFor(null)}>
          <DialogContent className="bg-gray-900 flex flex-col gap-4 max-h-[80vh]">
            <DialogTitle>Select Player</DialogTitle>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />
            <ScrollArea className="flex-1">
              {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : (
                filtered.map((p) => (
                  <Button
                    key={p.name}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      selectingFor === "player1"
                        ? setPlayer1(p)
                        : setPlayer2(p);
                      setSelectingFor(null);
                      setSearch("");
                    }}
                  >
                    {p.name}
                  </Button>
                ))
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ComparisonPage;
