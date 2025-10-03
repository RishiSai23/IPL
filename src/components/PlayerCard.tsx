import { User, MapPin, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Player } from "@/types/player";

interface PlayerCardProps {
  player: Player;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  return (
    <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 card-shadow-lg">
      <div className="gradient-primary h-24" />
      <CardContent className="pt-0 -mt-12 space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            {player.image ? (
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-foreground">{player.name}</h3>

          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{player.nationality}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {player.role.primary}
            </span>
          </div>

          <div className="pt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground font-medium">
              {player.team}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
