import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Player } from "@/types/player";

interface Props {
  players: Player[];
  role: "batters" | "bowlers";
  loading: boolean;
}

export default function PlayersTable({ players, role, loading }: Props) {
  const [sortKey, setSortKey] = useState<"finalScore">("finalScore");
  const [asc, setAsc] = useState(false);
  const navigate = useNavigate();

  const sorted = [...players].sort((a, b) => {
    const aVal = a.stats?.[sortKey] ?? 0;
    const bVal = b.stats?.[sortKey] ?? 0;
    return asc ? aVal - bVal : bVal - aVal;
  });

  if (loading) {
    return <div className="text-center py-12 opacity-60">Loading players…</div>;
  }

  return (
    <div className="overflow-x-auto border border-slate-800 rounded-xl">
      <table className="w-full text-sm">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-4 py-3 text-left">Player</th>
            <th>Team</th>

            {role === "batters" && (
              <>
                <th>Matches</th>
                <th>Runs</th>
                <th>Strike Rate</th>
              </>
            )}

            <th
              className="cursor-pointer"
              onClick={() => {
                setSortKey("finalScore");
                setAsc(!asc);
              }}
            >
              Final <ArrowUpDown className="inline w-4 h-4 ml-1" />
            </th>

            <th>Pressure</th>
            <th>Consistency</th>
            <th>Opposition</th>
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
                  <td>{p.stats?.matches ?? "-"}</td>
                  <td>{p.stats?.runs ?? "-"}</td>
                  <td>{p.stats?.strikeRate ?? "-"}</td>
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
