"use client";

import Navigation from "@/components/Navigation";
import { FlipCard } from "@/components/fitness/flip-card";
import { ResultCard } from "@/components/fitness/result-card";
import {
  FITNESS_TESTS,
  type FitnessTestKey,
} from "@/components/fitness/test-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type ValuesState = Partial<Record<FitnessTestKey, number>>;

export default function PlayerFitnessAssessmentPage() {
  const [values, setValues] = useState<ValuesState>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    status: "Qualified" | "Needs Improvement";
    commentary: string;
  } | null>(null);

  const allFilled = useMemo(() => {
    return FITNESS_TESTS.every((t) => Number.isFinite(values[t.key] as number));
  }, [values]);

  const updateValue = (key: FitnessTestKey, v: number | null) => {
    setValues((prev) => ({ ...prev, [key]: v ?? undefined }));
  };

  const evaluate = async () => {
    try {
      setLoading(true);
      setResult(null);
      const res = await fetch("http://127.0.0.1:8000/predict/fitness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value_dict: values }),
      });
      if (!res.ok) throw new Error("Failed to evaluate");
      const data = await res.json();
      setResult({
        score: data.score,
        status: data.status,
        commentary: data.commentary,
      });
    } catch (err) {
      console.error("[v0] Evaluation error:", err);
      setResult({
        score: 0,
        status: "Needs Improvement",
        commentary: "Unable to compute score at the moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#0a0a0a] via-[#120b2e] to-[#0a0a0a] text-white">
      <Navigation />

      {/* HERO SECTION */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 px-6 py-12 text-center text-white shadow-[0_0_30px_rgba(0,255,255,0.25)] md:px-10 md:py-16">
          <h1 className={cn("text-balance text-3xl font-extrabold md:text-5xl")}>
            ⚡ CricScout AI Fitness Analyzer
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm opacity-90 md:text-base">
            Smart AI-driven fitness evaluation for IPL prospects 🏏
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button className="rounded-full bg-white/10 border border-cyan-300/30 text-cyan-200 hover:bg-cyan-500/20 transition">
              Explore Analytics
            </Button>
            <Button className="rounded-full bg-white/10 border border-purple-300/30 text-purple-200 hover:bg-purple-500/20 transition">
              Auction Predictor
            </Button>
          </div>
        </div>
      </section>

      {/* METRIC CARDS */}
      <section className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "TOTAL PLAYERS", value: "4", change: "+12%" },
            { label: "AVG AUCTION VALUE", value: "₹1.3 Cr", change: "+8%" },
            { label: "ACTIVE ANALYSIS", value: "147", change: "+15%" },
            { label: "ML ACCURACY", value: "94.2%", change: "+2.3%" },
          ].map((stat, i) => (
            <Card
              key={i}
              className="rounded-2xl p-5 bg-gradient-to-b from-[#0f0f1a]/90 to-[#1a1033]/80 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,0,255,0.2)] transition-all"
            >
              <p className="text-xs font-semibold text-cyan-200/80">
                {stat.label}
              </p>
              <div className="mt-2 flex items-end justify-between">
                <span className="text-3xl font-bold text-white">
                  {stat.value}
                </span>
                <Badge className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-medium text-cyan-300 border border-cyan-400/30">
                  {stat.change}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* INSTRUCTIONS */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <Card className="mb-6 rounded-2xl bg-gradient-to-b from-[#0f0f1a]/70 to-[#1b0e33]/70 border border-cyan-400/30 p-4 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <p className="text-sm text-cyan-200/80">
            Tap a card to flip, enter your value, and hit Done. Fill all cards,
            then evaluate your fitness score.
          </p>
        </Card>

        {/* FLIP CARDS GRID */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {FITNESS_TESTS.map((t) => (
            <FlipCard
              key={t.key}
              test={t}
              value={(values[t.key] as number) ?? null}
              onChange={(v) => updateValue(t.key, v)}
            />
          ))}
        </div>

        {/* EVALUATE BUTTON */}
        <div className="mt-10 flex items-center justify-center">
          <Button
            size="lg"
            disabled={!allFilled || loading}
            onClick={evaluate}
            className={cn(
              "rounded-full px-8 py-5 text-base font-bold tracking-wide text-white",
              "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600",
              "shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,0,255,0.4)] transition-all hover:scale-105"
            )}
          >
            {loading ? "Evaluating..." : "🚀 Evaluate Fitness"}
          </Button>
        </div>

        {/* RESULT CARD */}
        <div className="mt-10">
          {result && (
            <ResultCard
              score={result.score}
              status={result.status}
              commentary={result.commentary}
            />
          )}
        </div>
      </section>
    </main>
  );
}
