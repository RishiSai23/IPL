from backend.intelligence.models.innings import Innings
from backend.intelligence.rules.pressure_rules import tag_pressure



def run_pressure_tagging():
    sample_innings = Innings(
        runs=54,
        balls=89,
        team_score_at_entry=34,
        wickets_at_entry=2,
        chasing=True,
        required_run_rate=8.2,
        knockout=True,
        opposition_tier="A",
        match_format="T20"
    )

    tags = tag_pressure(sample_innings)

    print("Innings:", sample_innings)
    print("Pressure Tags:", tags)


if __name__ == "__main__":
    run_pressure_tagging()
