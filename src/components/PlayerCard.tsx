// src/components/PlayerCard.tsx
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import PlayerSelectionDialog from "./PlayerSelectionDialog";
import type { Player } from "@/types/player";

interface PlayerCardProps {
  name?: string;
  team?: string;
  score?: number;
  player?: Player;
  title?: string;
  onSelectPlayer?: (player: Player) => void;
}

const PlayerCard = ({ 
  name = "Unknown", 
  team = "-", 
  score = 0, 
  player, 
  title, 
  onSelectPlayer 
}: PlayerCardProps) => {
  // If player is provided, use player data; otherwise use individual props
  const displayName = player?.name || name;
  const displayTeam = player?.team || team;
  const displayScore = player?.stats?.runs || score;
  
  // Safely get the first letter
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const cardContent = (
    <Card className="p-6 rounded-2xl border border-border overflow-hidden relative">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-400 flex items-center justify-center text-white text-xl font-bold">
          {initial}
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
          <p className="text-muted-foreground text-sm">{displayTeam}</p>
          <p className="text-sm mt-2">Score: {displayScore}</p>
        </div>
      </CardContent>
    </Card>
  );

  // If onSelectPlayer is provided, wrap in PlayerSelectionDialog
  if (onSelectPlayer && title) {
    return (
      <PlayerSelectionDialog
        onSelectPlayer={onSelectPlayer}
        title={title}
        trigger={
          <motion.div whileHover={{ scale: 1.02 }} className="group cursor-pointer">
            {cardContent}
          </motion.div>
        }
      />
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="group">
      {cardContent}
    </motion.div>
  );
};

export default PlayerCard;
