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
const serveJSON = (res, filePath, errorMsg) => {
  try {
    if (!fs.existsSync(filePath)) {
      return res.json({ players: [] });
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    res.json({ players: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: errorMsg });
  }
};

// -----------------------------
// BATTERS
// -----------------------------
app.get("/api/v1/players/tn-smat-batters", (req, res) =>
  serveJSON(
    res,
    path.join(__dirname, "data/tn_smat_batters_ready.json"),
    "Failed to load TN batters"
  )
);

app.get("/api/v1/players/ker-smat-batters", (req, res) =>
  serveJSON(
    res,
    path.join(__dirname, "data/kl_smat_batters_ready.json"),
    "Failed to load KL batters"
  )
);

// -----------------------------
// BOWLERS (NEW)
// -----------------------------
app.get("/api/v1/players/tn-smat-bowlers", (req, res) =>
  serveJSON(
    res,
    path.join(__dirname, "data/tn_smat_bowlers_ready.json"),
    "Failed to load TN bowlers"
  )
);

app.get("/api/v1/players/ker-smat-bowlers", (req, res) =>
  serveJSON(
    res,
    path.join(__dirname, "data/kl_smat_bowlers_ready.json"),
    "Failed to load KL bowlers"
  )
);

app.listen(PORT, () => {
  console.log(`✅ Cricket API running at http://localhost:${PORT}`);
});
