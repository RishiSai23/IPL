# backend/intelligence/metrics/base_bowling.py

from typing import List
from backend.intelligence.models.bowling_innings import BowlingInnings


def compute_base_bowling_skill_score(
    innings_list: List[BowlingInnings]
) -> float:
    """
    Computes Base Bowling Skill Score (0–100).

    Philosophy:
    - Measures fundamental bowling ability
    - Rewards control + wicket efficiency
    - Avoids punishing bowlers who bowl fewer overs
    - Sample-size aware
    """

    if not innings_list:
        return 40.0

    total_overs = sum(inn.overs for inn in innings_list)
    total_runs = sum(inn.runs_conceded for inn in innings_list)
    total_wickets = sum(inn.wickets for inn in innings_list)
    matches = len(innings_list)

    # ---- Economy calculation ----
    if total_overs > 0:
        avg_economy = total_runs / total_overs
    else:
        avg_economy = 10.0  # Neutral fallback

    # ---- Wicket efficiency ----
    wickets_per_match = total_wickets / matches

    # ---- Base score ----
    score = 50.0

    # ---- Economy impact (T20 benchmarks) ----
    if avg_economy <= 6.5:
        score += 20
    elif avg_economy <= 7.5:
        score += 12
    elif avg_economy <= 8.5:
        score += 5
    elif avg_economy <= 9.5:
        score -= 5
    else:
        score -= 15

    # ---- Wicket-taking impact ----
    if wickets_per_match >= 2.0:
        score += 15
    elif wickets_per_match >= 1.0:
        score += 8
    elif wickets_per_match >= 0.5:
        score += 2
    else:
        score -= 5

    # ---- Sample-size dampening ----
    if matches < 3:
        score = (score * 0.7) + (50.0 * 0.3)

    # Clamp final score
    score = max(0.0, min(100.0, score))

    return round(score, 2)
