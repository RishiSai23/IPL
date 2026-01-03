# backend/intelligence/engine/pressure_score_engine.py

from backend.intelligence.metrics.pressure_batting import pressure_batting_score


MAX_REALISTIC_RAW_SCORE = 75.0  # calibrated upper bound


def compute_total_pressure_score(metrics: dict) -> float:
    raw_score = 0.0

    raw_score += pressure_batting_score(
        metrics["collapse"]["avg"],
        metrics["collapse"]["sr"],
        metrics["collapse"]["bpd"],
        weight=30
    )

    raw_score += pressure_batting_score(
        metrics["chase"]["avg"],
        metrics["chase"]["sr"],
        metrics["chase"]["bpd"],
        weight=25
    )

    raw_score += pressure_batting_score(
        metrics["knockout"]["avg"],
        metrics["knockout"]["sr"],
        metrics["knockout"]["bpd"],
        weight=25
    )

    raw_score += pressure_batting_score(
        metrics["quality"]["avg"],
        metrics["quality"]["sr"],
        metrics["quality"]["bpd"],
        weight=20
    )

    # 🎯 Scale to 0–100
    final_score = (raw_score / MAX_REALISTIC_RAW_SCORE) * 100
    final_score = min(final_score, 100)

    return round(final_score, 2)
