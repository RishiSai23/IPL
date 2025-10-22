import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserCircle } from "lucide-react";
import type { Player } from "@/types/player";
import { getAllCachedPlayers } from "@/api/footballApi";

interface PlayerSelectionDialogProps {
  onSelectPlayer: (player: Player) => void;
  trigger: React.ReactNode;
  title: string;
}

const PlayerSelectionDialog = ({
  onSelectPlayer,
  trigger,
  title,
}: PlayerSelectionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getAllCachedPlayers()
        .then((data) => {
          // Convert football players to cricket players for compatibility
          const cricketPlayers: Player[] = data.map((fp: any) => ({
            id: fp.id,
            name: fp.name,
            team: fp.club || "Unknown",
            age: fp.age || 25,
            nationality: fp.nationality || "Unknown",
            position: fp.position || "Player",
            stats: {
              matches: fp.stats?.matches || 0,
              runs: fp.stats?.goals || 0, // Using goals as runs for compatibility
              wickets: fp.stats?.assists || 0, // Using assists as wickets
              strikeRate: fp.stats?.speed || 0,
              average: fp.stats?.accuracy || 0,
              economy: fp.stats?.stamina || 0,
              catches: 0,
              fifties: 0,
              hundreds: 0,
              bestBowling: "0/0",
            },
            form: {
              last5Matches: [0, 0, 0, 0, 0],
              trend: "up" as const,
              recentPerformance: "good" as const,
            },
            swot: {
              strengths: [],
              weaknesses: [],
              opportunities: [],
              threats: [],
            },
            role: {
              primary: "batsman" as const,
              secondary: [],
              fitment: {
                powerHitter: 50,
                anchor: 50,
                finisher: 50,
                deathBowler: 50,
                impactSub: 50,
              },
            },
            auctionValue: {
              current: fp.marketValue?.predicted || 0,
              predicted: fp.marketValue?.predicted || 0,
              confidence: 80,
            },
            image: fp.photoUrl,
            injuryRisk: "low" as const,
            leadership: fp.leadership || 5,
          }));
          setPlayers(cricketPlayers);
        })
        .catch((error) => {
          console.error("Failed to fetch players:", error);
          setPlayers([]);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectPlayer = (player: Player) => {
    onSelectPlayer(player);
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search players by name, team, or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading players...
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No players found matching your search.
              </div>
            ) : (
              filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className={
                    "p-4 rounded-lg border cursor-pointer transition-colors border-border hover:border-primary/50 hover:bg-muted/50"
                  }
                  onClick={() => handleSelectPlayer(player)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {player.image ? (
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">
                        {player.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {player.team}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {player.nationality}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {player.position}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right text-sm text-muted-foreground">
                      <p>Age: {player.age}</p>
                      <p>Matches: {player.stats.matches}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSelectionDialog;
