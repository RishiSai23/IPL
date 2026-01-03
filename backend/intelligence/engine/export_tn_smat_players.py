import json
from pathlib import Path
from collections import defaultdict

from backend.intelligence.engine.pressure_score_engine import compute_total_pressure_score
from backend.intelligence.engine.batting_scores import (
    compute_base_skill_score,
    compute_consistency_score,
    compute_opposition_quality_score
)
from backend.intelligence.models.innings import Innings

DATA_DIR = Path("backend/cricket-api/data")

FILES = [
    "TN_Smat_TopOrder.json",
    "TN_Smat_MiddleOrder.json",
    "TN_Smat_Finisher.json"
]

OUTPUT_FILE = DATA_DIR / "tn_smat_batters_ready.json"

# -------------------------------
# LOAD RAW DATA
# -------------------------------
raw = []
for f in FILES:
    with open(DATA_DIR / f, "r") as file:
        raw.extend(json.load(file))

# -------------------------------
# GROUP BY PLAYER
# -------------------------------
players_map = defaultdict(list)

for row in raw:
    players_map[row["player_name"]].append(
        Innings(
            runs=row["runs"],
            balls=row["balls"],
            fours=row.get("fours", 0),
            sixes=row.get("sixes", 0),
            dismissed=True,
            result=row.get("result", "Loss"),
            chasing=row.get("chasing", False),
            knockout=row.get("knockout", False),
            opposition_tier=row.get("opposition_tier", "B"),
            match_format="T20",
            team_score_at_entry=row.get("team_runs", 0),
            wickets_at_entry=row.get("team_wickets", 0),
            required_run_rate=0.0
        )
    )

# -------------------------------
# PRESSURE METRICS
# -------------------------------
def build_pressure_metrics(innings):
    def avg_sr_bpd(lst):
        if not lst:
            return {"avg": 0, "sr": 0, "bpd": 0}
        runs = sum(i.runs for i in lst)
        balls = sum(i.balls for i in lst)
        d = len(lst)
        return {
            "avg": runs / d,
            "sr": (runs / balls) * 100,
            "bpd": balls / d
        }

    return {
        "collapse": avg_sr_bpd([i for i in innings if i.wickets_at_entry >= 3]),
        "chase": avg_sr_bpd([i for i in innings if i.chasing]),
        "knockout": avg_sr_bpd([i for i in innings if i.knockout]),
        "quality": avg_sr_bpd([i for i in innings if i.opposition_tier == "A"])
    }

# -------------------------------
# BUILD FINAL JSON
# -------------------------------
final_players = []

for name, innings in players_map.items():
    pressure_metrics = build_pressure_metrics(innings)

    pressure = compute_total_pressure_score(pressure_metrics)
    base = compute_base_skill_score(innings)
    consistency = compute_consistency_score(innings)
    opposition = compute_opposition_quality_score(innings)

    final_score = round(
        0.35 * pressure +
        0.30 * base +
        0.20 * consistency +
        0.15 * opposition,
        2
    )

    total_runs = sum(i.runs for i in innings)
    total_balls = sum(i.balls for i in innings)

    final_players.append({
        "id": name.lower().replace(" ", "-"),
        "name": name,
        "team": "Tamil Nadu",
        "role": "Batter",
        "stats": {
            "matches": len(innings),
            "runs": total_runs,
            "average": round(total_runs / len(innings), 2),
            "strikeRate": round((total_runs / total_balls) * 100, 2),

            "pressureScore": pressure,
            "baseSkillScore": base,
            "consistencyScore": consistency,
            "oppositionQualityScore": opposition,
            "finalScore": final_score
        }
    })

# -------------------------------
# WRITE FILE
# -------------------------------
OUTPUT_FILE.write_text(json.dumps({"players": final_players}, indent=2))
print(f"✅ Exported {len(final_players)} TN SMAT batters")
