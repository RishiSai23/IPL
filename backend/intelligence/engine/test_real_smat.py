import json
from collections import defaultdict

from backend.intelligence.engine.pressure_score_engine import (
    compute_total_pressure_score
)

# -----------------------------
# HELPERS
# -----------------------------
def compute_avg_sr_bpd(innings):
    runs = sum(i["runs"] for i in innings)
    balls = sum(i["balls"] for i in innings)
    dismissals = sum(1 for i in innings if i["dismissed"])

    avg = runs / dismissals if dismissals > 0 else runs
    sr = (runs / balls) * 100 if balls > 0 else 0
    bpd = balls / dismissals if dismissals > 0 else balls

    return round(avg, 2), round(sr, 2), round(bpd, 2)


def filter_innings(innings, condition):
    return [i for i in innings if condition(i)]


# -----------------------------
# LOAD DATA
# -----------------------------
DATA_PATH = "backend/data/tn_smat_batting.json"

with open(DATA_PATH, "r") as f:
    all_innings = json.load(f)

print("\n=== PLAYER-WISE PRESSURE METRICS (REAL SMAT DATA) ===")

# -----------------------------
# GROUP BY PLAYER
# -----------------------------
player_innings = defaultdict(list)
for inning in all_innings:
    player_innings[inning["player_name"]].append(inning)

# -----------------------------
# COMPUTE SCORES
# -----------------------------
for player, innings in player_innings.items():
    print("\n----------------------------------")
    print(f"PLAYER : {player}")
    print("----------------------------------")

    collapse_innings = filter_innings(
        innings,
        lambda i: i["batting_position"] <= 3 and i["team_runs"] < 160
    )

    chase_innings = filter_innings(
        innings,
        lambda i: i["chasing"]
    )

    knockout_innings = filter_innings(
        innings,
        lambda i: i["knockout"]
    )

    quality_innings = filter_innings(
        innings,
        lambda i: i["opposition_tier"] == "A"
    )

    metrics = {
        "collapse": dict(zip(
            ["avg", "sr", "bpd"],
            compute_avg_sr_bpd(collapse_innings or innings)
        )),
        "chase": dict(zip(
            ["avg", "sr", "bpd"],
            compute_avg_sr_bpd(chase_innings or innings)
        )),
        "knockout": dict(zip(
            ["avg", "sr", "bpd"],
            compute_avg_sr_bpd(knockout_innings or innings)
        )),
        "quality": dict(zip(
            ["avg", "sr", "bpd"],
            compute_avg_sr_bpd(quality_innings or innings)
        )),
    }

    pressure_score = compute_total_pressure_score(metrics)

    print("Pressure Sub-Metrics:")
    for k, v in metrics.items():
        print(f"  {k.capitalize():10s} → Avg: {v['avg']}, SR: {v['sr']}, BPD: {v['bpd']}")

    print("\nFINAL PRESSURE SCORE:", pressure_score)
    print("----------------------------------")
