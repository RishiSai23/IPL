import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExploreFilters from "@/components/ExploreFilters";
import PlayersTable from "@/components/PlayersTable";
import { getAllCachedPlayers } from "@/api/footballApi";
import type { Player } from "@/types/player";

type RoleTab = "batters" | "bowlers";

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeRole, setActiveRole] = useState<RoleTab>("batters");
  const [team, setTeam] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllCachedPlayers()
      .then((data) => setPlayers(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      // Team filter
      if (team !== "all" && p.team !== team) return false;

      // Search filter
      if (!p.name.toLowerCase().includes(search.toLowerCase())) return false;

      // 🔥 ROLE FILTER (CORRECT)
      if (activeRole === "batters") {
        return p.role === "Batter";
      }

      return p.role === "Bowler";
    });
  }, [players, team, search, activeRole]);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* HERO */}
      <div className="py-14 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 rounded-b-3xl">
        <h1 className="text-5xl font-extrabold">🏏 Player Database</h1>
        <p className="mt-3 opacity-90">
          Explore domestic players before comparing them
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ROLE TABS */}
        <Tabs
          value={activeRole}
          onValueChange={(v) => setActiveRole(v as RoleTab)}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="batters">Batters</TabsTrigger>
            <TabsTrigger value="bowlers">Bowlers</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* FILTERS */}
        <ExploreFilters
          team={team}
          setTeam={setTeam}
          search={search}
          setSearch={setSearch}
          players={players}
        />

        {/* TABLE */}
        <PlayersTable
          players={filteredPlayers}
          role={activeRole}
          loading={loading}
        />
      </div>
    </div>
  );
}
