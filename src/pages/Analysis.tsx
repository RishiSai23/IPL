// file: src/pages/Analysis.tsx
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { mockPlayers } from "@/data/mockPlayers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, AlertTriangle, Lightbulb, Shield, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Analysis = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(mockPlayers[0]);

  const getSWOTIcon = (type: string) => {
    switch (type) {
      case "strengths":
        return <Shield className="w-5 h-5 text-success" />;
      case "weaknesses":
        return <AlertTriangle className="w-5 h-5 text-danger" />;
      case "opportunities":
        return <Lightbulb className="w-5 h-5 text-info" />;
      case "threats":
        return <TrendingUp className="w-5 h-5 text-warning" />;
      default:
        return null;
    }
  };

  const getSWOTColor = (type: string) => {
    switch (type) {
      case "strengths":
        return "border-success/20 bg-success/5";
      case "weaknesses":
        return "border-danger/20 bg-danger/5";
      case "opportunities":
        return "border-info/20 bg-info/5";
      case "threats":
        return "border-warning/20 bg-warning/5";
      default:
        return "border-border bg-card";
    }
  };

  const swotSections = [
    { key: "strengths", title: "Strengths", data: selectedPlayer.swot.strengths },
    { key: "weaknesses", title: "Weaknesses", data: selectedPlayer.swot.weaknesses },
    { key: "opportunities", title: "Opportunities", data: selectedPlayer.swot.opportunities },
    { key: "threats", title: "Threats", data: selectedPlayer.swot.threats },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3 mb-2">
            <Target className="w-8 h-8 text-primary" />
            <span>SWOT Analysis</span>
          </h1>
          <p className="text-muted-foreground">
            AI-powered Strengths, Weaknesses, Opportunities & Threats analysis for IPL players
          </p>
        </div>

        {/* Player Selection */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Select Player for Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Choose Player</label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <Badge variant="outline">{selectedPlayer.position}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <Badge variant="outline">{selectedPlayer.age} years</Badge>
                </div>
              </div>

              <Button className="bg-gradient-primary text-primary-foreground hover:shadow-stat">
                Generate New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Player Overview */}
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

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Predicted Value</p>
                <p className="text-2xl font-bold text-primary">
                  ₹{(selectedPlayer.auctionValue.predicted / 10000000).toFixed(1)}Cr
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-stats rounded-lg">
                <p className="text-2xl font-bold text-foreground">{selectedPlayer.stats.matches}</p>
                <p className="text-sm text-muted-foreground">Matches</p>
              </div>
              <div className="text-center p-4 bg-gradient-stats rounded-lg">
                <p className="text-2xl font-bold text-foreground">{selectedPlayer.stats.runs}</p>
                <p className="text-sm text-muted-foreground">Runs</p>
              </div>
              <div className="text-center p-4 bg-gradient-stats rounded-lg">
                <p className="text-2xl font-bold text-foreground">{selectedPlayer.stats.wickets}</p>
                <p className="text-sm text-muted-foreground">Wickets</p>
              </div>
              <div className="text-center p-4 bg-gradient-stats rounded-lg">
                <p className="text-2xl font-bold text-foreground">{selectedPlayer.leadership}/10</p>
                <p className="text-sm text-muted-foreground">Leadership</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SWOT Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {swotSections.map((section) => (
            <Card key={section.key} className={`shadow-card ${getSWOTColor(section.key)}`}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {getSWOTIcon(section.key)}
                  <span>{section.title}</span>
                  <Badge variant="outline" className="ml-auto">
                    {section.data.length} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.data.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-card rounded-lg border border-border hover:shadow-sm transition-smooth"
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights */}
        <Card className="shadow-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <span>AI-Generated Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-primary/10 rounded-lg p-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-3">
                Key Recommendations for {selectedPlayer.name}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • Based on current form and stats, {selectedPlayer.name} is best suited for a{" "}
                  <strong>finishing role</strong> in the batting order.
                </p>
                <p>
                  • The player shows strong performance against pace bowling but needs improvement
                  against quality spin.
                </p>
                <p>
                  • Injury risk is {selectedPlayer.injuryRisk}, requiring careful workload management
                  throughout the season.
                </p>
                <p>
                  • Auction value prediction has {selectedPlayer.auctionValue.confidence}% confidence
                  based on recent performance trends.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analysis;