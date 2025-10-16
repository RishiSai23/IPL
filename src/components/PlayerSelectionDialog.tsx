import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { mockPlayers } from "@/data/mockPlayers";

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

  const filteredPlayers = mockPlayers.filter(
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
            {filteredPlayers.map((player) => (
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
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No players found matching your search.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerSelectionDialog;
