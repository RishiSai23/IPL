import { useEffect, useState } from "react";
import type { Player } from "@/types/player";
import PlayerCard from "@/components/PlayerCard";
import PerformanceComparison from "@/components/PerformanceComparison";
import PerformanceChart from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Trophy } from "lucide-react";
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

  const metrics =
    player1 && player2
      ? [
          {
            label: "Runs",
            p1: player1.stats.runs,
            p2: player2.stats.runs,
          },
          {
            label: "Average",
            p1: player1.stats.average,
            p2: player2.stats.average,
          },
          {
            label: "Strike Rate",
            p1: player1.stats.strikeRate,
            p2: player2.stats.strikeRate,
          },
          {
            label: "Final Score",
            p1: player1.stats.finalScore,
            p2: player2.stats.finalScore,
          },
        ]
      : [];

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="text-cyan-400" />
            Compare TN SMAT Batters
          </h1>
          <p className="text-gray-400 mt-1">
            Real Syed Mushtaq Ali Trophy data • Model-driven scores
          </p>
        </div>

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
            <PerformanceComparison
              player1Name={player1.name}
              player2Name={player2.name}
              stats={metrics.map((m) => ({
                label: m.label,
                player1Value: m.p1,
                player2Value: m.p2,
                player1Display: m.p1.toFixed(2),
                player2Display: m.p2.toFixed(2),
              }))}
            />

            <Card className="bg-slate-900 border border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Target className="text-cyan-400" />
                  Batting Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  type="radar"
                  data={[
                    {
                      metric: "Runs",
                      player1: player1.stats.runs / 20,
                      player2: player2.stats.runs / 20,
                    },
                    {
                      metric: "Strike Rate",
                      player1: player1.stats.strikeRate / 20,
                      player2: player2.stats.strikeRate / 20,
                    },
                    {
                      metric: "Final Score",
                      player1: player1.stats.finalScore / 10,
                      player2: player2.stats.finalScore / 10,
                    },
                  ]}
                  dataKey="player1"
                  xAxisKey="metric"
                  height={350}
                />
              </CardContent>
            </Card>

            <Card className="bg-cyan-500/10 border border-cyan-500/20">
              <CardContent className="text-center py-6">
                <Trophy className="mx-auto text-cyan-400 mb-3" size={40} />
                <h2 className="text-xl font-bold">
                  Winner:{" "}
                  {player1.stats.finalScore >
                  player2.stats.finalScore
                    ? player1.name
                    : player2.name}
                </h2>
              </CardContent>
            </Card>
          </>
        )}

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
