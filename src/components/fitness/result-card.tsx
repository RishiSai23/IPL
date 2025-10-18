"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

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
    <motion.div
      className="relative mx-auto w-full max-w-3xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-white/60 via-blue-50/40 to-purple-100/60 backdrop-blur-md shadow-xl">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-sky-300/20 via-indigo-300/10 to-transparent"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 p-6 md:flex-row md:justify-between">
          {/* Circular Score Meter */}
          <div className="relative h-40 w-40">
            <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="10"
                fill="none"
              />
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#grad)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={circumference - dash}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - dash }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#7e22ce" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">
                {Math.round(score)}%
              </div>
              <p className="text-xs text-gray-600">Fitness Score</p>
            </div>
          </div>

          {/* Text Section */}
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <div
              className={cn(
                "mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm ring-1 transition-all",
                isQualified
                  ? "bg-emerald-100/80 text-emerald-700 ring-emerald-400/60"
                  : "bg-amber-100/80 text-amber-700 ring-amber-400/60"
              )}
            >
              {isQualified ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              {status}
            </div>

            <motion.p
              className="max-w-lg text-sm text-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {commentary}
            </motion.p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
