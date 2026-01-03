// src/api/footballApi.ts
import axios from "axios";

// ✅ Backend server is running on PORT 5000
const BASE_URL = "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

/**
 * Fetch full player details (from cached backend data)
 */
export const getPlayerDetails = async (playerId: string) => {
  try {
    const response = await api.get(`/players/details/${playerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching player details from backend cache:", error);
    throw error;
  }
};

/**
 * Fetch list of all cached players
 */
export const getAllCachedPlayers = async () => {
  try {
    const response = await api.get("/players/all");
    return response.data.players || [];
  } catch (error) {
    console.error("Error fetching player list from backend cache:", error);
    throw error;
  }
};
