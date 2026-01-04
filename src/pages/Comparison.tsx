import { useEffect, useState } from "react";
import PlayerCard from "@/components/PlayerCard";
import ScoreBlock from "@/components/compare/ScoreBlock";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Trophy, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const CompareCricketersPage = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectingFor, setSelectingFor] =
    useState<"player1" | "player2" | null>(null);
  const [player1, setPlayer1] = useState<any>();
  const [player2, setPlayer2] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:5000/api/v1/players/tn-smat-batters"
        );
        const data = await res.json();
        setPlayers(data.players || []);
      } catch (e) {
        console.error("Failed to load TN SMAT batters", e);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ============================
  // 🧠 WINNING METRIC DETECTION
  // ============================

  let winningMetricKey: string | null = null;

  if (player1 && player2) {
    const diffs = [
      {
        key: "Pressure Handling",
        diff: Math.abs(
          player1.stats.pressureScore - player2.stats.pressureScore
        ),
      },
      {
        key: "Base Skill",
        diff: Math.abs(
          player1.stats.baseSkillScore - player2.stats.baseSkillScore
        ),
      },
      {
        key: "Consistency",
        diff: Math.abs(
          player1.stats.consistencyScore - player2.stats.consistencyScore
        ),
      },
      {
        key: "Opposition Quality",
        diff: Math.abs(
          player1.stats.oppositionQualityScore -
            player2.stats.oppositionQualityScore
        ),
      },
    ];

    winningMetricKey = diffs.reduce((a, b) =>
      b.diff > a.diff ? b : a
    ).key;
  }

  // ============================
  // 🧠 EXPLAINABILITY TEXT
  // ============================

  const winner =
    player1 && player2
      ? player1.stats.finalScore > player2.stats.finalScore
        ? player1
        : player2
      : null;

  const explanationMap: Record<string, string> = {
    "Pressure Handling":
      "superior pressure handling in chases and high-impact situations",
    "Base Skill": "stronger overall batting skill and shot-making ability",
    "Consistency": "greater consistency across matches",
    "Opposition Quality": "better performances against strong opposition",
  };

  const explanationText =
    winner && winningMetricKey
      ? `${winner.name} is recommended due to ${explanationMap[winningMetricKey]}, which proved decisive in this comparison.`
      : "";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="text-cyan-400" />
            Compare TN SMAT Batters
          </h1>
          <p className="text-gray-400 mt-1">
            Real Syed Mushtaq Ali Trophy data • Explainable model-driven insights
          </p>
        </div>

        {/* Player Selection */}
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

        {player1 && player2 && (
          <>
            {/* Score Breakdown */}
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
                      title="Pressure Handling"
                      score={p.stats.pressureScore}
                      highlight={winningMetricKey === "Pressure Handling"}
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
                      title="Opposition Quality"
                      score={p.stats.oppositionQualityScore}
                      highlight={winningMetricKey === "Opposition Quality"}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Winner */}
            <Card className="bg-cyan-500/10 border border-cyan-500/20">
              <CardContent className="text-center py-6 space-y-4">
                <Trophy className="mx-auto text-cyan-400" size={40} />
                <h2 className="text-xl font-bold">
                  Recommended Pick: {winner?.name}
                </h2>

                {/* 🧠 Explainability Text */}
                <div className="flex items-start justify-center gap-2 text-sm text-gray-300 max-w-2xl mx-auto">
                  <Info className="text-cyan-400 mt-0.5" size={16} />
                  <p>{explanationText}</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Player Selection Dialog */}
        <Dialog open={!!selectingFor} onOpenChange={() => setSelectingFor(null)}>
          <DialogContent className="bg-gray-900">
            <DialogTitle>Select Player</DialogTitle>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player"
              className="mb-4"
            />

            <ScrollArea className="h-80">
              {loading ? (
                <p className="text-center text-gray-400">Loading...</p>
              ) : (
                filtered.map((p) => (
                  <Button
                    key={p.id}
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

export default CompareCricketersPage;
