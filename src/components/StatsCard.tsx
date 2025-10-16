import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  player1Value: string | number;
  player2Value: string | number;
  icon: LucideIcon;
}

const StatsCard = ({
  label,
  player1Value,
  player2Value,
  icon: Icon,
}: StatsCardProps) => {
  return (
    <Card className="gradient-card border hover:border-primary/50 transition-all duration-300 hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h4 className="text-sm font-medium text-muted-foreground">{label}</h4>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 text-center p-3 rounded-lg bg-gradient-to-br from-primary/5 to-transparent">
            <p className="text-2xl font-bold text-foreground">{player1Value}</p>
          </div>

          <div className="w-px h-12 bg-border" />

          <div className="flex-1 text-center p-3 rounded-lg bg-gradient-to-br from-secondary/5 to-transparent">
            <p className="text-2xl font-bold text-foreground">{player2Value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default StatsCard;
