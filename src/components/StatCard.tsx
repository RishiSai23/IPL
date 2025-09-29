// file: src/components/StatCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  suffix?: string;
  gradient?: "primary" | "secondary" | "accent";
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  suffix = "",
  gradient = "primary",
  className = "",
}: StatCardProps) => {
  const gradientClasses = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary",
    accent: "bg-gradient-accent",
  };

  return (
    <Card className={`shadow-card hover:shadow-stat transition-smooth ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            <div className="flex items-baseline space-x-2 mt-2">
              <p className="text-3xl font-bold text-foreground">
                {value}
                {suffix && <span className="text-lg text-muted-foreground ml-1">{suffix}</span>}
              </p>
              {trend && (
                <div
                  className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    trend.isPositive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  }`}
                >
                  <span className="font-medium">
                    {trend.isPositive ? "+" : ""}
                    {trend.value}%
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className={`w-12 h-12 rounded-xl ${
              gradientClasses[gradient]
            } flex items-center justify-center shadow-stat`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;