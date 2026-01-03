// backend/cricket-api/scripts/build_tn_smat_players.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { compute_total_pressure_score } from "../../intelligence/engine/pressure_score_engine.js";
import {
  compute_base_skill_score,
  compute_consistency_score,
  compute_opposition_quality_score
} from "../../intelligence/engine/batting_scores.js";

import { Innings } from "../../intelligence/models/innings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "../data");
const OUTPUT_FILE = path.join(DATA_DIR, "tn_smat_batters_ready.json");

const FILES = [
  "TN_Smat_TopOrder.json",
  "TN_Smat_MiddleOrder.json",
  "TN_Smat_Finisher.json"
];

// --------------------------------------------------
// LOAD & MERGE RAW DATA
// --------------------------------------------------
let raw = [];
FILES.forEach(file => {
  const p = path.join(DATA_DIR, file);
  raw.push(...JSON.parse(fs.readFileSync(p, "utf-8")));
});

// --------------------------------------------------
// GROUP BY PLAYER
// --------------------------------------------------
const grouped = {};
raw.forEach(row => {
  grouped[row.player_name] ??= [];
  grouped[row.player_name].push(
    new Innings(
      row.runs,
      row.balls,
      row.fours || 0,
      row.sixes || 0,
      true,
      row.result || "Loss",
      row.chasing || false,
      row.knockout || false,
      row.opposition_tier || "B",
      "T20",
      row.team_runs || 0,
      row.team_wickets || 0,
      0
    )
  );
});

// --------------------------------------------------
// BUILD PRESSURE METRICS
// --------------------------------------------------
function buildPressureMetrics(innings) {
  const avg_sr_bpd = (list) => {
    if (!list.length) return { avg: 0, sr: 0, bpd: 0 };

    const runs = list.reduce((s, i) => s + i.runs, 0);
    const balls = list.reduce((s, i) => s + i.balls, 0);
    const dismissals = list.length;

    return {
      avg: runs / dismissals,
      sr: (runs / balls) * 100,
      bpd: balls / dismissals
    };
  };

  return {
    collapse: avg_sr_bpd(innings.filter(i => i.wickets_at_entry >= 3)),
    chase: avg_sr_bpd(innings.filter(i => i.chasing)),
    knockout: avg_sr_bpd(innings.filter(i => i.knockout)),
    quality: avg_sr_bpd(innings.filter(i => i.opposition_tier === "A"))
  };
}

// --------------------------------------------------
// COMPUTE FINAL PLAYER OBJECTS
// --------------------------------------------------
const players = Object.entries(grouped).map(([name, innings]) => {
  const pressureMetrics = buildPressureMetrics(innings);

  const pressureScore = compute_total_pressure_score(pressureMetrics);
  const baseSkillScore = compute_base_skill_score(innings);
  const consistencyScore = compute_consistency_score(innings);
  const oppositionQualityScore = compute_opposition_quality_score(innings);

  const finalScore = (
    0.35 * pressureScore +
    0.30 * baseSkillScore +
    0.20 * consistencyScore +
    0.15 * oppositionQualityScore
  ).toFixed(2);

  const totalRuns = innings.reduce((s, i) => s + i.runs, 0);
  const totalBalls = innings.reduce((s, i) => s + i.balls, 0);

  return {
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    team: "Tamil Nadu",
    role: "Batter",
    stats: {
      matches: innings.length,
      runs: totalRuns,
      average: Number((totalRuns / innings.length).toFixed(2)),
      strikeRate: Number(((totalRuns / totalBalls) * 100).toFixed(2)),

      pressureScore,
      baseSkillScore,
      consistencyScore,
      oppositionQualityScore,
      finalScore: Number(finalScore)
    }
  };
});

// --------------------------------------------------
// WRITE OUTPUT
// --------------------------------------------------
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify({ players }, null, 2)
);

console.log(`✅ TN SMAT batters compiled correctly: ${players.length}`);
