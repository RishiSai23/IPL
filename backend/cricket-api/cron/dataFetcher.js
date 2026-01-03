// backend/cricket-api/cron/dataFetcher.js
import fs from "fs/promises";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, "../data/playerData.json");
const API_KEY = process.env.CRICKETDATA_API_KEY;
const API_URL = "https://api.cricapi.com/v1/players"; // CricketData.org endpoint

export async function fetchAndAggregateData() {
  try {
    console.log("Fetching cricket player data from API...");
    const response = await axios.get(API_URL, {
      params: {
        apikey: API_KEY,
        offset: 0,
      },
    });

    const rawPlayers = response.data.data || [];
    const formattedPlayers = rawPlayers.slice(0, 100).map((p, index) => ({
      id: p.id || index.toString(),
      name: p.name,
      club: p.country || "Unknown",
      position: p.role || "Player",
      stats: {
        matches: Math.floor(Math.random() * 200),
        runs: Math.floor(Math.random() * 8000),
        wickets: Math.floor(Math.random() * 400),
        strikeRate: Math.random() * 150,
        average: Math.random() * 60,
        economy: Math.random() * 8,
        catches: Math.floor(Math.random() * 50),
      },
      image:
        p.playerImg ||
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
    }));

    const dataToSave = {
      players: formattedPlayers,
      lastUpdated: new Date().toISOString(),
    };

    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(dataToSave, null, 2));

    console.log(
      `✅ Cricket player data cached successfully (${formattedPlayers.length} players).`
    );
  } catch (error) {
    console.error("❌ Error fetching cricket data:", error.message);
  }
}
