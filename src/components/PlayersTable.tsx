import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
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
  selected: Player[];
  setSelected: (p: Player[]) => void;
}

export default function PlayersTable({
  players,
  role,
  loading,
  selected,
  setSelected,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("finalScore");
  const [asc, setAsc] = useState(false);

  const sorted = [...players].sort((a, b) => {
    const aVal = a.stats?.[sortKey as keyof typeof a.stats] ?? 0;
    const bVal = b.stats?.[sortKey as keyof typeof b.stats] ?? 0;
    return asc ? aVal - bVal : bVal - aVal;
  });

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading players…
      </div>
    );
  }

  const toggleSelect = (player: Player) => {
    const exists = selected.find((p) => p.name === player.name);

    if (exists) {
      setSelected(selected.filter((p) => p.name !== player.name));
    } else if (selected.length < 2) {
      setSelected([...selected, player]);
    }
  };

  const Sortable = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      onClick={() => {
        setSortKey(k);
        setAsc(k === sortKey ? !asc : false);
      }}
      className="px-3 py-3 text-right cursor-pointer text-xs font-medium tracking-wide text-gray-400 hover:text-white"
    >
      {label}
      <ArrowUpDown className="inline w-3 h-3 ml-1 opacity-60" />
    </th>
  );

  return (
    <div className="overflow-x-auto border border-slate-800 rounded-xl">
      <table className="w-full table-fixed text-sm">
        {/* COLUMN WIDTH CONTROL */}
        <colgroup>
          <col className="w-[28%]" />
          <col className="w-[14%]" />

          {role === "batters" && (
            <>
              <col className="w-[8%]" />
              <col className="w-[8%]" />
              <col className="w-[8%]" />
            </>
          )}

          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
          <col className="w-[12%]" />
        </colgroup>

        {/* HEADER */}
        <thead className="bg-slate-900 border-b border-slate-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs text-gray-400">
              Player
            </th>
            <th className="px-3 py-3 text-left text-xs text-gray-400">
              Team
            </th>

            {role === "batters" && (
              <>
                <Sortable k="runs" label="Runs" />
                <th className="px-3 py-3 text-right text-xs text-gray-400">
                  Matches
                </th>
                <th className="px-3 py-3 text-right text-xs text-gray-400">
                  SR
                </th>
              </>
            )}

            <Sortable k="finalScore" label="Final" />
            <Sortable k="pressureScore" label="Pressure" />
            <Sortable k="consistencyScore" label="Consistency" />
            <Sortable k="oppositionQualityScore" label="Opposition" />
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {sorted.map((p) => {
            const isSelected = selected.some((s) => s.name === p.name);

            return (
              <tr
                key={p.name}
                onClick={() => toggleSelect(p)}
                className={`border-t border-slate-800 cursor-pointer transition
                  ${
                    isSelected
                      ? "bg-teal-500/10"
                      : "hover:bg-slate-900"
                  }`}
              >
                <td className="px-4 py-3 text-left font-medium text-gray-200 truncate">
                  {p.name}
                </td>

                <td className="px-3 py-3 text-left text-gray-400">
                  {p.team}
                </td>

                {role === "batters" && (
                  <>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {p.stats?.runs ?? "-"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {p.stats?.matches ?? "-"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {p.stats?.strikeRate?.toFixed(1) ?? "-"}
                    </td>
                  </>
                )}

                <td className="px-3 py-3 text-right font-semibold tabular-nums">
                  {p.stats?.finalScore ?? "-"}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {p.stats?.pressureScore ?? "-"}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {p.stats?.consistencyScore ?? "-"}
                </td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {p.stats?.oppositionQualityScore ?? "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
