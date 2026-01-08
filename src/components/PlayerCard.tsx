import { Card } from "@/components/ui/card";

interface PlayerCardProps {
  player?: any;
  title?: string;
  onSelectPlayer?: () => void;
  variant?: "default" | "hero";
}

const PlayerCard = ({
  player,
  title,
  onSelectPlayer,
  variant = "default",
}: PlayerCardProps) => {
  if (!player) {
    return (
      <Card
        onClick={onSelectPlayer}
        className="cursor-pointer bg-gradient-to-b from-[#0a0a0a] via-[#120b2e] to-[#0a0a0a]
                   border border-cyan-500 rounded-2xl p-8 text-center text-white
                   hover:scale-[1.03] transition"
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-400 mt-2">
          Click to select a SMAT player
        </p>
      </Card>
    );
  }

  const { stats = {}, role } = player;

  return (
    <Card
      onClick={onSelectPlayer}
      className={`bg-gradient-to-b from-[#0a0a0a] via-[#120b2e] to-[#0a0a0a]
        border border-cyan-500 rounded-2xl p-8 text-white
        hover:scale-[1.03] transition cursor-pointer
        ${variant === "hero" ? "shadow-[0_0_40px_rgba(34,211,238,0.15)]" : ""}`}
    >
      <h2 className="text-2xl font-extrabold text-center">
        {player.name}
      </h2>

      <p className="text-center text-cyan-400 mt-1 text-sm">
        {player.team} • {role}
      </p>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          Final Readiness Score
        </p>
        <p className="text-4xl font-extrabold text-purple-400 mt-1">
          {Math.round(stats.finalScore)}
        </p>
      </div>
    </Card>
  );
};

export default PlayerCard;
