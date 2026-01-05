import { useEffect, useState } from "react";
import CompareHero from "@/components/compare/CompareHero";
import MetricRow from "@/components/compare/MetricRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, Trophy } from "lucide-react";

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
  // FETCH PLAYERS (UNCHANGED)
  // --------------------------------------------------
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
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
  // WINNING METRIC (NO DECIMALS)
  // --------------------------------------------------
  let winningMetricKey: string | null = null;
  let winningMetricDiff = 0;

  if (player1 && player2) {
    const diffs: [string, number][] = [
      ["pressure", Math.abs(player1.stats.pressureScore - player2.stats.pressureScore)],
      ["base skill", Math.abs(player1.stats.baseSkillScore - player2.stats.baseSkillScore)],
      ["consistency", Math.abs(player1.stats.consistencyScore - player2.stats.consistencyScore)],
      ["opposition quality", Math.abs(
        player1.stats.oppositionQualityScore -
        player2.stats.oppositionQualityScore
      )],
    ];

    const top = diffs.sort((a, b) => b[1] - a[1])[0];
    winningMetricKey = top[0];
    winningMetricDiff = Math.round(top[1]);
  }

  const winner =
    player1 && player2
      ? player1.stats.finalScore > player2.stats.finalScore
        ? player1
        : player2
      : null;

  const loser = winner === player1 ? player2 : player1;

  const confidence =
    winningMetricDiff >= 30
      ? "HIGH"
      : winningMetricDiff >= 15
      ? "MEDIUM"
      : "LOW";

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="text-cyan-400" />
              Compare SMAT Players
            </h1>
            <p className="text-gray-400 mt-1">
              Context-aware domestic intelligence
            </p>
          </div>

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

        {/* HERO */}
        <CompareHero
          player1={player1}
          player2={player2}
          onSelect={(slot) => setSelectingFor(slot)}
        />

        {/* METRICS */}
        {player1 && player2 && (
          <div className="space-y-4 mt-6">
            <MetricRow
              title="Pressure"
              leftScore={Math.round(player1.stats.pressureScore)}
              rightScore={Math.round(player2.stats.pressureScore)}
              highlight={winningMetricKey === "pressure"}
            />
            <MetricRow
              title="Base Skill"
              leftScore={Math.round(player1.stats.baseSkillScore)}
              rightScore={Math.round(player2.stats.baseSkillScore)}
              highlight={winningMetricKey === "base skill"}
            />
            <MetricRow
              title="Consistency"
              leftScore={Math.round(player1.stats.consistencyScore)}
              rightScore={Math.round(player2.stats.consistencyScore)}
              highlight={winningMetricKey === "consistency"}
            />
            <MetricRow
              title="Opposition Quality"
              leftScore={Math.round(player1.stats.oppositionQualityScore)}
              rightScore={Math.round(player2.stats.oppositionQualityScore)}
              highlight={winningMetricKey === "opposition quality"}
            />
          </div>
        )}

        {/* FINAL VERDICT */}
        {winner && winningMetricKey && (
          <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/30 rounded-2xl">
            <CardContent className="py-10 px-8 text-center space-y-5">

              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Trophy className="text-cyan-400" size={28} />
                </div>
              </div>

              <h2 className="text-2xl font-extrabold tracking-wide">
                Recommended Pick
              </h2>

              <div className="text-3xl font-bold text-purple-400">
                {winner.name}
              </div>

              <div className="text-sm text-yellow-400 font-semibold">
                Primary Differentiator: {winningMetricKey} (+{winningMetricDiff} points)
              </div>

              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {winner.name} is preferred over {loser?.name} due to a clear
                advantage in{" "}
                <span className="text-yellow-400 font-semibold">
                  {winningMetricKey}
                </span>{" "}
                when evaluated head-to-head under{" "}
                <span className="text-cyan-400 font-semibold">
                  {mode}
                </span>{" "}
                conditions in the Syed Mushtaq Ali Trophy.
              </p>

              <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />

              <div className="text-sm tracking-widest text-gray-400">
                Confidence Level:{" "}
                <span
                  className={
                    confidence === "HIGH"
                      ? "text-green-400"
                      : confidence === "MEDIUM"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }
                >
                  {confidence}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* PLAYER SELECTION DIALOG */}
        <Dialog open={!!selectingFor} onOpenChange={() => setSelectingFor(null)}>
          <DialogContent className="bg-gray-900 flex flex-col gap-4 max-h-[80vh]">
            <DialogTitle>Select Player</DialogTitle>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player"
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
