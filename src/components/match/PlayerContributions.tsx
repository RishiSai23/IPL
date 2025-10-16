import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type PlayerContribution = {
  id: string;
  name: string;
  role: "Batsman" | "Bowler" | "All-Rounder" | "Wicket-Keeper";
  batting?: {
    position?: string;
    roleInMatch?: string;
    runs?: number | "";
    balls?: number | "";
    fours?: number | "";
    sixes?: number | "";
    notOut?: boolean;
  };
  bowling?: {
    overs?: number | "";
    runsConceded?: number | "";
    wickets?: number | "";
    maidens?: number | "";
    wides?: number | "";
    noBalls?: number | "";
    ppOvers?: number | "";
    middleOvers?: number | "";
    deathOvers?: number | "";
  };
  fielding?: {
    catches?: number | "";
    stumpings?: number | "";
    runOuts?: number | "";
  };
};

interface Props {
  value: PlayerContribution[];
  onChange: (players: PlayerContribution[]) => void;
}

export default function PlayerContributions({ value, onChange }: Props) {
  const addPlayer = () => {
    onChange([
      ...value,
      {
        id: crypto.randomUUID(),
        name: "",
        role: "Batsman",
        batting: {},
        bowling: {},
        fielding: {},
      },
    ]);
  };

  const removePlayer = (id: string) => {
    onChange(value.filter((p) => p.id !== id));
  };

  const updatePlayer = (id: string, updated: Partial<PlayerContribution>) => {
    onChange(value.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Player Contributions</h2>
        <Button onClick={addPlayer} className="bg-orange-500 hover:bg-orange-600">
          Add Player
        </Button>
      </div>

      {value.map((player, index) => (
        <div key={player.id} className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Player {index + 1}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removePlayer(player.id)}
            >
              Remove
            </Button>
          </div>

          {/* Player Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="e.g., Rahul Sharma"
              value={player.name}
              onChange={(e) => updatePlayer(player.id, { name: e.target.value })}
            />

            <Select
              value={player.role}
              onValueChange={(val) => updatePlayer(player.id, { role: val as PlayerContribution["role"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Batsman">Batsman</SelectItem>
                <SelectItem value="Bowler">Bowler</SelectItem>
                <SelectItem value="All-Rounder">All-Rounder</SelectItem>
                <SelectItem value="Wicket-Keeper">Wicket-Keeper</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional Rendering based on role */}
          {(player.role === "Batsman" ||
            player.role === "All-Rounder" ||
            player.role === "Wicket-Keeper") && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Batting</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Position"
                  value={player.batting?.position ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      batting: { ...player.batting, position: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="Role in Match"
                  value={player.batting?.roleInMatch ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      batting: { ...player.batting, roleInMatch: e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Runs"
                  value={player.batting?.runs ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      batting: { ...player.batting, runs: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Balls"
                  value={player.batting?.balls ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      batting: { ...player.batting, balls: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="4s"
                  value={player.batting?.fours ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      batting: { ...player.batting, fours: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="6s"
                  value={player.batting?.sixes ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      batting: { ...player.batting, sixes: +e.target.value },
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={player.batting?.notOut ?? false}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      batting: { ...player.batting, notOut: e.target.checked },
                    })
                  }
                />
                <span className="text-sm text-gray-600">Not Out</span>
              </div>
            </div>
          )}

          {(player.role === "Bowler" || player.role === "All-Rounder") && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Bowling</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Overs"
                  value={player.bowling?.overs ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, overs: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Runs Conceded"
                  value={player.bowling?.runsConceded ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, runsConceded: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Wickets"
                  value={player.bowling?.wickets ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, wickets: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Maidens"
                  value={player.bowling?.maidens ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, maidens: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Wides"
                  value={player.bowling?.wides ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, wides: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="No Balls"
                  value={player.bowling?.noBalls ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, noBalls: +e.target.value },
                    })
                  }
                />
                {/* NEW FIELD: Middle Overs */}
                <Input
                  type="number"
                  placeholder="PP Overs"
                  value={player.bowling?.ppOvers ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, ppOvers: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Middle Overs"
                  value={player.bowling?.middleOvers ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, middleOvers: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Death Overs"
                  value={player.bowling?.deathOvers ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      bowling: { ...player.bowling, deathOvers: +e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}

          {(player.role === "Wicket-Keeper" || player.role === "All-Rounder") && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Fielding</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  placeholder="Catches"
                  value={player.fielding?.catches ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      fielding: { ...player.fielding, catches: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Stumpings"
                  value={player.fielding?.stumpings ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      fielding: { ...player.fielding, stumpings: +e.target.value },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Run Outs"
                  value={player.fielding?.runOuts ?? ""}
                  onChange={(e) =>
                    updatePlayer(player.id, {
                      fielding: { ...player.fielding, runOuts: +e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
