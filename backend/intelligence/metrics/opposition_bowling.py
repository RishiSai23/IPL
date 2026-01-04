# backend/intelligence/metrics/opposition_bowling.py

from typing import List
from backend.intelligence.models.bowling_innings import BowlingInnings


def compute_opposition_quality_bowling_score(
    innings_list: List[BowlingInnings]
) -> float:
    """
    Computes Opposition Quality Score for bowling (0–100).

    Philosophy:
    - Performances vs Tier-A teams matter more
    - Economy + wickets both count
    - Avoids stat-padding against weak opposition
    """

    if not innings_list:
        return 45.0

    tier_weights = {
        "A": 1.2,
        "B": 1.0,
        "C": 0.8
    }

    weighted_scores = []
    total_weight = 0.0

    for inn in innings_list:
        tier = inn.opposition_tier
        weight = tier_weights.get(tier, 1.0)

        # ---- Base per-innings score ----
        score = 50.0

        # Economy impact (relative to T20 expectations)
        if inn.economy <= 7.0:
            score += 15
        elif inn.economy <= 8.0:
            score += 8
        elif inn.economy <= 9.0:
            score -= 5
        else:
            score -= 12

        # Wicket impact
        if inn.wickets >= 2:
            score += 12
        elif inn.wickets == 1:
            score += 6
        else:
            score -= 4

        # Clamp per-innings score
        score = max(0.0, min(100.0, score))

        weighted_scores.append(score * weight)
        total_weight += weight

    if total_weight == 0:
        return 45.0

    final_score = sum(weighted_scores) / total_weight

    # ---- Sample-size dampening ----
    if len(innings_list) < 3:
        final_score = (final_score * 0.7) + (50.0 * 0.3)

    return round(final_score, 2)
