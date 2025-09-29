// file: src/pages/Auction.tsx
import { useState } from "react";
import Navigation from "@/components/Navigation";
import PerformanceChart from "@/components/PerformanceChart";
import { mockPlayers } from "@/data/mockPlayers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Trophy,
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Calculator,
  Zap,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Auction = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(mockPlayers[0]);
  const [customMetrics, setCustomMetrics] = useState({
    recentForm: 8,
    teamNeed: 7,
    marketDemand: 6,
    injuryHistory: 3,
  });

  // Calculate predicted value based on various factors
  const calculatePredictedValue = () => {
    const baseValue = selectedPlayer.auctionValue.current;
    const formMultiplier = customMetrics.recentForm / 10;
    const demandMultiplier = customMetrics.marketDemand / 10;
    const needMultiplier = customMetrics.teamNeed / 10;
    const injuryPenalty = (10 - customMetrics.injuryHistory) / 10;

    const predictedValue =
      baseValue * formMultiplier * demandMultiplier * needMultiplier * injuryPenalty;
    return Math.round(predictedValue);
  };

  const predictedValue = calculatePredictedValue();
  const valueChange =
    ((predictedValue - selectedPlayer.auctionValue.current) /
      selectedPlayer.auctionValue.current) *
    100;

  // Sample auction history data
  const auctionHistory = [
    { year: "2018", value: 8000000 },
    { year: "2019", value: 12000000 },
    { year: "2020", value: 15000000 },
    { year: "2021", value: 12000000 },
    { year: "2022", value: 15000000 },
    { year: "2023", value: selectedPlayer.auctionValue.current },
    { year: "2024", value: predictedValue },
  ];

  const riskFactors = [
    {
      factor: "Age Factor",
      risk: selectedPlayer.age > 32 ? "High" : selectedPlayer.age > 28 ? "Medium" : "Low",
      impact: selectedPlayer.age > 32 ? -15 : selectedPlayer.age > 28 ? -5 : 5,
    },
    {
      factor: "Injury Risk",
      risk: selectedPlayer.injuryRisk,
      impact:
        selectedPlayer.injuryRisk === "high"
          ? -20
          : selectedPlayer.injuryRisk === "medium"
          ? -10
          : 0,
    },
    {
      factor: "Form Trend",
      risk:
        selectedPlayer.form.trend === "up"
          ? "Low"
          : selectedPlayer.form.trend === "down"
          ? "High"
          : "Medium",
      impact:
        selectedPlayer.form.trend === "up" ? 15 : selectedPlayer.form.trend === "down" ? -15 : 0,
    },
    {
      factor: "Role Versatility",
      risk: selectedPlayer.role.primary === "all-rounder" ? "Low" : "Medium",
      impact: selectedPlayer.role.primary === "all-rounder" ? 10 : -5,
    },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-success bg-success/10";
      case "medium":
        return "text-warning bg-warning/10";
      case "high":
        return "text-danger bg-danger/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <span>Auction Value Predictor</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered auction value prediction with custom scenario modeling
          </p>
        </div>

        {/* Player Selection & Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle>Select Player & Customize Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Choose Player
                </label>
                <Select
                  value={selectedPlayer.id}
                  onValueChange={(value) => {
                    const player = mockPlayers.find((p) => p.id === value);
                    if (player) setSelectedPlayer(player);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlayers.map((player) => (
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Recent Form (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={customMetrics.recentForm}
                    onChange={(e) =>
                      setCustomMetrics((prev) => ({
                        ...prev,
                        recentForm: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Team Need Factor (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={customMetrics.teamNeed}
                    onChange={(e) =>
                      setCustomMetrics((prev) => ({
                        ...prev,
                        teamNeed: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Market Demand (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={customMetrics.marketDemand}
                    onChange={(e) =>
                      setCustomMetrics((prev) => ({
                        ...prev,
                        marketDemand: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Injury Risk (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={customMetrics.injuryHistory}
                    onChange={(e) =>
                      setCustomMetrics((prev) => ({
                        ...prev,
                        injuryHistory: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-primary" />
                <span>Prediction Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                  <p className="text-lg font-medium">
                    ₹{(selectedPlayer.auctionValue.current / 10000000).toFixed(1)}Cr
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Predicted Value</p>
                  <p className="text-3xl font-bold text-primary">
                    ₹{(predictedValue / 10000000).toFixed(1)}Cr
                  </p>
                </div>

                <div
                  className={`flex items-center justify-center space-x-1 text-sm ${
                    valueChange >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  <TrendingUp className={`w-4 h-4 ${valueChange < 0 ? "rotate-180" : ""}`} />
                  <span>
                    {valueChange >= 0 ? "+" : ""}
                    {valueChange.toFixed(1)}%
                  </span>
                </div>

                <Button className="w-full bg-gradient-primary text-primary-foreground hover:shadow-stat">
                  <Zap className="w-4 h-4 mr-2" />
                  Recalculate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Details */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary-foreground">
                    {selectedPlayer.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedPlayer.name}</h2>
                  <p className="text-muted-foreground">{selectedPlayer.team}</p>
                </div>
              </div>

              <Badge
                className={`px-3 py-1 ${
                  selectedPlayer.form.recentPerformance === "excellent"
                    ? "bg-success/10 text-success"
                    : selectedPlayer.form.recentPerformance === "good"
                    ? "bg-info/10 text-info"
                    : selectedPlayer.form.recentPerformance === "average"
                    ? "bg-warning/10 text-warning"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {selectedPlayer.form.recentPerformance} form
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gradient-stats rounded-lg">
                <p className="text-lg font-bold text-foreground">{selectedPlayer.stats.matches}</p>
                <p className="text-xs text-muted-foreground">Matches</p>
              </div>
              <div className="text-center p-3 bg-gradient-stats rounded-lg">
                <p className="text-lg font-bold text-foreground">{selectedPlayer.stats.runs}</p>
                <p className="text-xs text-muted-foreground">Runs</p>
              </div>
              <div className="text-center p-3 bg-gradient-stats rounded-lg">
                <p className="text-lg font-bold text-foreground">{selectedPlayer.stats.wickets}</p>
                <p className="text-xs text-muted-foreground">Wickets</p>
              </div>
              <div className="text-center p-3 bg-gradient-stats rounded-lg">
                <p className="text-lg font-bold text-foreground">{selectedPlayer.stats.strikeRate}</p>
                <p className="text-xs text-muted-foreground">Strike Rate</p>
              </div>
              <div className="text-center p-3 bg-gradient-stats rounded-lg">
                <p className="text-lg font-bold text-foreground">{selectedPlayer.leadership}/10</p>
                <p className="text-xs text-muted-foreground">Leadership</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts & Risk Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Auction Value History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart
                type="line"
                data={auctionHistory}
                dataKey="value"
                xAxisKey="year"
                color="hsl(var(--primary))"
                height={250}
              />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                <span>Risk Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((factor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gradient-stats rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{factor.factor}</p>
                      <p className="text-xs text-muted-foreground">
                        Impact: {factor.impact >= 0 ? "+" : ""}
                        {factor.impact}%
                      </p>
                    </div>
                    <Badge className={`${getRiskColor(factor.risk)} border-0`}>{factor.risk}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>AI Auction Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-primary/10 rounded-lg p-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-4">
                Auction Strategy for {selectedPlayer.name}
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>
                    <strong>Base Price Recommendation:</strong> Start bidding around ₹
                    {((predictedValue * 0.7) / 10000000).toFixed(1)}Cr to ₹
                    {((predictedValue * 0.8) / 10000000).toFixed(1)}Cr
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>
                    <strong>Maximum Bid:</strong> Don't exceed ₹
                    {((predictedValue * 1.1) / 10000000).toFixed(1)}Cr given current market
                    conditions
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>
                    <strong>Team Fit:</strong> Best suited for teams needing a{" "}
                    {selectedPlayer.position.toLowerCase()} with {selectedPlayer.form.recentPerformance}{" "}
                    recent form
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>
                    <strong>Risk Factor:</strong> {selectedPlayer.injuryRisk} injury risk - factor this
                    into long-term team planning
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auction;