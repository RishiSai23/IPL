import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.espncricinfo.com";

// 👉 LATEST SMAT SERIES (hardcoded for now – safest & fastest)
const SERIES_URL =
  "https://www.espncricinfo.com/series/syed-mushtaq-ali-trophy-2024-25-1410638/match-results";

// Output file
const OUTPUT_FILE = path.join(process.cwd(), "data", "tn_smat_batting.json");

async function fetchHTML(url) {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Connection: "keep-alive",
      },
    });
  
    return cheerio.load(data);
  }
  

async function getTamilNaduMatchLinks() {
  const $ = await fetchHTML(SERIES_URL);
  const links = [];

  $("a").each((_, el) => {
    const text = $(el).text();
    const href = $(el).attr("href");

    if (
      text.includes("Tamil Nadu") &&
      href &&
      href.includes("/full-scorecard")
    ) {
      links.push(BASE_URL + href);
    }
  });

  return [...new Set(links)];
}

async function parseScorecard(url) {
  const $ = await fetchHTML(url);
  const records = [];

  $("div.ds-rounded-lg").each((_, table) => {
    const teamName = $(table).find("span.ds-text-title-xs").first().text().trim();

    if (teamName !== "Tamil Nadu") return;

    $(table)
      .find("tbody tr")
      .each((idx, row) => {
        const cols = $(row).find("td");
        if (cols.length < 7) return;

        const player = $(cols[0]).text().trim();
        const dismissal = $(cols[1]).text().trim();
        const runs = parseInt($(cols[2]).text());
        const balls = parseInt($(cols[3]).text());
        const fours = parseInt($(cols[5]).text());
        const sixes = parseInt($(cols[6]).text());

        if (!player || isNaN(runs)) return;

        records.push({
          player_name: player,
          batting_position: idx + 1,
          runs,
          balls_faced: balls,
          fours,
          sixes,
          dismissed: !dismissal.toLowerCase().includes("not out"),
          match_url: url,
          team: "Tamil Nadu",
          tournament: "Syed Mushtaq Ali Trophy",
          season: "2024-25",
        });
      });
  });

  return records;
}

async function run() {
  console.log("🔍 Fetching Tamil Nadu SMAT matches...");
  const matchLinks = await getTamilNaduMatchLinks();

  console.log(`✅ Found ${matchLinks.length} matches`);

  let allData = [];

  for (const link of matchLinks) {
    console.log("📄 Parsing:", link);
    const data = await parseScorecard(link);
    allData.push(...data);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
  console.log(`🎯 Data saved to ${OUTPUT_FILE}`);
}

run();
