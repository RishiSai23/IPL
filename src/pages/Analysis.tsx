import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllCachedPlayers } from "@/api/footballApi";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import type { Player } from "@/types/player";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export default function Analysis() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAllCachedPlayers()
      .then((data) => {
        // Convert football players to cricket players for compatibility
        const cricketPlayers: Player[] = data.map((fp: any) => ({
          id: fp.id,
          name: fp.name,
          team: fp.club || "Unknown",
          age: fp.age || 25,
          nationality: fp.nationality || "Unknown",
          position: fp.position || "Player",
          stats: {
            matches: fp.stats?.matches || 0,
            runs: fp.stats?.goals || 0, // Using goals as runs for compatibility
            wickets: fp.stats?.assists || 0, // Using assists as wickets
            strikeRate: fp.stats?.speed || 0,
            average: fp.stats?.accuracy || 0,
            economy: fp.stats?.stamina || 0,
            catches: 0,
            fifties: 0,
            hundreds: 0,
            bestBowling: "0/0",
          },
          form: {
            last5Matches: [0, 0, 0, 0, 0],
            trend: "up" as const,
            recentPerformance: "good" as const,
          },
          swot: {
            strengths: [],
            weaknesses: [],
            opportunities: [],
            threats: [],
          },
          role: {
            primary: "batsman" as const,
            secondary: [],
            fitment: {
              powerHitter: 50,
              anchor: 50,
              finisher: 50,
              deathBowler: 50,
              impactSub: 50,
            },
          },
          auctionValue: {
            current: fp.marketValue?.predicted || 0,
            predicted: fp.marketValue?.predicted || 0,
            confidence: 80,
          },
          image: fp.photoUrl,
          injuryRisk: "low" as const,
          leadership: fp.leadership || 5,
        }));
        setPlayers(cricketPlayers);
        if (cricketPlayers.length > 0) {
          setSelectedPlayer(cricketPlayers[0]);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch players:", error);
        setPlayers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [players, search]);

  const swotSections = [
    {
      key: "strengths",
      title: "Strengths",
      data: selectedPlayer?.swot?.strengths || [],
    },
    {
      key: "weaknesses",
      title: "Weaknesses",
      data: selectedPlayer?.swot?.weaknesses || [],
    },
    {
      key: "opportunities",
      title: "Opportunities",
      data: selectedPlayer?.swot?.opportunities || [],
    },
    {
      key: "threats",
      title: "Threats",
      data: selectedPlayer?.swot?.threats || [],
    },
  ];

  const chartData = [
    {
      category: "Strengths",
      value: selectedPlayer?.swot?.strengths?.length || 0,
    },
    {
      category: "Weaknesses",
      value: selectedPlayer?.swot?.weaknesses?.length || 0,
    },
    {
      category: "Opportunities",
      value: selectedPlayer?.swot?.opportunities?.length || 0,
    },
    { category: "Threats", value: selectedPlayer?.swot?.threats?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <Navigation />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Player SWOT Analysis Dashboard
        </h1>

        {/* Player Search */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search player by name..."
            className="w-full sm:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full sm:w-64 border border-gray-300 rounded-lg p-2 bg-white"
            value={String(selectedPlayer?.id || "")}
            onChange={(e) => {
              const player = players.find(
                (p) => String(p.id) === e.target.value
              );
              if (player) setSelectedPlayer(player);
            }}
          >
            {filteredPlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.team})
              </option>
            ))}
          </select>
        </div>

        {/* Radar Chart */}
        {loading ? (
          <div className="glass-card p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              SWOT Overview Chart
            </h2>
            <div className="text-center py-20">
              <div className="text-lg text-muted-foreground">
                Loading players...
              </div>
            </div>
          </div>
        ) : selectedPlayer ? (
          <div className="glass-card p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              SWOT Overview Chart
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar
                  name="SWOT"
                  dataKey="value"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="glass-card p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              SWOT Overview Chart
            </h2>
            <div className="text-center py-20">
              <div className="text-lg text-muted-foreground">
                No players available
              </div>
            </div>
          </div>
        )}

        {/* SWOT Cards */}
        {selectedPlayer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {swotSections.map((section, index) => (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card shadow-md border border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                      {section.data.length > 0 ? (
                        section.data.map((point: string, idx: number) => (
                          <li key={idx} className="text-gray-300">
                            {point}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">
                          No data available
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
