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

// Your basic dataset (unchanged)
const BASIC: BasicPlayer[] = [
  {
    id: 1,
    name: "Rohit Sharma",
    team: "MI",
    swot: {
      strengths: [
        "Explosive opening batsman",
        "Calm under pressure",
        "Leadership experience",
      ],
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
      strengths: [
        "Fitness and consistency",
        "Aggressive leader",
        "High strike rate",
      ],
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
    },
  },
];

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
  "KL Rahul": "batsman", // sometimes wk; keep as batsman
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

const toPlayer = (b: BasicPlayer): Player => {
  const primary = roleMap[b.name] ?? "batsman";
  return {
    id: String(b.id),
    name: b.name,
    team: b.team,
    age: 28,
    nationality: nationalityMap[b.name] ?? "India",
    position: positionFromRole(primary),
    stats: {
      matches: 0,
      runs: 0,
      wickets: 0,
      strikeRate: 0,
      average: 0,
      economy: 0,
      catches: 0,
      fifties: 0,
      hundreds: 0,
      bestBowling: "0/0",
    },
    form: {
      last5Matches: [0, 0, 0, 0, 0],
      trend: "stable",
      recentPerformance: "average",
    },
    swot: b.swot,
    role: {
      primary,
      secondary: [],
      fitment: {
        powerHitter: 0,
        anchor: 0,
        finisher: 0,
        deathBowler: 0,
        impactSub: 0,
      },
    },
    auctionValue: {
      current: 0,
      predicted: 0,
      confidence: 0,
    },
    image: undefined,
    injuryRisk: "medium",
    leadership: 5,
  };
};

export const mockPlayers: Player[] = BASIC.map(toPlayer);
