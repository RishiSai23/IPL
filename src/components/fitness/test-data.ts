import type React from "react";
import {
  Ruler,
  Weight,
  StretchHorizontal,
  Rocket,
  MoveRight,
  Dumbbell,
  Timer,
  Shuffle,
  CircleDot,
  Activity,
} from "lucide-react";

export type FitnessTestKey =
  | "height_cm"
  | "weight_kg"
  | "sit_reach_cm"
  | "vertical_jump_cm"
  | "broad_jump_m"
  | "medicine_throw_m"
  | "sprint_30m_sec"
  | "shuttle_4x10_sec"
  | "situps_count"
  | "endurance_min";

export type FitnessTest = {
  key: FitnessTestKey;
  name: string;
  quality: string;
  unit: string;
  Icon: React.ComponentType<{ className?: string }>;
  min: number;
  max: number;
  step: number;
};

export const FITNESS_TESTS: FitnessTest[] = [
  {
    key: "height_cm",
    name: "Height",
    quality: "Anthropometric",
    unit: "cm",
    Icon: Ruler,
    min: 150,
    max: 210,
    step: 1,
  },
  {
    key: "weight_kg",
    name: "Weight",
    quality: "Anthropometric",
    unit: "kg",
    Icon: Weight,
    min: 40,
    max: 130,
    step: 1,
  },
  {
    key: "sit_reach_cm",
    name: "Sit & Reach",
    quality: "Flexibility",
    unit: "cm",
    Icon: StretchHorizontal,
    min: 0,
    max: 50,
    step: 1,
  },
  {
    key: "vertical_jump_cm",
    name: "Standing Vertical Jump",
    quality: "Lower Body Strength",
    unit: "cm",
    Icon: Rocket,
    min: 10,
    max: 90,
    step: 1,
  },
  {
    key: "broad_jump_m",
    name: "Standing Broad Jump",
    quality: "Lower Body Strength",
    unit: "m",
    Icon: MoveRight,
    min: 1.5,
    max: 3.0,
    step: 0.01,
  },
  {
    key: "medicine_throw_m",
    name: "Medicine Ball Throw",
    quality: "Upper Body Strength",
    unit: "m",
    Icon: Dumbbell,
    min: 2,
    max: 12,
    step: 0.1,
  },
  {
    key: "sprint_30m_sec",
    name: "30m Standing Start",
    quality: "Speed",
    unit: "sec",
    Icon: Timer,
    min: 3.5,
    max: 7.0,
    step: 0.01,
  },
  {
    key: "shuttle_4x10_sec",
    name: "4×10m Shuttle Run",
    quality: "Agility",
    unit: "sec",
    Icon: Shuffle,
    min: 7.0,
    max: 14.0,
    step: 0.01,
  },
  {
    key: "situps_count",
    name: "Sit Ups",
    quality: "Core Strength",
    unit: "count",
    Icon: CircleDot,
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: "endurance_min",
    name: "800m / 1.6km Run",
    quality: "Endurance",
    unit: "min",
    Icon: Activity,
    min: 2.5,
    max: 15.0,
    step: 0.1,
  },
];
