import { UserCircle } from "lucide-react";

interface TrendingPlayer {
  id: string;
  name: string;
  avatar?: string;
}

interface TrendingPlayersProps {
  players: TrendingPlayer[];
  onSelectPlayer: (player: TrendingPlayer) => void;
}

const TrendingPlayers = ({ players, onSelectPlayer }: TrendingPlayersProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 pb-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Currently Trending Players
      </h2>
      <div className="flex flex-wrap gap-4">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => onSelectPlayer(player)}
            className="flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3 hover:shadow-[var(--shadow-elevated)] hover:border-primary transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-primary transition-all">
              {player.avatar ? (
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircle className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
              {player.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingPlayers;
