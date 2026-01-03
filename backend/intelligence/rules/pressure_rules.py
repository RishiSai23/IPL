# backend/intelligence/rules/pressure_rules.py

from backend.intelligence.models.innings import Innings


def tag_pressure(innings: Innings) -> dict:
    """
    Apply format-aware, rule-based pressure tags to a single innings.
    """

    tags = {
        "collapse_pressure": False,
        "chase_pressure": False,
        "knockout_pressure": False,
        "quality_pressure": False
    }

    format = innings.match_format.upper()

    # -----------------------------
    # 🔴 COLLAPSE PRESSURE
    # -----------------------------
    if format == "TEST":
        if innings.wickets_at_entry >= 2 and innings.team_score_at_entry < 120:
            tags["collapse_pressure"] = True

    elif format == "ODI":
        if innings.wickets_at_entry >= 2 and innings.team_score_at_entry < 100:
            tags["collapse_pressure"] = True

    elif format == "T20":
        if innings.wickets_at_entry >= 2 and innings.team_score_at_entry < 60:
            tags["collapse_pressure"] = True

    # -----------------------------
    # 🔴 CHASE PRESSURE
    # -----------------------------
    if innings.chasing:
        if format == "TEST" and innings.required_run_rate >= 4.0:
            tags["chase_pressure"] = True

        elif format == "ODI" and innings.required_run_rate >= 6.0:
            tags["chase_pressure"] = True

        elif format == "T20" and innings.required_run_rate >= 8.0:
            tags["chase_pressure"] = True

    # -----------------------------
    # 🔴 KNOCKOUT PRESSURE
    # -----------------------------
    if innings.knockout:
        tags["knockout_pressure"] = True

    # -----------------------------
    # 🔴 OPPOSITION QUALITY PRESSURE
    # -----------------------------
    if innings.opposition_tier.upper() == "A":
        tags["quality_pressure"] = True

    return tags
