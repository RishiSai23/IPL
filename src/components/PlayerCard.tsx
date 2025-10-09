import { UserCircle, Plus } from "lucide-react";
import type { Player } from "@/types/player";
import PlayerSelectionDialog from "./PlayerSelectionDialog";

interface PlayerCardProps {
  player?: Player;
  onSelectPlayer?: (player: Player) => void;
  title: string;
}

const PlayerCard = ({ player, onSelectPlayer, title }: PlayerCardProps) => {
  if (!player) {
    return (
      <PlayerSelectionDialog
        onSelectPlayer={onSelectPlayer!}
        title={`Select ${title}`}
        trigger={
          <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-elevated)] transition-all duration-300 cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 group">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border-2 border-dashed border-orange-300 group-hover:border-orange-400 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300">
                <Plus className="w-16 h-16 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-orange-600 group-hover:text-orange-700 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-orange-500 text-sm group-hover:text-orange-600 transition-colors duration-300">
                  Click to add a player
                </p>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <PlayerSelectionDialog
      onSelectPlayer={onSelectPlayer!}
      title={`Change ${title}`}
      trigger={
        <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border hover:shadow-[var(--shadow-elevated)] transition-all duration-300 cursor-pointer hover:border-orange-300 hover:bg-orange-50/20 group">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-orange-200 transition-all duration-300">
              {player.image ? (
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-20 h-20 text-muted-foreground" />
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-foreground group-hover:text-orange-700 transition-colors duration-300">
                {player.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {player.nationality}
              </p>
              <p className="text-muted-foreground text-sm font-medium">
                {player.role.primary}
              </p>
              <p className="text-muted-foreground text-xs">{player.team}</p>
              <p className="text-orange-500 text-xs font-medium group-hover:text-orange-600 transition-colors duration-300">
                Click to change player
              </p>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default PlayerCard;
