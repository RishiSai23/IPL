# backend/intelligence/metrics/pressure_bowling.py

from typing import List
from backend.intelligence.models.bowling_innings import BowlingInnings
from backend.intelligence.rules.bowling_pressure_rules import tag_bowling_pressure


def compute_pressure_bowling_score(
    innings_list: List[BowlingInnings]
) -> float:
    """
    Computes Pressure Bowling Score (0–100).

    Philosophy:
    - Evaluate ONLY pressure spells
    - Reward control + wickets under pressure
    - Do not over-penalize small samples
    - Bowling well in losses still counts
    """

    # Filter pressure spells
    pressure_spells = [
        inn for inn in innings_list if inn.is_pressure_spell
    ]

    # If no pressure data, return neutral-low score
    if not pressure_spells:
        return 40.0

    scores = []

    for inn in pressure_spells:
        tags = tag_bowling_pressure(inn)

        # ---- Base score for a pressure spell ----
        spell_score = 50.0

        # ---- Economy impact (T20 reference) ----
        # Ideal T20 economy under pressure ≈ 7.5
        if inn.economy <= 7.5:
            spell_score += 15
        elif inn.economy <= 8.5:
            spell_score += 5
        elif inn.economy <= 9.5:
            spell_score -= 5
        else:
            spell_score -= 15

        # ---- Wicket impact ----
        if inn.wickets >= 2:
            spell_score += 15
        elif inn.wickets == 1:
            spell_score += 7
        else:
            spell_score -= 5

        # ---- Phase bonuses ----
        if tags["powerplay_pressure"]:
            spell_score += 5

        if tags["death_pressure"]:
            spell_score += 10

        # ---- Opposition quality ----
        if tags["quality_opposition_pressure"]:
            spell_score += 5

        # ---- Knockout match ----
        if tags["knockout_pressure"]:
            spell_score += 5

        # Clamp per-spell score
        spell_score = max(0.0, min(100.0, spell_score))
        scores.append(spell_score)

    # ---- Aggregate with sample-size awareness ----
    avg_score = sum(scores) / len(scores)

    # Sample dampening: fewer pressure spells → slight pull to neutral
    if len(scores) < 3:
        avg_score = (avg_score * 0.7) + (50.0 * 0.3)

    return round(avg_score, 2)
