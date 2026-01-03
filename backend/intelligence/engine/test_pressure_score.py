# backend/intelligence/engine/test_pressure_score.py

from backend.intelligence.engine.pressure_score_engine import compute_total_pressure_score


def run_test():
    sample_metrics = {
        "collapse": {"avg": 42, "sr": 88, "bpd": 54},
        "chase": {"avg": 38, "sr": 92, "bpd": 47},
        "knockout": {"avg": 45, "sr": 85, "bpd": 61},
        "quality": {"avg": 35, "sr": 80, "bpd": 40}
    }

    score = compute_total_pressure_score(sample_metrics)

    print("Pressure Batting Score:", score)


if __name__ == "__main__":
    run_test()
