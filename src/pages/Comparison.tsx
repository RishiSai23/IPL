"use client";

import Navigation from "@/components/Navigation";
import PerformanceChart from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPlayers } from "@/data/mockPlayers";
import { motion } from "framer-motion";
import { BarChart3, Search, Target, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";

const Comparison = () => {
  const [player1, setPlayer1] = useState<any | null>(null);
  const [player2, setPlayer2] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [filteredPlayers, setFilteredPlayers] = useState(mockPlayers);

  // Filter players by search
  useEffect(() => {
    setFilteredPlayers(
      mockPlayers.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const getWinner = (val1: number, val2: number) => {
    if (val1 > val2) return "player1";
    if (val2 > val1) return "player2";
    return "tie";
  };

  const comparisonMetrics =
    player1 && player2
      ? [
          { key: "runs", label: "Runs", player1: player1.stats.runs, player2: player2.stats.runs },
          { key: "wickets", label: "Wickets", player1: player1.stats.wickets, player2: player2.stats.wickets },
          { key: "strikeRate", label: "Strike Rate", player1: player1.stats.strikeRate, player2: player2.stats.strikeRate },
          { key: "average", label: "Average", player1: player1.stats.average, player2: player2.stats.average },
          { key: "matches", label: "Matches", player1: player1.stats.matches, player2: player2.stats.matches },
          { key: "leadership", label: "Leadership", player1: player1.leadership, player2: player2.leadership },
        ]
      : [];

  const radarData =
    player1 && player2
      ? [
          { metric: "Batting", player1: Math.min(10, (player1.stats.runs / 1000) * 2), player2: Math.min(10, (player2.stats.runs / 1000) * 2) },
          { metric: "Bowling", player1: Math.min(10, (player1.stats.wickets / 20) * 10), player2: Math.min(10, (player2.stats.wickets / 20) * 10) },
          { metric: "Experience", player1: Math.min(10, (player1.stats.matches / 50) * 10), player2: Math.min(10, (player2.stats.matches / 50) * 10) },
          { metric: "Leadership", player1: player1.leadership, player2: player2.leadership },
          { metric: "Value", player1: Math.min(10, (player1.auctionValue.predicted / 20000000) * 10), player2: Math.min(10, (player2.auctionValue.predicted / 20000000) * 10) },
        ]
      : [];

  const getBetterPlayer = () => {
    if (!player1 || !player2) return null;
    let p1Wins = 0, p2Wins = 0;
    comparisonMetrics.forEach((metric) => {
      const winner = getWinner(metric.player1, metric.player2);
      if (winner === "player1") p1Wins++;
      if (winner === "player2") p2Wins++;
    });
    if (p1Wins > p2Wins) return { winner: player1, score: `${p1Wins}-${p2Wins}` };
    if (p2Wins > p1Wins) return { winner: player2, score: `${p2Wins}-${p1Wins}` };
    return { winner: null, score: `${p1Wins}-${p2Wins}` };
  };

  const result = getBetterPlayer();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span>Compare Cricketers</span>
          </h1>
          <p className="text-muted-foreground">
            Select two players to analyze head-to-head performance.
          </p>
        </div>

        {/* VS Section */}
        <div className="flex justify-center items-center space-x-6">
          {/* Player 1 */}
          <motion.div
            className="relative w-36 h-36 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-4 border-gray-600"
            whileHover={{ scale: 1.05 }}
            onClick={() => {}}
          >
            {player1 ? (
              <>
                <img src={player1.image} alt={player1.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 bg-primary/70 px-2 rounded text-xs">{player1.role}</span>
              </>
            ) : (
              <img
                src="/human-placeholder.png" // 👈 replace with your snipped human logo
                alt="Default Human"
                className="w-20 h-20 opacity-60"
              />
            )}
          </motion.div>

          <span className="text-2xl font-bold">VS</span>

          {/* Player 2 */}
          <motion.div
            className="relative w-36 h-36 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-4 border-gray-600"
            whileHover={{ scale: 1.05 }}
            onClick={() => {}}
          >
            {player2 ? (
              <>
                <img src={player2.image} alt={player2.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 bg-secondary/70 px-2 rounded text-xs">{player2.role}</span>
              </>
            ) : (
              <img
                src="/human-placeholder.png" // 👈 replace with your snipped human logo
                alt="Default Human"
                className="w-20 h-20 opacity-60"
              />
            )}
          </motion.div>
        </div>

        {/* Search & Player List */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <Search className="w-5 h-5 text-primary" />
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 text-white outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredPlayers.map((player) => (
              <motion.button
                key={player.id}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded-full text-sm text-white hover:bg-primary transition"
                onClick={() => {
                  if (!player1) setPlayer1(player);
                  else if (!player2 && player.id !== player1.id) setPlayer2(player);
                }}
              >
                <img src={player.image} alt={player.name} className="w-6 h-6 rounded-full" />
                {player.name}
                <span className="font-bold">+</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Metrics Comparison */}
        {player1 && player2 && (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span>Metrics Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {comparisonMetrics.map((metric) => {
                  const winner = getWinner(metric.player1, metric.player2);
                  return (
                    <div key={metric.key} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                      <span className="font-medium w-32">{metric.label}</span>
                      <div className="w-20 h-3 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${winner === "player1" ? "bg-primary" : "bg-gray-400"}`}
                          style={{ width: `${(metric.player1 / Math.max(metric.player1, metric.player2)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-center">VS</span>
                      <div className="w-20 h-3 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${winner === "player2" ? "bg-secondary" : "bg-gray-400"}`}
                          style={{ width: `${(metric.player2 / Math.max(metric.player1, metric.player2)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span>Performance Radar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart type="radar" data={radarData} dataKey="player1" xAxisKey="metric" height={400} />
              </CardContent>
            </Card>

            {/* Overall Winner */}
            {result?.winner && (
              <>
                <Confetti numberOfPieces={300} recycle={false} />
                <Card className="shadow-card bg-primary/10 border-primary/20">
                  <CardContent className="text-center py-6">
                    <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Overall Winner: {result.winner.name}</h2>
                    <p className="text-muted-foreground">Wins {result.score} across key metrics</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comparison;
