# backend/intelligence/metrics/pressure_batting.py

def normalize(value, min_val, max_val):
    if value <= min_val:
        return 0.0
    if value >= max_val:
        return 1.0
    return (value - min_val) / (max_val - min_val)


def pressure_batting_score(
    avg: float,
    strike_rate: float,
    balls_per_dismissal: float,
    weight: float
) -> float:
    """
    Compute weighted pressure batting score.
    """

    avg_score = normalize(avg, 20, 60)
    sr_score = normalize(strike_rate, 80, 150)
    bpd_score = normalize(balls_per_dismissal, 20, 80)

    combined = (avg_score * 0.4) + (sr_score * 0.3) + (bpd_score * 0.3)

    return combined * weight
