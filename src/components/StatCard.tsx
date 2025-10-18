import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string | { value: number; isPositive: boolean };
  suffix?: string;
  gradient?: "primary" | "secondary" | "accent";
  className?: string;
}

const gradientClasses = {
  primary: "bg-gradient-primary",
  secondary: "bg-gradient-secondary",
  accent: "bg-gradient-accent",
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  suffix = "",
  gradient = "primary",
  className = "",
}: StatCardProps) => {
  const numericValue =
    typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));

  return (
    <motion.div
      whileHover={{ translateY: -6, boxShadow: "0 12px 40px -12px rgba(0,0,0,0.45)" }}
      className={`rounded-xl transition-smooth ${className}`}
    >
      <Card className="border border-border bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <h3 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
                  {typeof numericValue === "number" && !Number.isNaN(numericValue) ? (
                    <CountUp end={numericValue} duration={1.4} separator="," />
                  ) : (
                    <span>{value}</span>
                  )}
                  {suffix && <span className="text-base text-muted-foreground ml-1">{suffix}</span>}
                </h3>
                {trend && (
                  <div
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      typeof trend === "string"
                        ? "bg-gray-700 text-white"
                        : trend.isPositive
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {typeof trend === "string" ? trend : trend.isPositive ? `+${trend.value}%` : `-${trend.value}%`}
                  </div>
                )}
              </div>
            </div>

            {Icon && (
              <div
                className={`ml-4 flex items-center justify-center w-12 h-12 rounded-xl ${gradientClasses[gradient]} shadow-stat`}
              >
                <Icon className="w-6 h-6 text-white drop-shadow" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
