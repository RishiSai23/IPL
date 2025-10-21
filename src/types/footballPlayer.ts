// src/types/footballPlayer.ts

export type FootballPlayer = {
  id: string;
  name: string;
  age: number;
  nationality: string;
  club: string;
  position: string;
  stats: {
    goals: number;
    assists: number;
    speed: number; // Top speed (km/h)
    accuracy: number; // Pass accuracy (%)
    stamina: number; // Stamina Index (0-100)
    matches: number;
    yellowCards: number;
    redCards: number;
  };
  leadership: number; // Leadership score (1-10)
  marketValue: {
    predicted: number; // Market value in currency units, e.g., INR or EUR
    lastAuction?: number; // Last auction/transfer value, optional
  };
  photoUrl?: string; // Optional, for display
  bio?: string; // Optional, little summary or highlights
};
