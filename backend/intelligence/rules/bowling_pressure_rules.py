# backend/intelligence/rules/bowling_pressure_rules.py

from typing import Dict
from backend.intelligence.models.bowling_innings import BowlingInnings


def tag_bowling_pressure(innings: BowlingInnings) -> Dict[str, bool]:
    """
    Tags different types of pressure applicable to a bowling spell.
    This function is PURE LOGIC.
    No scoring, no weighting.
    """

    pressure_tags = {
        "match_pressure": False,
        "powerplay_pressure": False,
        "death_pressure": False,
        "defending_pressure": False,
        "quality_opposition_pressure": False,
        "knockout_pressure": False,
    }

    # 1️⃣ Match-level pressure (already pre-tagged upstream)
    if innings.is_pressure_spell:
        pressure_tags["match_pressure"] = True

    # 2️⃣ Powerplay pressure
    if innings.bowled_in_powerplay:
        pressure_tags["powerplay_pressure"] = True

    # 3️⃣ Death overs pressure
    if innings.bowled_in_death:
        pressure_tags["death_pressure"] = True

    # 4️⃣ Defending a target
    if innings.defending_target:
        pressure_tags["defending_pressure"] = True

    # 5️⃣ Quality opposition pressure (Tier A teams)
    if innings.opposition_tier == "A":
        pressure_tags["quality_opposition_pressure"] = True

    # 6️⃣ Knockout match pressure
    if innings.knockout:
        pressure_tags["knockout_pressure"] = True

    return pressure_tags
