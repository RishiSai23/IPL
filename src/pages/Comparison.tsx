// file: src/pages/Comparison.tsx
import { useState } from "react";
import Navigation from "@/components/Navigation";
import PerformanceChart from "@/components/PerformanceChart";
import { mockPlayers } from "@/data/mockPlayers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Target,
  Award,
  Activity,
  BarChart3,
  Zap,
  Trophy,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Comparison = () => {
  const [player1, setPlayer1] = useState(mockPlayers[0]);
  const [player2, setPlayer2] = useState(mockPlayers[1]);

  const comparisonMetrics = [
    { key: "runs", label: "Runs", player1: player1.stats.runs, player2: player2.stats.runs },
    { key: "wickets", label: "Wickets", player1: player1.stats.wickets, player2: player2.stats.wickets },
    { key: "strikeRate", label: "Strike Rate", player1: player1.stats.strikeRate, player2: player2.stats.strikeRate },
    { key: "average", label: "Average", player1: player1.stats.average, player2: player2.stats.average },
    { key: "matches", label: "Matches", player1: player1.stats.matches, player2: player2.stats.matches },
    { key: "leadership", label: "Leadership", player1: player1.leadership, player2: player2.leadership },
  ];

  const radarData = [
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
      player1: Math.min(10, (player1.auctionValue.predicted / 20000000) * 10),
      player2: Math.min(10, (player2.auctionValue.predicted / 20000000) * 10),
    },
  ];

  const getWinner = (value1: number, value2: number) => {
    if (value1 > value2) return "player1";
    if (value2 > value1) return "player2";
    return "tie";
  };

  const getBetterPlayer = () => {
    let player1Wins = 0;
    let player2Wins = 0;

    comparisonMetrics.forEach((metric) => {
      const winner = getWinner(metric.player1, metric.player2);
      if (winner === "player1") player1Wins++;
      if (winner === "player2") player2Wins++;
    });

    if (player1Wins > player2Wins) return { winner: player1, score: `${player1Wins}-${player2Wins}` };
    if (player2Wins > player1Wins) return { winner: player2, score: `${player2Wins}-${player1Wins}` };
    return { winner: null, score: `${player1Wins}-${player2Wins}` };
  };

  const result = getBetterPlayer();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3 mb-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span>Player Comparison</span>
          </h1>
          <p className="text-muted-foreground">
            Head-to-head analysis of IPL players across multiple performance metrics
          </p>
        </div>

        {/* Player Selection */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Select Players to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Player 1</label>
                <Select
                  value={player1.id}
                  onValueChange={(value) => {
                    const player = mockPlayers.find((p) => p.id === value);
                    if (player && player.id !== player2.id) setPlayer1(player);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlayers
                      .filter((p) => p.id !== player2.id)
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{player.name}</span>
                            <span className="text-xs text-muted-foreground">- {player.team}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Player 2</label>
                <Select
                  value={player2.id}
                  onValueChange={(value) => {
                    const player = mockPlayers.find((p) => p.id === value);
                    if (player && player.id !== player1.id) setPlayer2(player);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlayers
                      .filter((p) => p.id !== player1.id)
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{player.name}</span>
                            <span className="text-xs text-muted-foreground">- {player.team}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[player1, player2].map((player, index) => (
            <Card key={player.id} className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? "bg-gradient-primary" : "bg-gradient-secondary"
                    }`}
                  >
                    {player.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{player.name}</h3>
                    <p className="text-sm text-muted-foreground">{player.team}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Position</span>
                    <Badge variant="outline">{player.position}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Age</span>
                    <span className="font-medium">{player.age} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Predicted Value</span>
                    <span className="font-bold text-primary">
                      ₹{(player.auctionValue.predicted / 10000000).toFixed(1)}Cr
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Winner */}
        {result.winner && (
          <Card className="shadow-card mb-8 bg-gradient-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Overall Winner: {result.winner.name}</h2>
                <p className="text-muted-foreground">Wins {result.score} across key performance metrics</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Metrics Comparison */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Detailed Metrics Comparison</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisonMetrics.map((metric) => {
                const winner = getWinner(metric.player1, metric.player2);

                return (
                  <div key={metric.key} className="flex items-center justify-between p-4 bg-gradient-stats rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="font-medium text-foreground min-w-[100px]">{metric.label}</span>

                      <div className="flex items-center space-x-4 flex-1">
                        <div
                          className={`text-right min-w-[80px] ${
                            winner === "player1" ? "font-bold text-primary" : "text-muted-foreground"
                          }`}
                        >
                          {typeof metric.player1 === "number" ? metric.player1.toFixed(1) : metric.player1}
                        </div>

                        <div className="text-muted-foreground font-medium">VS</div>

                        <div
                          className={`text-left min-w-[80px] ${
                            winner === "player2" ? "font-bold text-secondary" : "text-muted-foreground"
                          }`}
                        >
                          {typeof metric.player2 === "number" ? metric.player2.toFixed(1) : metric.player2}
                        </div>
                      </div>

                      {winner !== "tie" && (
                        <div className="min-w-[100px] text-right">
                          <Badge
                            variant="outline"
                            className={winner === "player1" ? "border-primary text-primary" : "border-secondary text-secondary"}
                          >
                            {(winner === "player1" ? player1.name : player2.name).split(" ")[0]} Wins
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart Comparison */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Performance Radar</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <PerformanceChart
                type="radar"
                data={radarData}
                dataKey="player1"
                xAxisKey="metric"
                color="hsl(var(--primary))"
                height={400}
              />

              <div className="absolute top-4 right-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">{player1.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium">{player2.name}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Comparison;