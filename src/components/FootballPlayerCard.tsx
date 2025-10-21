// src/components/FootballPlayerCard.tsx
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { FootballPlayer } from "@/types/footballPlayer";

interface FootballPlayerCardProps {
  name?: string;
  club?: string;
  goals?: number;
  player?: FootballPlayer;
  title?: string;
  onSelectPlayer?: (player: FootballPlayer) => void;
}

const FootballPlayerCard = ({
  name = "Unknown",
  club = "-",
  goals = 0,
  player,
  title,
  onSelectPlayer,
}: FootballPlayerCardProps) => {
  // If player is provided, use player data; otherwise use individual props
  const displayName = player?.name || name;
  const displayClub = player?.club || club;
  const displayGoals = player?.stats?.goals || goals;

  // Safely get the first letter
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const cardContent = (
    <Card className="p-6 rounded-2xl border border-border overflow-hidden relative">
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center text-white text-xl font-bold">
          {initial}
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold text-foreground">{displayName}</h3>
          <p className="text-muted-foreground text-sm">{displayClub}</p>
          <p className="text-sm mt-2">Goals: {displayGoals}</p>
        </div>
      </CardContent>
    </Card>
  );

  // If onSelectPlayer is provided, show the card with selection capability
  if (onSelectPlayer && title) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group cursor-pointer"
        onClick={() => {
          // For now, we'll create a mock player selection
          // In a real app, you'd have a football player selection dialog
          const mockPlayer: FootballPlayer = {
            id: "1",
            name: "Select Player",
            club: "Select Club",
            position: "Forward",
            age: 25,
            nationality: "Unknown",
            marketValue: 0,
            stats: {
              goals: 0,
              assists: 0,
              speed: 0,
              accuracy: 0,
              stamina: 0,
              matches: 0,
            },
            leadership: 0,
          };
          onSelectPlayer(mockPlayer);
        }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="group">
      {cardContent}
    </motion.div>
  );
};

export default FootballPlayerCard;
