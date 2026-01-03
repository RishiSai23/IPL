# backend/intelligence/models/innings.py

from dataclasses import dataclass

@dataclass
class Innings:
    # Batting output
    runs: int
    balls: int
    fours: int
    sixes: int
    dismissed: bool

    # Match context
    result: str              # "Win" / "Loss"
    chasing: bool
    knockout: bool
    opposition_tier: str     # "A", "B", "C"
    match_format: str        # "T20"

    # Pressure context
    team_score_at_entry: int
    wickets_at_entry: int
    required_run_rate: float
