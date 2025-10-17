import { supabase } from "@/lib/SupabaseClient";

// --------------------
// Types
// --------------------
export type Pitch = "flat" | "green" | "dry_turning" | "slow_low" | "two_paced";
export type Result = "win" | "loss" | "tie" | "nr";

export type InningsSummary = {
  battingTeam: string;
  bowlingTeam: string;
  runs: number | "";
  wickets: number | "";
  overs: number | "";
};

export type PlayerContribution = {
  id: string;
  name: string;
  batting?: any;
  bowling?: any;
  fielding?: any;
};

// Matches table schema alignment
export type SaveMatchInput = {
  date: string; // match date
  venue: string; // ground or venue
  pitch: Pitch; // pitch condition
  opposition_strength: number; // 1–5 integer
  innings_no: number; // 1 or 2
  target_runs?: number | null; // optional
  result: Result; // win/loss/tie/nr
  innings1: InningsSummary; // first innings summary
  innings2: InningsSummary; // second innings summary
  players: PlayerContribution[]; // all players data
};

// --------------------
// Save a match to Supabase (with players)
// --------------------
export async function saveMatch(matchData: SaveMatchInput) {
  // 1️⃣ Insert match (without players)
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .insert([
      {
        date: matchData.date,
        venue: matchData.venue,
        pitch: matchData.pitch,
        opposition_strength: matchData.opposition_strength,
        innings_no: matchData.innings_no,
        target_runs: matchData.target_runs ?? null,
        result: matchData.result,
        innings1: matchData.innings1,
        innings2: matchData.innings2,
      },
    ])
    .select()
    .single();

  if (matchError) {
    console.error("❌ Error saving match:", matchError.message);
    throw matchError;
  }

  // 2️⃣ Insert players linked to this match
  if (matchData.players.length > 0) {
    const playersToInsert = matchData.players.map((p) => ({
      id: p.id,
      name: p.name,
      batting: p.batting ?? null,
      bowling: p.bowling ?? null,
      fielding: p.fielding ?? null,
      match_id: match.id, // foreign key to matches table
    }));

    const { error: playersError } = await supabase
      .from("players")
      .insert(playersToInsert);

    if (playersError) {
      console.error("❌ Error saving players:", playersError.message);
      throw playersError;
    }
  }

  console.log("✅ Match and players saved successfully:", match);
  return match;
}

// --------------------
// Fetch all matches from Supabase
// --------------------
export async function listMatches() {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching matches:", error.message);
    return [];
  }

  return data as SaveMatchInput[];
}
