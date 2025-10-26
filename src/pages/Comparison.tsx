import Navigation from "@/components/Navigation";
import type { Player } from "@/types/player";
import PlayerCard from "@/components/PlayerCard";
import PerformanceChart from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Trophy } from "lucide-react";
import { useState } from "react";
import PerformanceComparison from "@/components/PerformanceComparison";

// Removed unused mock blocks to avoid linter errors

const CompareCricketersPage = () => {
  const [player1, setPlayer1] = useState<Player | undefined>(undefined);
  const [player2, setPlayer2] = useState<Player | undefined>(undefined);

  // Simple winner helper
  const getWinner = (a: number, b: number): "player1" | "player2" | "tie" => {
    if (a > b) return "player1";
    if (b > a) return "player2";
    return "tie";
  };

  const comparisonMetrics =
    player1 && player2
      ? [
          {
            key: "runs",
            label: "Runs",
            player1: player1.stats.runs,
            player2: player2.stats.runs,
          },
          {
            key: "wickets",
            label: "Wickets",
            player1: player1.stats.wickets,
            player2: player2.stats.wickets,
          },
          {
            key: "strikeRate",
            label: "Strike Rate",
            player1: player1.stats.strikeRate,
            player2: player2.stats.strikeRate,
          },
          {
            key: "average",
            label: "Average",
            player1: player1.stats.average,
            player2: player2.stats.average,
          },
          {
            key: "matches",
            label: "Matches",
            player1: player1.stats.matches,
            player2: player2.stats.matches,
          },
          {
            key: "leadership",
            label: "Leadership",
            player1: player1.leadership,
            player2: player2.leadership,
          },
        ]
      : [];

  const radarData =
    player1 && player2
      ? [
          {
            metric: "Batting",
            player1: Math.min(10, (player1.stats.runs / 1000) * 2),
            player2: Math.min(10, (player2.stats.runs / 1000) * 2),
          },
          {
            metric: "Bowling",
            player1: Math.min(10, (player1.stats.wickets / 20) * 10),
            player2: Math.min(10, (player2.stats.wickets / 20) * 10),
          },
          {
            metric: "Experience",
            player1: Math.min(10, (player1.stats.matches / 50) * 10),
            player2: Math.min(10, (player2.stats.matches / 50) * 10),
          },
          {
            metric: "Leadership",
            player1: player1.leadership,
            player2: player2.leadership,
          },
          {
            metric: "Value",
            player1: Math.min(
              10,
              (player1.auctionValue.predicted / 20000000) * 10
            ),
            player2: Math.min(
              10,
              (player2.auctionValue.predicted / 20000000) * 10
            ),
          },
        ]
      : [];

  const getBetterPlayer = () => {
    if (!player1 || !player2) return null;
    let p1Wins = 0,
      p2Wins = 0;
    comparisonMetrics.forEach((metric) => {
      const winner = getWinner(metric.player1, metric.player2);
      if (winner === "player1") p1Wins++;
      if (winner === "player2") p2Wins++;
    });
    if (p1Wins > p2Wins)
      return { winner: player1, score: `${p1Wins}-${p2Wins}` };
    if (p2Wins > p1Wins)
      return { winner: player2, score: `${p2Wins}-${p1Wins}` };
    return { winner: null, score: `${p1Wins}-${p2Wins}` };
  };

  const result = getBetterPlayer();

  // Player selection happens via PlayerCard's dialog

  // const handleSelectTrendingPlayer = (player: { id: string; name: string }) => {
  //   console.log("Selected trending player:", player.name);
  //   const selectedPlayer = mockPlayers.find((p) => p.id === player.id);
  //   if (selectedPlayer) {
  //     if (!player1) setPlayer1(selectedPlayer);
  //     else if (!player2) setPlayer2(selectedPlayer);
  //     else setPlayer2(selectedPlayer);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <Navigation />
      {/* <HeaderSection /> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Compare Cricketers
            </span>
          </h1>
          <p className="text-gray-300">
            Select two players to analyze head-to-head performance.
          </p>
        </div>

        {/* VS Section using PlayerCard with search dialog */}
        <div className="flex justify-center items-start gap-6">
          <div className="w-72">
            <PlayerCard
              title="Player 1"
              player={player1}
              onSelectPlayer={(p) => setPlayer1(p)}
            />
          </div>
          <div className="flex items-center h-full pt-10">
            <span className="text-2xl font-bold">VS</span>
          </div>
          <div className="w-72">
            <PlayerCard
              title="Player 2"
              player={player2}
              onSelectPlayer={(p) => setPlayer2(p)}
            />
          </div>
        </div>

        {/* Player selection moved into PlayerCard dialogs */}

        {/* Metrics Comparison */}
        {player1 && player2 && (
          <div className="space-y-6">
            {/* Themed Performance Comparison (replaces previous metrics block) */}
            <PerformanceComparison
              player1Name={player1.name}
              player2Name={player2.name}
              stats={comparisonMetrics.map((m) => {
                const format = (key: string, val: number) => {
                  if (key === "strikeRate" || key === "average")
                    return val.toFixed(1);
                  return Number.isFinite(val)
                    ? val.toLocaleString()
                    : String(val);
                };
                return {
                  label: m.label,
                  player1Value: m.player1,
                  player2Value: m.player2,
                  player1Display: format(m.key, m.player1),
                  player2Display: format(m.key, m.player2),
                };
              })}
            />

            {/* Radar Chart */}
            <Card className="glass-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <span className="text-white">Performance Radar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  type="radar"
                  data={radarData}
                  dataKey="player1"
                  xAxisKey="metric"
                  height={400}
                />
              </CardContent>
            </Card>

            {/* Overall Winner */}
            {result?.winner && (
              <Card className="glass-card shadow-card bg-cyan-500/10 border-cyan-500/20">
                <CardContent className="text-center py-6">
                  <Trophy className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white">
                    Overall Winner: {result.winner.name}
                  </h2>
                  <p className="text-gray-300">
                    Wins {result.score} across key metrics
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareCricketersPage;
