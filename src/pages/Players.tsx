// file: src/pages/Players.tsx
import { useState } from "react";
import Navigation from "@/components/Navigation";
import PlayerCard from "@/components/PlayerCard";
import { mockPlayers } from "@/data/mockPlayers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Users, SortAsc, SortDesc } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const teams = Array.from(new Set(mockPlayers.map((p) => p.team))).sort();
  const positions = Array.from(new Set(mockPlayers.map((p) => p.position))).sort();

  const filteredPlayers = mockPlayers
    .filter((player) => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTeam = selectedTeam === "all" || player.team === selectedTeam;
      const matchesPosition = selectedPosition === "all" || player.position === selectedPosition;
      return matchesSearch && matchesTeam && matchesPosition;
    })
    .sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case "age":
          aValue = a.age;
          bValue = b.age;
          break;
        case "auctionValue":
          aValue = a.auctionValue.predicted;
          bValue = b.auctionValue.predicted;
          break;
        case "runs":
          aValue = a.stats.runs;
          bValue = b.stats.runs;
          break;
        case "wickets":
          aValue = a.stats.wickets;
          bValue = b.stats.wickets;
          break;
        case "name":
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

  const toggleSortOrder = () => setSortOrder((p) => (p === "asc" ? "desc" : "asc"));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <span>Player Database</span>
          </h1>
          <p className="text-muted-foreground">Comprehensive analysis of IPL players with advanced metrics and insights</p>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Team Filter */}
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="All Teams" />
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

              {/* Position Filter */}
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                  <SelectItem value="auctionValue">Auction Value</SelectItem>
                  <SelectItem value="runs">Runs</SelectItem>
                  <SelectItem value="wickets">Wickets</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Button variant="outline" onClick={toggleSortOrder} className="flex items-center space-x-2">
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredPlayers.length} of {mockPlayers.length} players
          </p>

          {(searchTerm || selectedTeam !== "all" || selectedPosition !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedTeam("all");
                setSelectedPosition("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Players Grid */}
        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} onClick={() => console.log(`View ${player.name} details`)} />
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No players found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                Try adjusting your search terms or filters to find the players you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Players;