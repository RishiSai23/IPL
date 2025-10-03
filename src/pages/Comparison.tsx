// src/pages/ComparePlayers.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
const player1 = {
  name: "Virat Kohli",
  team: "India",
  role: "Batsman",
  career: "2008 - Present",
  stats: {
    matches: 254,
    runs: 12040,
    average: 59.3,
    strikeRate: 93.2,
    wickets: 4,
    highestScore: 183,
    bestBowling: "1/15",
  },
  photo: "https://via.placeholder.com/",
};

const player2 = {
  name: "Steve Smith",
  team: "Australia",
  role: "Batsman",
  career: "2010 - Present",
  stats: {
    matches: 150,
    runs: 7540,
    average: 61.2,
    strikeRate: 88.4,
    wickets: 0,
    highestScore: 164,
    bestBowling: "0/0",
  },
  photo: "https://via.placeholder.com/100",
};

const statRows = [
  { label: "Matches", key: "matches" as const },
  { label: "Runs", key: "runs" as const },
  { label: "Average", key: "average" as const },
  { label: "Strike Rate", key: "strikeRate" as const },
  { label: "Wickets", key: "wickets" as const },
];

const Comparison: React.FC = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        {/* Header */}
        <header className="flex justify-center items-center mb-8">
          <nav className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Home
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
              Players
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
              Stats
            </button>
          </nav>
        </header>

        {/* Player Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[player1, player2].map((player) => (
            <Card key={player.name} className="p-6 hover:shadow-lg transition">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="w-24 h-24 rounded-full border-2 border-gray-200"
                  />
                  <div>
                    <CardTitle className="text-xl font-semibold">
                      {player.name}
                    </CardTitle>
                    <p className="text-gray-500">{player.team}</p>
                    <p className="text-gray-500">{player.role}</p>
                    <p className="text-gray-500">Career: {player.career}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Stats Comparison Table */}
        <Card className="mb-8 p-6">
          <CardHeader>
            <CardTitle>Performance Stats Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2">Stat</th>
                  <th className="px-4 py-2">{player1.name}</th>
                  <th className="px-4 py-2">{player2.name}</th>
                </tr>
              </thead>
              <tbody>
                {statRows.map((row) => (
                  <tr key={row.key} className="border-b">
                    <td className="px-4 py-2 font-medium">{row.label}</td>
                    <td className="px-4 py-2">
                      <div className="relative w-full bg-gray-200 h-3 rounded">
                        <div
                          className="absolute h-3 bg-blue-600 rounded"
                          style={{
                            width: `${Math.min(
                              (player1.stats[row.key] / 20000) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700 mt-1 block">
                        {player1.stats[row.key]}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative w-full bg-gray-200 h-3 rounded">
                        <div
                          className="absolute h-3 bg-red-500 rounded"
                          style={{
                            width: `${Math.min(
                              (player2.stats[row.key] / 20000) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700 mt-1 block">
                        {player2.stats[row.key]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Tabs for Highlights */}
        <Tabs defaultValue="highlights" className="space-y-4">
          <TabsList className="mb-4">
            <TabsTrigger value="highlights">Highlights</TabsTrigger>
            <TabsTrigger value="batting">Batting</TabsTrigger>
            <TabsTrigger value="bowling">Bowling</TabsTrigger>
          </TabsList>

          <TabsContent value="highlights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[player1, player2].map((player) => (
                <Card key={player.name} className="p-4">
                  <CardTitle className="mb-2">
                    {player.name} Highlights
                  </CardTitle>
                  <CardContent>
                    <p className="text-gray-700">
                      <span className="font-semibold">Highest Score:</span>{" "}
                      {player.stats.highestScore}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Best Bowling:</span>{" "}
                      {player.stats.bestBowling}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="batting">
            <p className="text-gray-700">Static batting stats content...</p>
          </TabsContent>

          <TabsContent value="bowling">
            <p className="text-gray-700">Static bowling stats content...</p>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Comparison;
