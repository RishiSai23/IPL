import PlayerCard from "./PlayerCard";
import type { Player } from "@/types/player";

interface CompareSectionProps {
  player1?: Player;
  player2?: Player;
  onSelectPlayer1: (player: Player) => void;
  onSelectPlayer2: (player: Player) => void;
}

const CompareSection = ({
  player1,
  player2,
  onSelectPlayer1,
  onSelectPlayer2,
}: CompareSectionProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <PlayerCard
            player={player1}
            onSelectPlayer={() => onSelectPlayer1(player1!)}
            title="Player 1"
          />

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-[hsl(281_76%_44%)] blur-xl opacity-30"></div>
              <div className="relative bg-gradient-to-r from-primary to-[hsl(281_76%_44%)] text-white font-bold text-2xl px-8 py-4 rounded-full shadow-lg">
                VS
              </div>
            </div>
          </div>

          <PlayerCard
            player={player2}
            onSelectPlayer={() => onSelectPlayer2(player2!)}
            title="Player 2"
          />
        </div>
      </div>
    </div>
  );
};

export default CompareSection;
