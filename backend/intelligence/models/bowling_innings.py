# backend/intelligence/models/bowling_innings.py

from dataclasses import dataclass
from typing import Dict


@dataclass
class BowlingInnings:
    """
    Represents ONE bowling spell in ONE match.
    Match-level granularity (v1).
    """

    bowler_name: str
    team: str

    overs: float
    maidens: int
    runs_conceded: int
    wickets: int
    economy: float

    opposition: str
    opposition_tier: str

    result: str          # "Win" or "Loss"
    knockout: bool

    bowling_phase: Dict[str, float]
    pressure_context: Dict[str, bool]

    # -------------------------
    # Derived helpers (v1)
    # -------------------------

    @property
    def is_pressure_spell(self) -> bool:
        """
        Determines whether this spell counts as a pressure situation.
        """
        return bool(self.pressure_context.get("match_pressure", False))

    @property
    def bowled_in_powerplay(self) -> bool:
        return bool(self.pressure_context.get("bowled_in_powerplay", False))

    @property
    def bowled_in_death(self) -> bool:
        return bool(self.pressure_context.get("bowled_in_death", False))

    @property
    def defending_target(self) -> bool:
        return bool(self.pressure_context.get("defending_target", False))

    @property
    def wickets_per_over(self) -> float:
        if self.overs == 0:
            return 0.0
        return round(self.wickets / self.overs, 2)

    @property
    def runs_per_over(self) -> float:
        if self.overs == 0:
            return 0.0
        return round(self.runs_conceded / self.overs, 2)
