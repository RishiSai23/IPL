"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { FitnessTest } from "@/components/fitness/test-data";

type FlipCardProps = {
  test: FitnessTest;
  value: number | null;
  onChange: (v: number | null) => void;
};

export function FlipCard({ test, value, onChange }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [localValue, setLocalValue] = useState<number>(value ?? test.min);

  useEffect(() => {
    setLocalValue(value ?? test.min);
  }, [value]);

  const submit = () => {
    onChange(Number.isFinite(localValue) ? localValue : null);
    setFlipped(false);
  };

  const decimals = String(test.step).includes(".")
    ? String(test.step).split(".")[1].length
    : 0;
  const formatted = Number.isFinite(localValue)
    ? localValue.toFixed(decimals)
    : "";

  return (
    <div className="group [perspective:1000px]">
      <div
        className={cn(
          "relative h-56 w-full transition-transform duration-700 [transform-style:preserve-3d]",
          flipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Front */}
        <Card
          role="button"
          aria-label={`Open input for ${test.name}`}
          tabIndex={0}
          onClick={() => setFlipped(true)}
          onKeyDown={(e) => (e.key === "Enter" ? setFlipped(true) : null)}
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center rounded-2xl border bg-card p-4 text-center shadow-sm",
            "transition-transform duration-300 group-hover:scale-[1.02]",
            "[backface-visibility:hidden]"
          )}
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <test.Icon className="h-5 w-5 text-foreground/70" />
          </div>
          <h3 className="text-lg font-semibold">{test.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{test.quality}</p>

          <div className="mt-3">
            <span className="inline-block rounded-full px-3 py-1 text-xs font-medium text-foreground/70 ring-1 ring-border">
              {value !== null && value !== undefined
                ? `${value} ${test.unit}`
                : `Unit: ${test.unit}`}
            </span>
          </div>

          <div
            className={cn(
              "mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm",
              "bg-brand-gradient"
            )}
          >
            Flip to Input
          </div>
        </Card>

        {/* Back */}
        <Card
          className={cn(
            "absolute inset-0 rounded-2xl border bg-card p-4 shadow-sm [transform:rotateY(180deg)] [backface-visibility:hidden]",
            "flex flex-col"
          )}
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
              <test.Icon className="h-4 w-4 text-foreground/70" />
            </div>
            <div>
              <h4 className="text-base font-medium">{test.name}</h4>
              <p className="text-xs text-muted-foreground">{test.quality}</p>
            </div>
          </div>

          <label
            className="text-sm text-muted-foreground"
            htmlFor={`${test.key}-slider`}
          >
            Select value ({test.unit})
          </label>
          <div id={`${test.key}-slider`} className="mt-3">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{`${test.min} ${test.unit}`}</span>
              <span className="font-medium text-foreground">{`${formatted} ${test.unit}`}</span>
              <span>{`${test.max} ${test.unit}`}</span>
            </div>
            <Slider
              value={[Number.isFinite(localValue) ? localValue : test.min]}
              min={test.min}
              max={test.max}
              step={test.step}
              onValueChange={(vals) => setLocalValue(vals[0] ?? test.min)}
              className="w-full"
              aria-label={`${test.name} slider`}
            />
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <Button variant="secondary" onClick={() => setFlipped(false)}>
              Cancel
            </Button>
            <Button className="secondary" onClick={submit}>
              Done
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
