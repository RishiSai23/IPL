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
// HELPER
// -----------------------------
const readJSON = (file) => {
  const filePath = path.join(__dirname, "data", file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const serveJSON = (res, data) => {
  res.json({ players: data });
};

// -----------------------------
// BATTERS
// -----------------------------
app.get("/api/v1/players/tn-smat-batters", (req, res) =>
  serveJSON(res, readJSON("tn_smat_batters_ready.json"))
);

app.get("/api/v1/players/ker-smat-batters", (req, res) =>
  serveJSON(res, readJSON("kl_smat_batters_ready.json"))
);

// -----------------------------
// BOWLERS
// -----------------------------
app.get("/api/v1/players/tn-smat-bowlers", (req, res) =>
  serveJSON(res, readJSON("tn_smat_bowlers_ready.json"))
);

app.get("/api/v1/players/ker-smat-bowlers", (req, res) =>
  serveJSON(res, readJSON("kl_smat_bowlers_ready.json"))
);

// -----------------------------
// 🔥 AGGREGATED ENDPOINT (THIS WAS MISSING)
// -----------------------------
app.get("/api/v1/players/all", (req, res) => {
  const allPlayers = [
    ...readJSON("tn_smat_batters_ready.json"),
    ...readJSON("kl_smat_batters_ready.json"),
    ...readJSON("tn_smat_bowlers_ready.json"),
    ...readJSON("kl_smat_bowlers_ready.json"),
  ];

  serveJSON(res, allPlayers);
});

// -----------------------------
app.listen(PORT, () => {
  console.log(`✅ Cricket API running at http://localhost:${PORT}`);
});
