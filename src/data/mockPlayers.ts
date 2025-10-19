import type { Player } from "@/types/player";

type BasicPlayer = {
  id: number;
  name: string;
  team: string; // short code is fine (MI/RCB/CSK...)
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
};

// ---------------------------------------------
// 🖼️  Import all images from /src/assets/players
// ---------------------------------------------
const playerImages = import.meta.glob("/src/assets/players/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
});

function getPlayerImage(name: string): string {
  const normalized = name.toLowerCase().replace(/\s+/g, "-");
  for (const path in playerImages) {
    if (path.toLowerCase().includes(normalized)) return playerImages[path] as string;
  }
  return "/src/assets/players/default.png";
}


// ------------------------------------------------
// 🧠  Player Base Data (Unchanged SWOT definitions)
// ------------------------------------------------
const BASIC: BasicPlayer[] = [
  {
    id: 1,
    name: "Rohit Sharma",
    team: "MI",
    swot: {
      strengths: ["Explosive opening batsman", "Calm under pressure", "Leadership experience"],
      weaknesses: ["Inconsistency in T20s"],
      opportunities: ["Can mentor young batters", "Strong captain material"],
      threats: ["Injury risk due to workload"],
    },
  },
  {
    id: 2,
    name: "Virat Kohli",
    team: "RCB",
    swot: {
      strengths: ["Fitness and consistency", "Aggressive leader", "High strike rate"],
      weaknesses: ["Struggles with spin at times"],
      opportunities: ["Experience benefits team culture"],
      threats: ["Overexposure to media pressure"],
    },
  },
  {
    id: 3,
    name: "Suryakumar Yadav",
    team: "MI",
    swot: {
      strengths: ["360° shot-making", "Fearless batting"],
      weaknesses: ["Occasional risky shots"],
      opportunities: ["Can stabilize middle order"],
      threats: ["Form fluctuation"],
    },
  },
  {
    id: 4,
    name: "Jasprit Bumrah",
    team: "MI",
    swot: {
      strengths: ["Deadly yorkers", "Death overs specialist"],
      weaknesses: ["Prone to back injury"],
      opportunities: ["Match-winning potential"],
      threats: ["Injury recurrence"],
    },
  },
  {
    id: 5,
    name: "Hardik Pandya",
    team: "GT",
    swot: {
      strengths: ["All-rounder", "Leadership", "Finisher"],
      weaknesses: ["Fitness issues"],
      opportunities: ["Lead national T20 side"],
      threats: ["High workload"],
    },
  },
  {
    id: 6,
    name: "Shubman Gill",
    team: "GT",
    swot: {
      strengths: ["Elegant stroke play", "Calm temperament"],
      weaknesses: ["Slow starts sometimes"],
      opportunities: ["Future captain prospect"],
      threats: ["Pressure of expectations"],
    },
  },
  {
    id: 7,
    name: "Ravindra Jadeja",
    team: "CSK",
    swot: {
      strengths: ["All-round contribution", "Electric fielding"],
      weaknesses: ["Inconsistency with bat"],
      opportunities: ["Can lead spin attack"],
      threats: ["Injury risk"],
    },
  },
  {
    id: 8,
    name: "MS Dhoni",
    team: "CSK",
    swot: {
      strengths: ["Unmatched captaincy", "Cool temperament"],
      weaknesses: ["Age affecting reflexes"],
      opportunities: ["Mentor role"],
      threats: ["Retirement nearing"],
    },
  },
  {
    id: 9,
    name: "Ruturaj Gaikwad",
    team: "CSK",
    swot: {
      strengths: ["Solid technique", "Composed mindset"],
      weaknesses: ["Struggles with swing early"],
      opportunities: ["Future India opener"],
      threats: ["Competition for spot"],
    },
  },
  {
    id: 10,
    name: "KL Rahul",
    team: "LSG",
    swot: {
      strengths: ["Stylish stroke player", "Captaincy"],
      weaknesses: ["Inconsistent strike rate"],
      opportunities: ["Top-order anchor"],
      threats: ["Injury prone"],
    },
  },
  {
    id: 11,
    name: "Rashid Khan",
    team: "GT",
    swot: {
      strengths: ["World-class spinner", "Game-changer"],
      weaknesses: ["Weak lower-order batting"],
      opportunities: ["Can develop all-round skills"],
      threats: ["Over-dependence"],
    },
  },
  {
    id: 12,
    name: "Sanju Samson",
    team: "RR",
    swot: {
      strengths: ["Explosive batting", "Leadership"],
      weaknesses: ["Lack of consistency"],
      opportunities: ["National selection"],
      threats: ["Competition for wicketkeeper role"],
    },
  },
  {
    id: 13,
    name: "Mohammed Siraj",
    team: "RCB",
    swot: {
      strengths: ["Aggressive bowling", "Improved control"],
      weaknesses: ["Can leak runs early"],
      opportunities: ["Lead Indian pace attack"],
      threats: ["Injury risk"],
    },
  },
  {
    id: 14,
    name: "Yuzvendra Chahal",
    team: "RR",
    swot: {
      strengths: ["Spin variation", "Experience"],
      weaknesses: ["Flat pitch struggles"],
      opportunities: ["Mentor young spinners"],
      threats: ["Form decline"],
    },
    image: getPlayerImage("axar-patel"),
  },
  {
    id: 15,
    name: "Axar Patel",
    team: "DC",
    swot: {
      strengths: ["Tight bowling", "Useful lower-order bat"],
      weaknesses: ["Lack of variations"],
      opportunities: ["Reliable all-round option"],
      threats: ["Limited opportunities"],
      image: getPlayerImage("axar-patel"),
    },
  },
];

// ------------------------------------------------
// 🧾  Role and nationality mappings
// ------------------------------------------------
const roleMap: Record<string, Player["role"]["primary"]> = {
  "Rohit Sharma": "batsman",
  "Virat Kohli": "batsman",
  "Suryakumar Yadav": "batsman",
  "Jasprit Bumrah": "bowler",
  "Hardik Pandya": "all-rounder",
  "Shubman Gill": "batsman",
  "Ravindra Jadeja": "all-rounder",
  "MS Dhoni": "wicket-keeper",
  "Ruturaj Gaikwad": "batsman",
  "KL Rahul": "batsman",
  "Rashid Khan": "bowler",
  "Sanju Samson": "wicket-keeper",
  "Mohammed Siraj": "bowler",
  "Yuzvendra Chahal": "bowler",
  "Axar Patel": "all-rounder",
};

const nationalityMap: Record<string, string> = {
  "Rashid Khan": "Afghanistan",
};

const positionFromRole = (r: Player["role"]["primary"]) =>
  r === "batsman"
    ? "Batsman"
    : r === "bowler"
    ? "Bowler"
    : r === "all-rounder"
    ? "All-Rounder"
    : "Wicket-Keeper";

// ------------------------------------------------
// ⚙️  Convert BasicPlayer → Player (Main Function)
// ------------------------------------------------
const toPlayer = (b: BasicPlayer): Player => {
  const primary = roleMap[b.name] ?? "batsman";

  const pick = (min: number, max: number) => {
    const span = max - min;
    const k = (b.id * 37 + 17) % 1000;
    return Math.round(min + (k / 999) * span);
  };

  const matches = pick(40, 120);
  let runs = 0,
    wickets = 0,
    strikeRate = 0,
    average = 0,
    economy = 0,
    catches = 0,
    fifties = 0,
    hundreds = 0,
    bestBowling = "1/10";

  if (primary === "batsman") {
    runs = pick(1200, 5500);
    wickets = pick(0, 10);
    strikeRate = pick(120, 165);
    average = pick(28, 52);
    economy = 0;
    catches = pick(8, 35);
    fifties = pick(8, 30);
    hundreds = pick(1, 8);
    bestBowling = `${pick(0, 2)}/${pick(8, 30)}`;
  } else if (primary === "bowler") {
    runs = pick(150, 900);
    wickets = pick(40, 140);
    strikeRate = pick(85, 120);
    average = pick(10, 22);
    economy = pick(6, 9);
    catches = pick(6, 28);
    fifties = pick(0, 5);
    hundreds = 0;
    bestBowling = `${pick(3, 6)}/${pick(8, 25)}`;
  } else if (primary === "all-rounder") {
    runs = pick(700, 3000);
    wickets = pick(25, 100);
    strikeRate = pick(115, 155);
    average = pick(22, 38);
    economy = pick(6.5, 8.8);
    catches = pick(8, 32);
    fifties = pick(3, 18);
    hundreds = pick(0, 4);
    bestBowling = `${pick(2, 5)}/${pick(10, 28)}`;
  } else {
    runs = pick(1000, 4500);
    wickets = 0;
    strikeRate = pick(120, 160);
    average = pick(25, 45);
    economy = 0;
    catches = pick(20, 70);
    fifties = pick(6, 24);
    hundreds = pick(0, 5);
    bestBowling = `0/${pick(10, 25)}`;
  }

  const last5 = Array.from({ length: 5 }, (_, i) => pick(20 + i * 2, 80 + i * 3));
  const trend = last5[last5.length - 1] > last5[0] ? "up" : "down";
  const recentPerformance = last5.reduce((a, b) => a + b, 0) / last5.length > 50 ? "good" : "average";

  const current = pick(30000000, 180000000);
  const predicted = pick(40000000, 220000000);
  const confidence = pick(60, 95);

  return {
    id: String(b.id),
    name: b.name,
    team: b.team,
    age: pick(22, 36),
    nationality: nationalityMap[b.name] ?? "India",
    position: positionFromRole(primary),
    stats: { matches, runs, wickets, strikeRate, average, economy, catches, fifties, hundreds, bestBowling },
    form: { last5Matches: last5, trend, recentPerformance },
    swot: b.swot,
    role: {
      primary,
      secondary: [],
      fitment: {
        powerHitter: pick(10, 90),
        anchor: pick(10, 90),
        finisher: pick(10, 90),
        deathBowler: pick(10, 90),
        impactSub: pick(10, 90),
      },
    },
    auctionValue: { current, predicted, confidence },
    image: getPlayerImage(b.name), // ✅ added image
    injuryRisk: ["low", "medium", "high"][pick(0, 2)] as Player["injuryRisk"],
    leadership: pick(3, 9),
  };
};

// ---------------------------------------------
// ✅ Export Final Mock Player Array
// ---------------------------------------------
export const mockPlayers: Player[] = BASIC.map(toPlayer);
