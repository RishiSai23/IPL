// backend/cricket-api/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// -----------------------------
// TN SMAT BATTERS ROUTE (ONLY DATA WE USE)
// -----------------------------
app.get("/api/v1/players/tn-smat-batters", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "data/tn_smat_batters_ready.json"
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ players: [] });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load TN SMAT batters" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Cricket API running at http://localhost:${PORT}`);
});
