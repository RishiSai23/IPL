import { useEffect, useMemo, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExploreFilters from "@/components/ExploreFilters";
import PlayersTable from "@/components/PlayersTable";
import CompareSection from "@/components/compare/CompareSection";
import { getAllCachedPlayers } from "@/api/footballApi";
import type { Player } from "@/types/player";

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
  const compareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    getAllCachedPlayers()
      .then((data) => setPlayers(data))
      .finally(() => setLoading(false));
  }, []);

  // Reset selection when switching roles
  useEffect(() => {
    setSelected([]);
  }, [activeRole]);

  // Auto-scroll to comparison
  useEffect(() => {
    if (selected.length === 2 && compareRef.current) {
      compareRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selected]);

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

  return (
    <div className="bg-black min-h-screen text-white">
      {/* HEADER */}
      <div className="py-14 text-center border-b border-slate-800">
        <h1 className="text-4xl font-semibold">Player Database</h1>
        <p className="mt-2 text-gray-400">
          Shortlist domestic players, then deep-dive into comparison
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* ROLE TABS */}
        <Tabs
          value={activeRole}
          onValueChange={(v) => setActiveRole(v as RoleTab)}
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

        {/* TABLE */}
        <PlayersTable
          players={filteredPlayers}
          role={activeRole}
          loading={loading}
          selected={selected}
          setSelected={setSelected}
        />

        {/* MANUAL CONTROL + COMPARE */}
        {selected.length === 2 && (
          <div
            ref={compareRef}
            className="pt-20 mt-20 border-t border-slate-800 space-y-6"
          >
            {/* MANUAL REPLACE CONTROLS */}
            <div className="flex justify-between items-center text-sm text-gray-400">
              <div>
                Comparing:
                <span className="ml-2 text-teal-400">
                  {selected[0].name}
                </span>
                {" vs "}
                <span className="text-teal-400">
                  {selected[1].name}
                </span>
              </div>

              <button
                onClick={() => setSelected([])}
                className="hover:text-red-400 transition"
              >
                Reset comparison
              </button>
            </div>

            <CompareSection
              player1={selected[0]}
              player2={selected[1]}
              mode={activeRole === "batters" ? "batting" : "bowling"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
