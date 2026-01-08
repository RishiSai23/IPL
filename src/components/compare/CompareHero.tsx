import PlayerCard from "@/components/PlayerCard";

interface Props {
  player1?: any;
  player2?: any;
  onSelect: (slot: "player1" | "player2") => void;
}

const CompareHero = ({ player1, player2, onSelect }: Props) => {
  return (
    <div className="flex items-center justify-center gap-14 py-6">
      <div className="w-80">
        <PlayerCard
          variant="hero"
          player={player1}
          title="Player 1"
          onSelectPlayer={() => onSelect("player1")}
        />
      </div>

      <div className="text-4xl font-extrabold text-gray-500 tracking-widest">
        VS
      </div>

      <div className="w-80">
        <PlayerCard
          variant="hero"
          player={player2}
          title="Player 2"
          onSelectPlayer={() => onSelect("player2")}
        />
      </div>
    </div>
  );
};

export default CompareHero;
