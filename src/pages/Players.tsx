import Navigation from "@/components/Navigation";
import PlayerCard from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPlayers } from "@/data/mockPlayers";
import { motion } from "framer-motion";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useState } from "react";

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const teams = Array.from(new Set(mockPlayers.map((p) => p.team))).sort();
  const positions = Array.from(
    new Set(mockPlayers.map((p) => p.position))
  ).sort();

  const filteredPlayers = mockPlayers
    .filter((player) => {
      const matchesSearch = player.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTeam =
        selectedTeam === "all" || player.team === selectedTeam;
      const matchesPosition =
        selectedPosition === "all" || player.position === selectedPosition;
      return matchesSearch && matchesTeam && matchesPosition;
    })
    .sort((a, b) => {
      let aValue: string | number = a.name;
      let bValue: string | number = b.name;
      if (sortBy === "age") {
        aValue = a.age;
        bValue = b.age;
      }
      if (sortBy === "auctionValue") {
        aValue = a.auctionValue.predicted;
        bValue = b.auctionValue.predicted;
      }
      if (sortBy === "runs") {
        aValue = a.stats.runs;
        bValue = b.stats.runs;
      }
      if (sortBy === "wickets") {
        aValue = a.stats.wickets;
        bValue = b.stats.wickets;
      }
      return sortOrder === "asc"
        ? (aValue as any) - (bValue as any)
        : (bValue as any) - (aValue as any);
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Navigation />

      {/* Hero Section */}
      <div className="relative text-center py-14 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white shadow-lg rounded-b-3xl">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          🏏 IPL Player Database
        </h1>
        <p className="mt-3 text-lg opacity-90">
          Stats, insights & auction predictions in one place
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <Card className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-bold">{mockPlayers.length}</h3>
            <p className="text-sm opacity-80">Total Players</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-bold">
              {mockPlayers.reduce((sum, p) => sum + (p.stats?.runs || 0), 0)}
            </h3>
            <p className="text-sm opacity-80">Total Runs</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-bold">
              {mockPlayers.reduce((sum, p) => sum + (p.stats?.wickets || 0), 0)}
            </h3>
            <p className="text-sm opacity-80">Total Wickets</p>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <motion.div
          className="sticky top-6 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg rounded-xl p-6 mb-10 flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Positions</SelectItem>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? <SortAsc /> : <SortDesc />}
            {sortOrder === "asc" ? " Ascending" : " Descending"}
          </Button>
        </motion.div>

        {/* Player Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredPlayers.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <PlayerCard player={player} title="Player" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Players;
