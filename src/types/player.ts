// file: src/types/player.ts
export interface PlayerStats {
    matches: number;
    runs: number;
    wickets: number;
    strikeRate: number;
    average: number;
    economy: number;
    catches: number;
    fifties: number;
    hundreds: number;
    bestBowling: string;
  }
  
  export interface PlayerForm {
    last5Matches: number[];
    trend: 'up' | 'down' | 'stable';
    recentPerformance: 'excellent' | 'good' | 'average' | 'poor';
  }
  
  export interface PlayerSWOT {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  }
  
  export interface PlayerRole {
    primary: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
    secondary?: string[];
    fitment: {
      powerHitter: number;
      anchor: number;
      finisher: number;
      deathBowler: number;
      impactSub: number;
    };
  }
  
  export interface Player {
    id: string;
    name: string;
    team: string;
    age: number;
    nationality: string;
    position: string;
    stats: PlayerStats;
    form: PlayerForm;
    swot: PlayerSWOT;
    role: PlayerRole;
    auctionValue: {
      current: number;
      predicted: number;
      confidence: number;
    };
    image?: string;
    injuryRisk: 'low' | 'medium' | 'high';
    leadership: number; // 1-10 scale
  }
  
  export interface TeamComparison {
    player1: Player;
    player2: Player;
    metrics: {
      batting: number;
      bowling: number;
      fielding: number;
      experience: number;
      value: number;
    };
  }