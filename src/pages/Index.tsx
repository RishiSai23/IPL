import Navigation from "@/components/Navigation";
import StatCard from "@/components/StatCard";
import PlayerCard from "@/components/PlayerCard";
import PerformanceChart from "@/components/PerformanceChart";
import { mockPlayers } from "@/data/mockPlayers";
import { Users, TrendingUp, Trophy, Target, BarChart3, Award, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
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
    mockPlayers.reduce((sum, p) => sum + p.auctionValue.predicted, 0) / mockPlayers.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
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
              {/* ✅ Fixed Explore button */}
              <Button
  size="lg"
  className="bg-white !text-black hover:bg-white/90 shadow-hero"
>
  <BarChart3 className="w-5 h-5 mr-2" />
  Explore Analytics
</Button>

              {/* ✅ Fixed Auction Predictor button */}
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[hsl(var(--primary))]"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Auction Predictor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
        <div className="mb-8">
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
            {topPerformers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onClick={() => console.log(`View ${player.name} details`)}
              />
            ))}
          </div>
        </div>

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
                <span className="text-xs opacity-80">Analyze player strengths</span>
              </Button>

              <Button className="flex flex-col items-center p-6 h-auto bg-gradient-secondary text-secondary-foreground hover:shadow-stat">
                <Users className="w-8 h-8 mb-2" />
                <span className="font-medium">Compare Players</span>
                <span className="text-xs opacity-80">Head-to-head analysis</span>
              </Button>

              <Button className="flex flex-col items-center p-6 h-auto bg-gradient-accent text-accent-foreground hover:shadow-stat">
                <Trophy className="w-8 h-8 mb-2" />
                <span className="font-medium">Auction Predictor</span>
                <span className="text-xs opacity-80">Predict player values</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;