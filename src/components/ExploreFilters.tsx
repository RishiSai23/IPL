// src/components/ExploreFilters.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import type { Player } from "@/types/player";

interface Props {
  team: string;
  setTeam: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  players: Player[];
}

export default function ExploreFilters({
  team,
  setTeam,
  search,
  setSearch,
  players,
}: Props) {
  const teams = Array.from(new Set(players.map((p) => p.team)));

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-wrap gap-4 items-center mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-3 w-4 h-4 opacity-60" />
        <Input
          placeholder="Search player"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select value={team} onValueChange={setTeam}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Team" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Teams</SelectItem>
          {teams.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
