// file: src/components/match/PlayerContributions.tsx
import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, UserPlus } from "lucide-react";

export type PlayerPrimaryRole = "batter" | "bowler" | "all-rounder" | "wicket-keeper";
export type BatRole = "opener" | "middle" | "finisher";

export type BattingEntry = {
  battingPosition?: number | "";
  roleInMatch?: BatRole;
  runs?: number | "";
  balls?: number | "";
  fours?: number | "";
  sixes?: number | "";
  notOut?: boolean;
  finisherFlag?: boolean;
};

export type BowlingEntry = {
  overs?: number | "";
  runsConceded?: number | "";
  wickets?: number | "";
  maidens?: number | "";
  wides?: number | "";
  noBalls?: number | "";
  oversInPowerplay?: number | "";
  oversInDeath?: number | "";
};

export type FieldingEntry = {
  catches?: number | "";
  runouts?: number | "";
  stumpings?: number | "";
  drops?: number | "";
  boundarySaves?: number | "";
};

export type PlayerContribution = {
  id: string;
  name: string;
  team?: string;
  primaryRole?: PlayerPrimaryRole;
  batting?: BattingEntry;
  bowling?: BowlingEntry;
  fielding?: FieldingEntry;
};

function safeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID();
  }
  return `p_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

type Props = {
  value: PlayerContribution[];
  onChange: (next: PlayerContribution[]) => void;
};

export default function PlayerContributions({ value, onChange }: Props) {
  const players = value;

  const addPlayer = () => {
    const next: PlayerContribution = {
      id: safeId(),
      name: "",
      primaryRole: "batter",
      batting: {
        battingPosition: "",
        roleInMatch: "middle",
        runs: "",
        balls: "",
        fours: "",
        sixes: "",
        notOut: false,
        finisherFlag: false,
      },
      bowling: {
        overs: "",
        runsConceded: "",
        wickets: "",
        maidens: "",
        wides: "",
        noBalls: "",
        oversInPowerplay: "",
        oversInDeath: "",
      },
      fielding: { catches: "", runouts: "", stumpings: "", drops: "", boundarySaves: "" },
    };
    onChange([...(players || []), next]);
  };

  const removePlayer = (id: string) => {
    onChange(players.filter((p) => p.id !== id));
  };

  const updatePlayer = <K extends keyof PlayerContribution>(
    id: string,
    key: K,
    val: PlayerContribution[K]
  ) => {
    onChange(players.map((p) => (p.id === id ? { ...p, [key]: val } : p)));
  };

  const updateNested = <
    K extends "batting" | "bowling" | "fielding",
    T extends NonNullable<PlayerContribution[K]>
  >(
    id: string,
    key: K,
    patch: Partial<T>
  ) => {
    onChange(
      players.map((p) =>
        p.id === id ? { ...p, [key]: { ...(p[key] as T), ...patch } } : p
      )
    );
  };

  const summary = useMemo(() => {
    const total = players.length;
    const withBatting = players.filter(
      (p) => p.batting && p.batting.runs !== "" && p.batting.balls !== ""
    ).length;
    const withBowling = players.filter((p) => p.bowling && p.bowling.overs !== "").length;
    const withFielding = players.filter(
      (p) =>
        p.fielding &&
        ((p.fielding.catches ?? 0) ||
          (p.fielding.runouts ?? 0) ||
          (p.fielding.stumpings ?? 0) ||
          (p.fielding.drops ?? 0) ||
          (p.fielding.boundarySaves ?? 0))
    ).length;
    return { total, withBatting, withBowling, withFielding };
  }, [players]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Players: <span className="font-medium text-foreground">{summary.total}</span> • Batting:{" "}
          <span className="font-medium text-foreground">{summary.withBatting}</span> • Bowling:{" "}
          <span className="font-medium text-foreground">{summary.withBowling}</span> • Fielding:{" "}
          <span className="font-medium text-foreground">{summary.withFielding}</span>
        </div>
        <Button onClick={addPlayer} className="bg-gradient-primary text-primary-foreground">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Player
        </Button>
      </div>

      {players.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No players added yet. Click “Add Player” to begin.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {players.map((p, idx) => (
          <Card key={p.id} className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Player Name
                      </label>
                      <Input
                        placeholder="e.g., Rahul Sharma"
                        value={p.name}
                        onChange={(e) => updatePlayer(p.id, "name", e.target.value)}
                        className="w-56"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Primary Role
                      </label>
                      <Select
                        value={p.primaryRole || "batter"}
                        onValueChange={(val) =>
                          updatePlayer(p.id, "primaryRole", val as PlayerPrimaryRole)
                        }
                      >
                        <SelectTrigger className="w-44">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="batter">Batter</SelectItem>
                          <SelectItem value="bowler">Bowler</SelectItem>
                          <SelectItem value="all-rounder">All-Rounder</SelectItem>
                          <SelectItem value="wicket-keeper">Wicket-Keeper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button variant="destructive" size="sm" onClick={() => removePlayer(p.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-0">
              {/* Batting */}
              <section>
                <h4 className="text-sm font-semibold text-foreground mb-3">Batting</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Position
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={11}
                      value={p.batting?.battingPosition ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "batting", {
                          battingPosition:
                            e.target.value === ""
                              ? ""
                              : Math.max(1, Math.min(11, Number(e.target.value))),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Role in Match
                    </label>
                    <Select
                      value={p.batting?.roleInMatch || "middle"}
                      onValueChange={(val) =>
                        updateNested(p.id, "batting", { roleInMatch: val as BatRole })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="opener">Opener</SelectItem>
                        <SelectItem value="middle">Middle</SelectItem>
                        <SelectItem value="finisher">Finisher</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Runs
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.batting?.runs ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "batting", {
                          runs: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Balls
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.batting?.balls ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "batting", {
                          balls: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">4s</label>
                    <Input
                      type="number"
                      min={0}
                      value={p.batting?.fours ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "batting", {
                          fours: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">6s</label>
                    <Input
                      type="number"
                      min={0}
                      value={p.batting?.sixes ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "batting", {
                          sixes: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={!!p.batting?.notOut}
                      onChange={(e) => updateNested(p.id, "batting", { notOut: e.target.checked })}
                    />
                    Not Out
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={!!p.batting?.finisherFlag}
                      onChange={(e) =>
                        updateNested(p.id, "batting", { finisherFlag: e.target.checked })
                      }
                    />
                    Batted in last 2 overs
                  </label>
                </div>
              </section>

              {/* Bowling */}
              <section>
                <h4 className="text-sm font-semibold text-foreground mb-3">Bowling</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Overs
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={4}
                      value={p.bowling?.overs ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          overs:
                            e.target.value === ""
                              ? ""
                              : Math.max(0, Math.min(4, Number(e.target.value))),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Runs Conceded
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.bowling?.runsConceded ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          runsConceded:
                            e.target.value === ""
                              ? ""
                              : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Wickets
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={p.bowling?.wickets ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          wickets: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Maidens
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.bowling?.maidens ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          maidens: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Wides
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.bowling?.wides ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          wides: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      No Balls
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.bowling?.noBalls ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          noBalls: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      PP Overs
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={4}
                      value={p.bowling?.oversInPowerplay ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          oversInPowerplay:
                            e.target.value === ""
                              ? ""
                              : Math.max(0, Math.min(4, Number(e.target.value))),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Death Overs
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={4}
                      value={p.bowling?.oversInDeath ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "bowling", {
                          oversInDeath:
                            e.target.value === ""
                              ? ""
                              : Math.max(0, Math.min(4, Number(e.target.value))),
                        })
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Fielding */}
              <section>
                <h4 className="text-sm font-semibold text-foreground mb-3">Fielding</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Catches
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.fielding?.catches ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "fielding", {
                          catches: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Run-outs
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.fielding?.runouts ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "fielding", {
                          runouts: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Stumpings
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.fielding?.stumpings ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "fielding", {
                          stumpings: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Drops
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.fielding?.drops ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "fielding", {
                          drops: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Boundary Saves
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={p.fielding?.boundarySaves ?? ""}
                      onChange={(e) =>
                        updateNested(p.id, "fielding", {
                          boundarySaves:
                            e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
                        })
                      }
                    />
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}