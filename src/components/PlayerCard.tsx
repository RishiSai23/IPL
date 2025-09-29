// file: src/components/PlayerCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Player } from "@/types/player";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Activity,
} from "lucide-react";

interface PlayerCardProps {
  player: Player;
  showDetails?: boolean;
  onClick?: () => void;
}

const PlayerCard = ({ player, onClick }: PlayerCardProps) => {
  const getTrendIcon = () => {
    switch (player.form.trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-danger" />;
      default:
        return <Minus className="w-4 h-4 text-warning" />;
    }
  };

  const getPerformanceColor = () => {
    switch (player.form.recentPerformance) {
      case "excellent":
        return "bg-success/10 text-success border-success/20";
      case "good":
        return "bg-info/10 text-info border-info/20";
      case "average":
        return "bg-warning/10 text-warning border-warning/20";
      case "poor":
        return "bg-danger/10 text-danger border-danger/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getRiskColor = () => {
    switch (player.injuryRisk) {
      case "low":
        return "text-success";
      case "medium":
        return "text-warning";
      case "high":
        return "text-danger";
      default:
        return "text-muted-foreground";
    }
  };

  // Ensure strongly-typed entries so a, b, and score are numbers (not unknown)
  const fitmentEntries = Object.entries(player.role.fitment) as Array<[string, number]>;

  return (
    <Card
      className="shadow-card hover:shadow-stat transition-smooth cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-smooth">
              {player.name}
            </h3>
            <p className="text-sm text-muted-foreground">{player.team}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {player.position}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Age {player.age}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className="text-xs text-muted-foreground">Form</span>
            </div>
            <Badge className={`text-xs ${getPerformanceColor()}`}>
              {player.form.recentPerformance}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            {player.role.primary === "batsman" || player.role.primary === "all-rounder" ? (
              <>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Runs</span>
                  <span className="text-sm font-medium">{player.stats.runs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Strike Rate</span>
                  <span className="text-sm font-medium">{player.stats.strikeRate}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Wickets</span>
                  <span className="text-sm font-medium">{player.stats.wickets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Economy</span>
                  <span className="text-sm font-medium">{player.stats.economy}</span>
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Matches</span>
              <span className="text-sm font-medium">{player.stats.matches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Leadership</span>
              <span className="text-sm font-medium">{player.leadership}/10</span>
            </div>
          </div>
        </div>

        {/* Auction Value */}
        <div className="flex items-center justify-between p-3 bg-gradient-stats rounded-lg mb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Auction Value</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-primary">
              ₹{(player.auctionValue.predicted / 10000000).toFixed(1)}Cr
            </div>
            <div className="text-xs text-muted-foreground">
              {player.auctionValue.confidence}% confidence
            </div>
          </div>
        </div>

        {/* Role Fitment - Top 2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Top Roles</span>
            <span className="text-muted-foreground">Fit Score</span>
          </div>

          {fitmentEntries
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([role, score]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-xs capitalize font-medium">
                  {role.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full"
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-6">{score}</span>
                </div>
              </div>
            ))}
        </div>

        {/* Risk Indicator */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3" />
            <span className="text-xs text-muted-foreground">Injury Risk</span>
          </div>
          <span className={`text-xs font-medium capitalize ${getRiskColor()}`}>
            {player.injuryRisk}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;