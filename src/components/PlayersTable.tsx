import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Player } from "@/types/player";

type SortKey =
  | "finalScore"
  | "pressureScore"
  | "consistencyScore"
  | "oppositionQualityScore"
  | "runs";

interface Props {
  players: Player[];
  role: "batters" | "bowlers";
  loading: boolean;
}

export default function PlayersTable({ players, role, loading }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("finalScore");
  const [asc, setAsc] = useState(false);
  const navigate = useNavigate();

  const sorted = [...players].sort((a, b) => {
    const aVal = a.stats?.[sortKey as keyof typeof a.stats] ?? 0;
    const bVal = b.stats?.[sortKey as keyof typeof b.stats] ?? 0;
    return asc ? aVal - bVal : bVal - aVal;
  });

  if (loading) {
    return <div className="text-center py-12 opacity-60">Loading players…</div>;
  }

  const Sortable = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      className="cursor-pointer"
      onClick={() => {
        setSortKey(k);
        setAsc(k === sortKey ? !asc : false);
      }}
    >
      {label} <ArrowUpDown className="inline w-4 h-4 ml-1" />
    </th>
  );

  return (
    <div className="overflow-x-auto border border-slate-800 rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-3 text-left">Player</th>
            <th>Team</th>

            {role === "batters" && (
              <>
                <Sortable k="runs" label="Runs" />
                <th>Matches</th>
                <th>SR</th>
              </>
            )}

            <Sortable k="finalScore" label="Final" />
            <Sortable k="pressureScore" label="Pressure" />
            <Sortable k="consistencyScore" label="Consistency" />
            <Sortable k="oppositionQualityScore" label="Opposition" />
          </tr>
        </thead>

        <tbody>
          {sorted.map((p) => (
            <tr
              key={p.name}
              className="border-t border-slate-800 hover:bg-slate-900 cursor-pointer"
              onClick={() =>
                navigate(`/compare?player1=${encodeURIComponent(p.name)}`)
              }
            >
              <td className="px-4 py-3 font-medium">{p.name}</td>
              <td>{p.team}</td>

              {role === "batters" && (
                <>
                  <td>{p.stats?.runs ?? "-"}</td>
                  <td>{p.stats?.matches ?? "-"}</td>
                  <td>{p.stats?.strikeRate?.toFixed(1) ?? "-"}</td>
                </>
              )}

              <td className="font-semibold">{p.stats?.finalScore ?? "-"}</td>
              <td>{p.stats?.pressureScore ?? "-"}</td>
              <td>{p.stats?.consistencyScore ?? "-"}</td>
              <td>{p.stats?.oppositionQualityScore ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
