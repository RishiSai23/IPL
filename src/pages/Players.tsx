import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExploreFilters from "@/components/ExploreFilters";
import PlayersTable from "@/components/PlayersTable";
import { getAllCachedPlayers } from "@/api/footballApi";
import type { Player } from "@/types/player";
import { useNavigate } from "react-router-dom";

type RoleTab = "batters" | "bowlers";

export default function Players() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeRole, setActiveRole] = useState<RoleTab>("batters");
  const [team, setTeam] = useState("all");
  const [search, setSearch] = useState("");

  const [minFinal, setMinFinal] = useState(0);
  const [minPressure, setMinPressure] = useState(0);
  const [minConsistency, setMinConsistency] = useState(0);
  const [minOpposition, setMinOpposition] = useState(0);

  const [selected, setSelected] = useState<Player[]>([]);
  const navigate = useNavigate();

  // --------------------------------------------------
  // FETCH PLAYERS (ONCE)
  // --------------------------------------------------
  useEffect(() => {
    setLoading(true);
    getAllCachedPlayers()
      .then((data) => setPlayers(data))
      .finally(() => setLoading(false));
  }, []);

  // --------------------------------------------------
  // RESET SELECTION WHEN ROLE CHANGES
  // --------------------------------------------------
  useEffect(() => {
    setSelected([]);
  }, [activeRole]);

  // --------------------------------------------------
  // AUTO-REDIRECT WHEN 2 PLAYERS SELECTED
  // --------------------------------------------------
  useEffect(() => {
    if (selected.length === 2) {
      navigate(
        `/comparison?mode=${activeRole}&player1=${encodeURIComponent(
          selected[0].name
        )}&player2=${encodeURIComponent(selected[1].name)}`
      );
    }
  }, [selected, activeRole, navigate]);

  // --------------------------------------------------
  // FILTERED VIEW
  // --------------------------------------------------
  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      if (team !== "all" && p.team !== team) return false;
      if (!p.name.toLowerCase().includes(search.toLowerCase())) return false;

      if (activeRole === "batters" && p.role !== "Batter") return false;
      if (activeRole === "bowlers" && p.role !== "Bowler") return false;

      const s = p.stats;
      if (!s) return false;

      if (s.finalScore < minFinal) return false;
      if (s.pressureScore < minPressure) return false;
      if (s.consistencyScore < minConsistency) return false;
      if (s.oppositionQualityScore < minOpposition) return false;

      return true;
    });
  }, [
    players,
    team,
    search,
    activeRole,
    minFinal,
    minPressure,
    minConsistency,
    minOpposition,
  ]);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="py-14 text-center border-b border-slate-800">
        <h1 className="text-4xl font-semibold">Player Database</h1>
        <p className="mt-2 text-gray-400">
          Shortlist domestic players before comparison
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
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

        <ExploreFilters
          team={team}
          setTeam={setTeam}
          search={search}
          setSearch={setSearch}
          minFinal={minFinal}
          setMinFinal={setMinFinal}
          minPressure={minPressure}
          setMinPressure={setMinPressure}
          minConsistency={minConsistency}
          setMinConsistency={setMinConsistency}
          minOpposition={minOpposition}
          setMinOpposition={setMinOpposition}
          players={players}
        />

        <PlayersTable
          players={filteredPlayers}
          role={activeRole}
          loading={loading}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}
