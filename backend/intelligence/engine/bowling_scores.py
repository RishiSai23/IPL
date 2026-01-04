# backend/intelligence/engine/bowling_scores.py

from typing import List, Dict
from collections import defaultdict

from backend.intelligence.models.bowling_innings import BowlingInnings

from backend.intelligence.metrics.pressure_bowling import (
    compute_pressure_bowling_score,
)
from backend.intelligence.metrics.base_bowling import (
    compute_base_bowling_skill_score,
)
from backend.intelligence.metrics.consistency_bowling import (
    compute_consistency_bowling_score,
)
from backend.intelligence.metrics.opposition_bowling import (
    compute_opposition_quality_bowling_score,
)


def compute_bowling_scores(
    innings_list: List[BowlingInnings]
) -> List[Dict]:
    """
    Computes Bowling Intelligence v1 scores for all bowlers.

    Returns a list of selector-ready objects:
    {
        name,
        team,
        role,
        stats: {
            pressureScore,
            baseSkillScore,
            consistencyScore,
            oppositionQualityScore,
            finalScore
        }
    }
    """

    # ---- Group innings by bowler ----
    bowler_map = defaultdict(list)
    team_map = {}

    for inn in innings_list:
        bowler_map[inn.bowler_name].append(inn)
        team_map[inn.bowler_name] = inn.team

    results = []

    for bowler_name, spells in bowler_map.items():
        # ---- Metric computations ----
        pressure_score = compute_pressure_bowling_score(spells)
        base_skill_score = compute_base_bowling_skill_score(spells)
        consistency_score = compute_consistency_bowling_score(spells)
        opposition_quality_score = compute_opposition_quality_bowling_score(spells)

        # ---- Final weighted score ----
        final_score = (
            0.35 * pressure_score
            + 0.30 * base_skill_score
            + 0.20 * consistency_score
            + 0.15 * opposition_quality_score
        )

        results.append(
            {
                "name": bowler_name,
                "team": team_map.get(bowler_name, ""),
                "role": "Bowler",
                "stats": {
                    "pressureScore": round(pressure_score, 2),
                    "baseSkillScore": round(base_skill_score, 2),
                    "consistencyScore": round(consistency_score, 2),
                    "oppositionQualityScore": round(opposition_quality_score, 2),
                    "finalScore": round(final_score, 2),
                },
            }
        )

    # Sort by final score (descending)
    results.sort(key=lambda x: x["stats"]["finalScore"], reverse=True)

    return results
