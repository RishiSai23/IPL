import { useState } from "react";
import Navigation from "@/components/Navigation";
import StatCard from "@/components/StatCard";
import PlayerCard from "@/components/PlayerCard";
import PerformanceChart from "@/components/PerformanceChart";
import { mockPlayers } from "@/data/mockPlayers";
import {
  Users,
  TrendingUp,
  Trophy,
  Target,
  BarChart3,
  Award,
  Zap,
  Activity,
  RotateCcw,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import ChartPlaceholder from "@/components/ChartPlaceholder";

const Index = () => {
  // ---------------- Compare Players Data ----------------
  const [players] = useState([
    {
      name: "Virat Kohli",
      country: "India",
      role: "Batsman",
      team: "Royal Challengers Bangalore",
      image: "",
    },
    {
      name: "Jasprit Bumrah",
      country: "India",
      role: "Bowler",
      team: "Mumbai Indians",
      image: "",
    },
  ]);

  const statsData = [
    { label: "Matches Played", player1: "294", player2: "120", icon: Target },
    {
      label: "Total Runs",
      player1: "25,716",
      player2: "149",
      icon: TrendingUp,
    },
    { label: "Wickets Taken", player1: "4", player2: "149", icon: Award },
    { label: "Strike Rate", player1: "93.5", player2: "85.2", icon: Zap },
    {
      label: "Batting Average",
      player1: "52.7",
      player2: "8.3",
      icon: Activity,
    },
    {
      label: "Bowling Economy",
      player1: "8.2",
      player2: "7.4",
      icon: BarChart3,
    },
  ];

  // ---------------- Dashboard Data ----------------
  const performanceData = [
    { match: "Match 1", runs: 45, wickets: 2 },
    { match: "Match 2", runs: 67, wickets: 1 },
    { match: "Match 3", runs: 23, wickets: 3 },
    { match: "Match 4", runs: 89, wickets: 0 },
    { match: "Match 5", runs: 34, wickets: 2 },
  ];

  const topPerformers = mockPlayers.slice(0, 3);
  const totalPlayers = mockPlayers.length;
  const avgAuctionValue =
    mockPlayers.reduce((sum, p) => sum + p.auctionValue.predicted, 0) /
    mockPlayers.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* ---------------- Hero Section ---------------- */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              CricScout AI
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow-md">
              Advanced IPL Player Analysis & Recommendation System
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="gradient"
                className="text-orange-500 hover:bg-black/90 shadow-hero"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Analytics
              </Button>
              <Button
                size="lg"
                variant="gradient"
                className="text-orange-500 hover:bg-blue/90 shadow-hero"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Auction Predictor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Main Content ---------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Players"
            value={totalPlayers}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            gradient="primary"
          />
          <StatCard
            title="Avg Auction Value"
            value={`₹${(avgAuctionValue / 10000000).toFixed(1)}`}
            suffix="Cr"
            icon={Award}
            trend={{ value: 8, isPositive: true }}
            gradient="secondary"
          />
          <StatCard
            title="Active Analysis"
            value="147"
            icon={Target}
            trend={{ value: 15, isPositive: true }}
            gradient="accent"
          />
          <StatCard
            title="ML Accuracy"
            value="94.2"
            suffix="%"
            icon={TrendingUp}
            trend={{ value: 2.3, isPositive: true }}
            gradient="primary"
          />
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Recent Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart
                type="line"
                data={performanceData}
                dataKey="runs"
                xAxisKey="match"
                color="hsl(var(--primary))"
                height={250}
              />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-secondary" />
                <span>Team Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart
                type="bar"
                data={[
                  { team: "RCB", score: 87 },
                  { team: "MI", score: 92 },
                  { team: "CSK", score: 89 },
                  { team: "KKR", score: 85 },
                  { team: "GT", score: 91 },
                ]}
                dataKey="score"
                xAxisKey="team"
                color="hsl(var(--secondary))"
                height={250}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <Zap className="w-6 h-6 text-primary" />
              <span>Top Performers</span>
            </h2>
            <Button variant="outline" size="sm">
              View All Players
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPerformers.map((p) => (
              <PlayerCard
                key={p.id}
                player={{
                  name: p.name,
                  country: p.nationality,
                  role: p.position,
                  team: p.team,
                  image: p.image,
                }}
              />
            ))}
          </div>
        </div>

        {/* ---------------- Compare Players Section ---------------- */}
        <section>
          <header className="bg-gradient-to-r from-orange-500 via-purple-500 to-blue-600 text-white py-8 px-6 rounded-xl shadow-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Compare Players</h2>
                <p className="text-white/90 text-lg">
                  Head-to-head cricket statistics analysis
                </p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add Player
                </Button>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm font-semibold">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </header>

          {/* Player Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {players.map((player, index) => (
              <PlayerCard key={index} player={player} />
            ))}
          </div>

          {/* Stats Comparison Grid */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Statistics Comparison
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {statsData.map((stat, index) => (
                <StatsCard
                  key={index}
                  label={stat.label}
                  player1Value={stat.player1}
                  player2Value={stat.player2}
                  icon={stat.icon}
                />
              ))}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="mt-10">
            <ChartPlaceholder />
          </div>
        </section>

        {/* Quick Actions */}
        <Card className="shadow-card bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="flex flex-col items-center p-6 h-auto bg-gradient-primary text-primary-foreground hover:shadow-stat">
                <Target className="w-8 h-8 mb-2" />
                <span className="font-medium">SWOT Analysis</span>
                <span className="text-xs opacity-80">
                  Analyze player strengths
                </span>
              </Button>
              <Button className="flex flex-col items-center p-6 h-auto bg-gradient-secondary text-secondary-foreground hover:shadow-stat">
                <Users className="w-8 h-8 mb-2" />
                <span className="font-medium">Compare Players</span>
                <span className="text-xs opacity-80">
                  Head-to-head analysis
                </span>
              </Button>
              <Button className="flex flex-col items-center p-6 h-auto bg-gradient-accent text-accent-foreground hover:shadow-stat">
                <Trophy className="w-8 h-8 mb-2" />
                <span className="font-medium">Auction Predictor</span>
                <span className="text-xs opacity-80">
                  Predict player values
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
