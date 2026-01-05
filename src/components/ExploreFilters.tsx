import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import type { Player } from "@/types/player";

interface Props {
  team: string;
  setTeam: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;

  minFinal: number;
  setMinFinal: (v: number) => void;
  minPressure: number;
  setMinPressure: (v: number) => void;
  minConsistency: number;
  setMinConsistency: (v: number) => void;
  minOpposition: number;
  setMinOpposition: (v: number) => void;

  players: Player[];
}

export default function ExploreFilters({
  team,
  setTeam,
  search,
  setSearch,
  minFinal,
  setMinFinal,
  minPressure,
  setMinPressure,
  minConsistency,
  setMinConsistency,
  minOpposition,
  setMinOpposition,
  players,
}: Props) {
  const teams = Array.from(new Set(players.map((p) => p.team)));

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6 space-y-5">
      {/* SEARCH + TEAM */}
      <div className="flex flex-wrap gap-4">
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

      {/* SLIDERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SliderBlock
          label="Final Score ≥"
          value={minFinal}
          onChange={setMinFinal}
        />
        <SliderBlock
          label="Pressure Score ≥"
          value={minPressure}
          onChange={setMinPressure}
        />
        <SliderBlock
          label="Consistency ≥"
          value={minConsistency}
          onChange={setMinConsistency}
        />
        <SliderBlock
          label="Opposition Quality ≥"
          value={minOpposition}
          onChange={setMinOpposition}
        />
      </div>
    </div>
  );
}

function SliderBlock({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1 opacity-80">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}
