// cron/dataFetcher.js
const axios = require("axios");
const fs = require("fs/promises");
const path = require("path");

// NOTE: Get the API Key from a secure location (e.g., process.env)
// For this example, we assume you've set a system environment variable.
const API_KEY = process.env.FOOTBALL_API_KEY;
const EXTERNAL_BASE_URL = "https://api.football-data.org/v4";
const DATA_FILE_PATH = path.join(__dirname, "..", "data", "playerData.json");

const externalApi = axios.create({
  baseURL: EXTERNAL_BASE_URL,
  headers: {
    "X-Auth-Token": API_KEY,
  },
});

/**
 * Mocks the data aggregation process.
 * To avoid rate limits, we only fetch one league's teams and their squads.
 */
async function fetchAndAggregateData() {
  if (!API_KEY) {
    console.error("FATAL: FOOTBALL_API_KEY environment variable is not set.");
    return;
  }

  console.log("Starting data fetch from external API...");
  let aggregatedPlayers = [];

  try {
    // 1. Fetch all teams in a major league (e.g., Premier League ID: 2021)
    const teamsResponse = await externalApi.get("/competitions/PL/teams");
    const teams = teamsResponse.data.teams || [];

    console.log(`Fetched ${teams.length} teams. Now fetching squads...`);

    // 2. Aggregate players from all squads
    for (const team of teams) {
      // NOTE: A more efficient method is to check if the /teams/{id} endpoint
      // already includes the squad, which it usually does in a single call!

      const squad = team.squad || [];

      squad.forEach((player) => {
        // IMPORTANT: The external API player data is limited.
        // We add placeholder stats to match your frontend's requirements (goals, speed, etc.)
        aggregatedPlayers.push({
          id: String(player.id), // Ensure ID is a string for your frontend
          name: player.name,
          position: player.position || "Unknown",
          nationality: player.nationality || "Unknown",
          club: team.name,
          teamId: team.id,
          // MOCK/PLACEHOLDER STATS - Real data would come from matching players in match results
          leadership: Math.floor(Math.random() * 10),
          stats: {
            goals: Math.floor(Math.random() * 25),
            assists: Math.floor(Math.random() * 15),
            speed: Number((Math.random() * 10 + 25).toFixed(1)),
            accuracy: Number((Math.random() * 40 + 50).toFixed(1)),
            stamina: Math.floor(Math.random() * 90) + 10,
            matches: Math.floor(Math.random() * 38),
            yellowCards: Math.floor(Math.random() * 10),
            redCards: Math.floor(Math.random() * 2),
          },
        });
      });
    }

    const dataToSave = {
      lastUpdated: new Date().toISOString(),
      players: aggregatedPlayers,
    };

    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(dataToSave, null, 2));
    console.log(
      `✅ Data fetch complete! Saved ${aggregatedPlayers.length} players to local cache.`
    );
  } catch (error) {
    console.error(
      "Error during data fetching:",
      error.response ? error.response.data : error.message
    );
  }
}

// Execute the function when the script is run directly
if (require.main === module) {
  fetchAndAggregateData();
}

module.exports = { fetchAndAggregateData };
