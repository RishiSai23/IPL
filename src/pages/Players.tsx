// file: src/pages/Players.tsx
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
import { getAllCachedPlayers } from "@/api/footballApi";
import { motion } from "framer-motion";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useState, useEffect } from "react";
import type { Player } from "@/types/player";

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
      })
      .catch((error) => {
        console.error("Failed to fetch players:", error);
        setPlayers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const teams = Array.from(new Set(players.map((p) => p.team))).sort();
  const positions = Array.from(new Set(players.map((p) => p.position))).sort();

  const filteredPlayers = players
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

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <Navigation />

      {/* Hero Section */}
      <div className="relative text-center py-14 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-white shadow-lg rounded-b-3xl">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          🏏 IPL Player Database
        </h1>
        <p className="mt-3 text-lg opacity-90">
          Stats, insights & auction predictions in one place
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <Card className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-bold">{players.length}</h3>
            <p className="text-sm opacity-80">Total Players</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-bold">
              {players.reduce((sum, p) => sum + (p.stats?.runs || 0), 0)}
            </h3>
            <p className="text-sm opacity-80">Total Runs</p>
          </Card>
          <Card className="bg-white/10 backdrop-blur-xl px-6 py-4 rounded-xl text-white shadow-lg">
            <h3 className="text-xl font-bold">
              {players.reduce((sum, p) => sum + (p.stats?.wickets || 0), 0)}
            </h3>
            <p className="text-sm opacity-80">Total Wickets</p>
          </Card>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <motion.div
          className="sticky top-6 z-30 glass-card shadow-lg rounded-xl p-6 mb-10 flex flex-wrap gap-4 items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative flex-1 min-w-[200px]">
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="runs">Runs</SelectItem>
              <SelectItem value="wickets">Wickets</SelectItem>
              <SelectItem value="auctionValue">Auction Value</SelectItem>
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
        {loading ? (
          <div className="text-center py-20">
            <div className="text-lg text-muted-foreground">
              Loading players...
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Players;
