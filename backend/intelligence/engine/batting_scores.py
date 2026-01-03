import math
from statistics import mean, stdev

# --------------------------------------------------
# Helper normalization functions
# --------------------------------------------------

def clamp(score, low=0, high=100):
    return max(low, min(score, high))


def normalize_linear(value, low, high):
    if value <= low:
        return 0
    if value >= high:
        return 100
    return ((value - low) / (high - low)) * 100


# --------------------------------------------------
# 1️⃣ BASE SKILL SCORE
# --------------------------------------------------

def compute_base_skill_score(innings_list):
    """
    innings_list: list of Innings objects
    """

    if not innings_list:
        return 0

    total_runs = sum(i.runs for i in innings_list)
    total_balls = sum(i.balls for i in innings_list)
    dismissals = sum(1 for i in innings_list if i.dismissed)

    fours = sum(getattr(i, "fours", 0) for i in innings_list)
    sixes = sum(getattr(i, "sixes", 0) for i in innings_list)

    batting_avg = total_runs / dismissals if dismissals > 0 else total_runs
    strike_rate = (total_runs / total_balls) * 100 if total_balls > 0 else 0
    balls_per_dismissal = total_balls / dismissals if dismissals > 0 else total_balls

    boundary_runs = (fours * 4) + (sixes * 6)
    boundary_pct = (boundary_runs / total_runs) * 100 if total_runs > 0 else 0

    # Normalize metrics (T20 benchmarks)
    avg_score = normalize_linear(batting_avg, 20, 40)
    sr_score = normalize_linear(strike_rate, 110, 150)
    bpd_score = normalize_linear(balls_per_dismissal, 15, 30)

    # Boundary balance (penalize over-dependence)
    if boundary_pct < 40:
        boundary_score = 60
    elif 40 <= boundary_pct <= 55:
        boundary_score = 100
    elif 55 < boundary_pct <= 65:
        boundary_score = 70
    else:
        boundary_score = 40

    base_skill = (
        0.35 * avg_score
        + 0.30 * sr_score
        + 0.20 * bpd_score
        + 0.15 * boundary_score
    )

    return clamp(round(base_skill, 2))


# --------------------------------------------------
# 2️⃣ CONSISTENCY SCORE
# --------------------------------------------------

def compute_consistency_score(innings_list):
    if not innings_list:
        return 0

    scores = [i.runs for i in innings_list]
    total = len(scores)

    contrib_30 = len([s for s in scores if s >= 30]) / total
    contrib_50 = len([s for s in scores if s >= 50]) / total

    variance_penalty = 0
    if total >= 3:
        variance = stdev(scores)
        variance_penalty = normalize_linear(variance, 5, 35)
        variance_penalty = 100 - variance_penalty  # lower variance = better

    # Failure recovery
    recovery_count = 0
    for i in range(1, total):
        if scores[i - 1] < 10 and scores[i] >= 30:
            recovery_count += 1

    recovery_score = (
        (recovery_count / total) * 100 if total > 0 else 0
    )

    consistency = (
        0.40 * (contrib_30 * 100)
        + 0.25 * (contrib_50 * 100)
        + 0.20 * variance_penalty
        + 0.15 * recovery_score
    )

    return clamp(round(consistency, 2))


# --------------------------------------------------
# 3️⃣ OPPOSITION QUALITY SCORE
# --------------------------------------------------

def compute_opposition_quality_score(innings_list):
    if not innings_list:
        return 0

    tier_weights = {"A": 1.0, "B": 0.6, "C": 0.3}

    weighted_runs = 0
    weighted_balls = 0
    weight_sum = 0

    win_contrib = 0
    win_weight = 0

    for i in innings_list:
        weight = tier_weights.get(i.opposition_tier, 0.3)

        weighted_runs += i.runs * weight
        weighted_balls += i.balls * weight
        weight_sum += weight

        if getattr(i, "result", "Loss") == "Win":
            win_contrib += i.runs * weight
            win_weight += weight

    avg_vs_quality = (
        weighted_runs / weight_sum if weight_sum > 0 else 0
    )
    sr_vs_quality = (
        (weighted_runs / weighted_balls) * 100 if weighted_balls > 0 else 0
    )

    avg_score = normalize_linear(avg_vs_quality, 20, 40)
    sr_score = normalize_linear(sr_vs_quality, 110, 150)

    win_impact = (
        (win_contrib / win_weight) if win_weight > 0 else 0
    )
    win_score = normalize_linear(win_impact, 15, 40)

    opposition_quality = (
        0.50 * avg_score
        + 0.30 * win_score
        + 0.20 * sr_score
    )

    return clamp(round(opposition_quality, 2))
