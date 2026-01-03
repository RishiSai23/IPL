import sys
import json
from pathlib import Path
from collections import defaultdict

# --------------------------------------------------
# IMPORT ENGINES
# --------------------------------------------------
from backend.intelligence.engine.pressure_score_engine import (
    compute_total_pressure_score
)

from backend.intelligence.engine.batting_scores import (
    compute_base_skill_score,
    compute_consistency_score,
    compute_opposition_quality_score
)

from backend.intelligence.models.innings import Innings

# --------------------------------------------------
# ROLE SELECTION
# --------------------------------------------------
ROLE = sys.argv[1] if len(sys.argv) > 1 else "top"

DATA_MAP = {
    "top": "TN_Smat_TopOrder.json",
    "middle": "TN_Smat_MiddleOrder.json",
    "finisher": "TN_Smat_Finisher.json",
}

if ROLE not in DATA_MAP:
    raise ValueError("Role must be one of: top | middle | finisher")

DATA_PATH = Path("backend/cricket-api/data") / DATA_MAP[ROLE]

# --------------------------------------------------
# LOAD RAW JSON
# --------------------------------------------------
with open(DATA_PATH, "r") as f:
    raw_data = json.load(f)

# --------------------------------------------------
# JSON → Innings ADAPTER (AUTHORITATIVE)
# --------------------------------------------------
def dict_to_innings(d):
    return Innings(
        runs=d["runs"],
        balls=d["balls"],
        fours=d.get("fours", 0),
        sixes=d.get("sixes", 0),
        dismissed=d.get("dismissed", True),

        result=d.get("result", "Loss"),
        chasing=d.get("chasing", False),
        knockout=d.get("knockout", False),
        opposition_tier=d.get("opposition_tier", "B"),
        match_format="T20",

        team_score_at_entry=d.get("team_runs", 0),
        wickets_at_entry=d.get("team_wickets", 0),
        required_run_rate=0.0
    )

# --------------------------------------------------
# GROUP INNINGS BY PLAYER  ✅ (THIS WAS MISSING BEFORE)
# --------------------------------------------------
player_innings = defaultdict(list)

for row in raw_data:
    player_innings[row["player_name"]].append(
        dict_to_innings(row)
    )

# --------------------------------------------------
# PRESSURE METRICS BUILDER
# --------------------------------------------------
def build_pressure_metrics(innings):

    def avg_sr_bpd(filtered):
        if not filtered:
            return {"avg": 0, "sr": 0, "bpd": 0}

        runs = sum(i.runs for i in filtered)
        balls = sum(i.balls for i in filtered)
        dismissals = len(filtered)  # one innings = one dismissal context

        avg = runs / dismissals if dismissals else runs
        sr = (runs / balls) * 100 if balls else 0
        bpd = balls / dismissals if dismissals else balls

        return {"avg": avg, "sr": sr, "bpd": bpd}

    return {
        "collapse": avg_sr_bpd(
            [i for i in innings if i.wickets_at_entry >= 3]
        ),
        "chase": avg_sr_bpd(
            [i for i in innings if i.chasing]
        ),
        "knockout": avg_sr_bpd(
            [i for i in innings if i.knockout]
        ),
        "quality": avg_sr_bpd(
            [i for i in innings if i.opposition_tier == "A"]
        ),
    }

# --------------------------------------------------
# SCORE COMPUTATION
# --------------------------------------------------
print(f"\n=== PLAYER-WISE BATTING SCORES (SMAT | {ROLE.upper()} ORDER) ===\n")

for player, innings in player_innings.items():

    pressure_metrics = build_pressure_metrics(innings)
    pressure_score = compute_total_pressure_score(pressure_metrics)

    base_skill = compute_base_skill_score(innings)
    consistency = compute_consistency_score(innings)
    opposition = compute_opposition_quality_score(innings)

    final_score = round(
        0.35 * pressure_score +
        0.30 * base_skill +
        0.20 * consistency +
        0.15 * opposition,
        2
    )

    print(f"PLAYER : {player}")
    print("----------------------------------")
    print(f"Pressure Score              : {pressure_score}")
    print(f"Base Skill Score            : {base_skill}")
    print(f"Consistency Score           : {consistency}")
    print(f"Opposition Quality Score    : {opposition}")
    print("----------------------------------")
    print(f"FINAL MATCH READINESS SCORE : {final_score}")
    print("----------------------------------\n")
