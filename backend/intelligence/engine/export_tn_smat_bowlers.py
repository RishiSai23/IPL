# backend/intelligence/engine/export_tn_smat_bowlers.py

import json
from typing import List

from backend.intelligence.models.bowling_innings import BowlingInnings
from backend.intelligence.engine.bowling_scores import compute_bowling_scores


# ---- FILE PATHS ----
RAW_DATA_PATH = "backend/cricket-api/data/TN_Smat_Bowlers.json"
OUTPUT_PATH = "backend/cricket-api/data/tn_smat_bowlers_ready.json"


def load_tn_bowling_innings() -> List[BowlingInnings]:
    """
    Loads raw TN bowling data and converts it into BowlingInnings objects.
    """

    with open(RAW_DATA_PATH, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    innings_list = []

    for record in raw_data:
        innings = BowlingInnings(
            bowler_name=record["bowler_name"],
            team="Tamil Nadu",

            overs=record["overs"],
            maidens=record.get("maidens", 0),
            runs_conceded=record["runs_conceded"],
            wickets=record["wickets"],
            economy=record["economy"],

            opposition=record["opposition"],
            opposition_tier=record["opposition_tier"],

            result=record["result"],
            knockout=record["knockout"],

            bowling_phase=record.get("bowling_phase", {}),
            pressure_context=record.get("pressure_context", {}),
        )

        innings_list.append(innings)

    return innings_list


def export_tn_bowling_scores():
    """
    Computes Bowling Intelligence v1 scores for Tamil Nadu bowlers
    and exports selector-ready JSON.
    """

    innings_list = load_tn_bowling_innings()

    results = compute_bowling_scores(innings_list)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"✅ TN Bowling Intelligence exported → {OUTPUT_PATH}")


if __name__ == "__main__":
    export_tn_bowling_scores()
