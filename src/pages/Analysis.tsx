import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockPlayers } from "@/data/mockPlayers";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

export default function Analysis() {
  const [selectedPlayer, setSelectedPlayer] = useState(mockPlayers[0]);
  const [search, setSearch] = useState("");

  const filteredPlayers = useMemo(() => {
    return mockPlayers.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const swotSections = [
    { key: "strengths", title: "Strengths", data: selectedPlayer?.swot?.strengths || [] },
    { key: "weaknesses", title: "Weaknesses", data: selectedPlayer?.swot?.weaknesses || [] },
    { key: "opportunities", title: "Opportunities", data: selectedPlayer?.swot?.opportunities || [] },
    { key: "threats", title: "Threats", data: selectedPlayer?.swot?.threats || [] },
  ];

  const chartData = [
    { category: "Strengths", value: selectedPlayer?.swot?.strengths?.length || 0 },
    { category: "Weaknesses", value: selectedPlayer?.swot?.weaknesses?.length || 0 },
    { category: "Opportunities", value: selectedPlayer?.swot?.opportunities?.length || 0 },
    { category: "Threats", value: selectedPlayer?.swot?.threats?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <Navigation />
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Player SWOT Analysis Dashboard</h1>

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
            value={String(selectedPlayer?.id)}
            onChange={(e) => {
              const player = mockPlayers.find((p) => String(p.id) === e.target.value);
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
        <div className="glass-card p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">SWOT Overview Chart</h2>
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

        {/* SWOT Cards */}
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
                  <CardTitle className="text-white">{section.title}</CardTitle>
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
                      <li className="text-gray-500 italic">No data available</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
