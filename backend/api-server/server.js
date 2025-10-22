// server.js

require("dotenv").config();
const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const cron = require("node-cron");
const cors = require("cors"); // <-- NEW IMPORT
const { fetchAndAggregateData } = require("./cron/dataFetcher");

const app = express();
const PORT = 3000;
const DATA_FILE_PATH = path.join(__dirname, "data", "playerData.json");

// --- CORS CONFIGURATION ---
// FIX: Configure CORS to specifically allow your frontend's origin (port 5173)
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD", // Only allowing GET/HEAD as this is a read-only cache server
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions)); // <-- APPLY CORS MIDDLEWARE
// --- END CORS CONFIGURATION ---

// --- CRON JOB ---
// Schedule data update every day at midnight (00:00)
cron.schedule("0 0 * * *", () => {
  console.log("Running daily scheduled data fetch...");
  fetchAndAggregateData();
});
// Run the fetch once immediately when the server starts
fetchAndAggregateData();
// --- END CRON JOB ---

// Simple error/not-found check for the data file
async function getPlayerData() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Could not read player data file:", err.message);
    return { players: [] };
  }
}

// --- API Routes for Frontend ---
app.get("/api/v1/players/all", async (req, res) => {
  const data = await getPlayerData();
  // Return the full list of players for the selection dialog
  res.json({
    players: data.players.map((p) => ({
      id: p.id,
      name: p.name,
      club: p.club,
      position: p.position,
    })),
    lastUpdated: data.lastUpdated,
  });
});

app.get("/api/v1/players/details/:playerId", async (req, res) => {
  const playerId = req.params.playerId;
  const data = await getPlayerData();

  // Find the player's full, pre-aggregated data
  const player = data.players.find((p) => p.id === playerId);

  if (player) {
    res.json(player);
  } else {
    res.status(404).json({ message: "Player not found in cache." });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend running at http://localhost:${PORT}`);
  console.log("Serving cached data to frontend...");
});
