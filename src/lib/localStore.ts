// file: src/lib/localStore.ts
import { type PlayerContribution } from "@/components/match/PlayerContributions";

export type Pitch = "flat" | "green" | "dry_turning" | "slow_low" | "two_paced";
export type Result = "win" | "loss" | "tie" | "nr";

export type MatchInfo = {
  date: string;
  venue: string;
  pitch: Pitch;
  oppositionStrength: "1" | "2" | "3" | "4" | "5";
  inningsNo: "1" | "2";
  targetRuns?: number | "";
  result: Result;
};

export type InningsSummary = {
  battingTeam: string;
  bowlingTeam: string;
  runs: number | "";
  wickets: number | "";
  overs: number | "";
};

export type SavedMatch = {
  id: string;
  createdAt: string; // ISO
  matchInfo: MatchInfo;
  innings: InningsSummary;
  players: PlayerContribution[];
  geo?: { lat: number | null; lng: number | null };
};

const STORAGE_KEY = "cricscout.matches.v1";

function safeUUID() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID();
  }
  return `m_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function readAll(): SavedMatch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedMatch[]) : [];
  } catch {
    return [];
  }
}

function writeAll(list: SavedMatch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export type SaveMatchInput = Omit<SavedMatch, "id" | "createdAt">;

export function saveNewMatch(input: SaveMatchInput): SavedMatch {
  const all = readAll();
  const match: SavedMatch = {
    id: safeUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  // newest first
  writeAll([match, ...all]);
  return match;
}

export function listMatches(): SavedMatch[] {
  return readAll();
}

export function deleteMatch(id: string) {
  const next = readAll().filter((m) => m.id !== id);
  writeAll(next);
}

export function updateMatch(updated: SavedMatch) {
  const next = readAll().map((m) => (m.id === updated.id ? updated : m));
  writeAll(next);
}

export function clearMatches() {
  writeAll([]);
}