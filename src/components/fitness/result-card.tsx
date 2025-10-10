"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultCardProps = {
  score: number; // 0-100
  status: "Qualified" | "Needs Improvement";
  commentary: string;
};

export function ResultCard({ score, status, commentary }: ResultCardProps) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const dash = (progress / 100) * circumference;

  const isQualified = status === "Qualified";

  return (
    <Card className="mx-auto w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        {/* Circular meter */}
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="var(--color-muted)"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#grad)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--gradient-from)" />
                <stop offset="100%" stopColor="var(--gradient-to)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(score)}%</div>
              <div className="text-xs text-muted-foreground">Fitness Score</div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-1 flex-col items-center md:items-start">
          <div
            className={cn(
              "mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1",
              isQualified
                ? "ring-emerald-300 text-emerald-600"
                : "ring-amber-300 text-amber-600"
            )}
          >
            {isQualified ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {isQualified ? "Qualified" : "Needs Improvement"}
          </div>
          <p className="text-pretty text-sm text-muted-foreground">
            {commentary}
          </p>
        </div>
      </div>
    </Card>
  );
}
