"use client";

import type { FitnessTest } from "@/components/fitness/test-data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FlipCard({
  test,
  value,
  onChange,
}: {
  test: FitnessTest;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [localValue, setLocalValue] = useState<number>(value ?? test.min);

  useEffect(() => {
    setLocalValue(value ?? test.min);
  }, [value]);

  const decimals = String(test.step).includes(".")
    ? String(test.step).split(".")[1].length
    : 0;

  const formatted = Number.isFinite(localValue)
    ? localValue.toFixed(decimals)
    : "";

  const submit = () => {
    onChange(Number.isFinite(localValue) ? localValue : null);
    setFlipped(false);
  };

  return (
    <motion.div
      className="group relative [perspective:1200px]"
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className={cn(
          "relative h-64 w-full transition-transform duration-700 [transform-style:preserve-3d]",
          flipped ? "[transform:rotateY(180deg)]" : ""
        )}
      >
        {/* Front Side */}
        <Card
          onClick={() => setFlipped(true)}
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 shadow-md hover:shadow-xl transition-all cursor-pointer [backface-visibility:hidden]"
        >
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700 shadow-inner">
            <test.Icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">{test.name}</h3>
          <p className="text-sm text-slate-500">{test.quality}</p>

          <div className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            {value !== null ? `${value} ${test.unit}` : `Unit: ${test.unit}`}
          </div>

          <div className="mt-4 bg-gradient-to-r from-sky-400 to-indigo-500 px-4 py-1.5 text-xs font-semibold text-white rounded-full shadow-md">
            Flip to Input
          </div>
        </Card>

        {/* Back Side */}
        <Card className="absolute inset-0 flex flex-col rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 shadow-md [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <test.Icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-800">
                {test.name}
              </h4>
              <p className="text-xs text-slate-500">{test.quality}</p>
            </div>
          </div>

          <label className="text-xs text-slate-600 mb-2">
            Select value ({test.unit})
          </label>

          <Slider
            value={[Number.isFinite(localValue) ? localValue : test.min]}
            min={test.min}
            max={test.max}
            step={test.step}
            onValueChange={(vals) => setLocalValue(vals[0] ?? test.min)}
            className="w-full"
          />

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>{test.min}</span>
            <span className="font-medium text-slate-800">{formatted}</span>
            <span>{test.max}</span>
          </div>

          <div className="mt-auto flex justify-between pt-4">
            <Button
              variant="secondary"
              className="rounded-full text-xs"
              onClick={() => setFlipped(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-xs text-white"
              onClick={submit}
            >
              Done
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
