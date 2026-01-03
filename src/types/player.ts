// ===============================
// CRICKET COMPARE (REAL DATA)
// ===============================

export interface CricketCompareStats {
  matches: number;
  runs: number;
  average: number;
  strikeRate: number;

  pressureScore: number;
  baseSkillScore: number;
  consistencyScore: number;
  oppositionQualityScore: number;
  finalScore: number;
}

export interface CricketComparePlayer {
  id: string;
  name: string;
  team: string;
  role: string;
  stats: CricketCompareStats;
}
