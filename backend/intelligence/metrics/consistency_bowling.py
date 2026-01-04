# backend/intelligence/metrics/consistency_bowling.py

from typing import List
from statistics import pstdev
from backend.intelligence.models.bowling_innings import BowlingInnings


def compute_consistency_bowling_score(
    innings_list: List[BowlingInnings]
) -> float:
    """
    Computes Consistency Score for bowling (0–100).

    Philosophy:
    - Low variance in economy = high consistency
    - Rewards repeatable control
    - Sample-size aware
    """

    matches = len(innings_list)

    if matches < 2:
        # Not enough data to judge consistency
        return 45.0

    economies = [inn.economy for inn in innings_list]

    # Population standard deviation of economy
    econ_std = pstdev(economies)

    # ---- Base consistency score ----
    score = 50.0

    # ---- Variance impact (T20 benchmarks) ----
    if econ_std <= 0.75:
        score += 25
    elif econ_std <= 1.25:
        score += 15
    elif econ_std <= 2.0:
        score += 5
    elif econ_std <= 3.0:
        score -= 10
    else:
        score -= 20

    # ---- Wicket stability bonus ----
    wicket_counts = [inn.wickets for inn in innings_list]
    wicket_std = pstdev(wicket_counts)

    if wicket_std <= 0.5:
        score += 5
    elif wicket_std >= 1.5:
        score -= 5

    # ---- Sample-size dampening ----
    if matches < 4:
        score = (score * 0.7) + (50.0 * 0.3)

    # Clamp final score
    score = max(0.0, min(100.0, score))

    return round(score, 2)
