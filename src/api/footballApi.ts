// src/api/footballApi.ts (MODIFIED)
import axios from "axios";

// Point to your local backend server's API route
const BASE_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  // IMPORTANT: The X-Auth-Token HEADER MUST BE REMOVED HERE
  // It is only used by the backend's dataFetcher.js
});

/**
 * Fetch player details by ID (Now calls your *cached* backend)
 */
export const getPlayerDetails = async (playerId: string) => {
  try {
    const response = await api.get(`/players/details/${playerId}`);
    return response.data; // This is the full, aggregated player object
  } catch (error) {
    console.error("Error fetching player details from backend cache:", error);
    throw error;
  }
};

/**
 * NEW: Fetch list of all cached players for the selection dialog
 */
export const getAllCachedPlayers = async () => {
  try {
    const response = await api.get("/players/all");
    // Returns a minimal list of players (ID, Name, Club)
    return response.data.players || [];
  } catch (error) {
    console.error("Error fetching player list from backend cache:", error);
    throw error;
  }
};

// NOTE: The getPlayerMatchesWithPerformance function can now be DELETED
// because all the match/performance data is now aggregated and returned by getPlayerDetails!

// ... any other helper functions remain
