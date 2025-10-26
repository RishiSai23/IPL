"use client";

import { useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import {
  FITNESS_TESTS,
  type FitnessTestKey,
} from "@/components/fitness/test-data";
import { FlipCard } from "@/components/fitness/flip-card";
import { ResultCard } from "@/components/fitness/result-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <main className="min-h-dvh bg-gradient-to-b from-black via-slate-950 to-black text-white">
      {/* Hero section with cyan→blue gradient to match dashboard template */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-6">
        <div className="rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 px-6 py-12 text-center text-white shadow-md md:px-10 md:py-16">
          <h1 className={cn("text-balance text-3xl font-bold md:text-5xl")}>
            CricScout AI
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm opacity-90 md:text-base">
            Advanced IPL Player Analysis & Recommendation System
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button className="rounded-full bg-white/20 px-5 text-white hover:bg-white/30">
              Explore Analytics
            </Button>
            <Button className="rounded-full bg-white/20 px-5 text-white hover:bg-white/30">
              Auction Predictor
            </Button>
          </div>
        </div>
      </section>

      {/* <CHANGE> Add template-like 4-card metric summary row */}
      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="glass-card rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-300">TOTAL PLAYERS</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-semibold text-white">4</span>
              <Badge className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-medium text-cyan-300">
                +12%
              </Badge>
            </div>
          </Card>

          <Card className="glass-card rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-300">
              AVG AUCTION VALUE
            </p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-semibold text-white">
                {"₹1.3 Cr"}
              </span>
              <Badge className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-medium text-cyan-300">
                +8%
              </Badge>
            </div>
          </Card>

          <Card className="glass-card rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-300">ACTIVE ANALYSIS</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-semibold text-white">147</span>
              <Badge className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-medium text-cyan-300">
                +15%
              </Badge>
            </div>
          </Card>

          <Card className="glass-card rounded-2xl p-5">
            <p className="text-xs font-medium text-gray-300">ML ACCURACY</p>
            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-semibold text-white">94.2%</span>
              <Badge className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] font-medium text-cyan-300">
                +2.3%
              </Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* ... existing code ... */}
      {/* <CHANGE> Keep helper, flip cards, evaluate button, and result rendering intact */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <Card className="mb-6 rounded-2xl glass-card p-4 shadow-sm">
          <p className="text-sm text-gray-300">
            Tap a card to flip, enter your value, and hit Done. Fill all cards,
            then evaluate your fitness score.
          </p>
        </Card>

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

        <div className="mt-8 flex items-center justify-center">
          <Button
            size="lg"
            disabled={!allFilled || loading}
            onClick={evaluate}
            className={cn(
              "rounded-full px-6 py-6 text-base font-semibold text-white shadow transition-transform",
              "bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 hover:scale-105 hover:opacity-95"
            )}
          >
            {loading ? "Evaluating..." : "Evaluate Fitness"}
          </Button>
        </div>

        <div className="mt-8">
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
