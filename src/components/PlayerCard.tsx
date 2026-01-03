import { Card } from "@/components/ui/card";

interface PlayerCardProps {
  player?: any;
  title?: string;
  onSelectPlayer?: () => void;
}

const PlayerCard = ({ player, title, onSelectPlayer }: PlayerCardProps) => {
  // 🛡️ EMPTY STATE (no player selected)
  if (!player) {
    return (
      <Card
        onClick={onSelectPlayer}
        className="cursor-pointer bg-gradient-to-b from-[#0a0a0a] via-[#120b2e] to-[#0a0a0a]
                   border border-cyan-500 rounded-xl p-6 text-center text-white
                   hover:scale-105 transition"
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-400 mt-2">
          Click to choose a TN SMAT batter
        </p>
      </Card>
    );
  }

  const stats = player.stats || {};

  return (
    <Card
      onClick={onSelectPlayer}
      className="bg-gradient-to-b from-[#0a0a0a] via-[#120b2e] to-[#0a0a0a]
                 border border-cyan-500 rounded-xl p-6 text-white
                 hover:scale-105 transition cursor-pointer"
    >
      {/* Player Name */}
      <h2 className="text-xl font-bold text-center">{player.name}</h2>

      {/* Team & Role */}
      <p className="text-center text-cyan-400 mt-1">
        {player.team} • {player.role}
      </p>

      {/* Stats */}
      <div className="mt-5 space-y-2 text-sm text-gray-300">
        <p>Matches: <span className="text-white">{stats.matches ?? "—"}</span></p>
        <p>Runs: <span className="text-white">{stats.runs ?? "—"}</span></p>
        <p>Average: <span className="text-white">{stats.average ?? "—"}</span></p>
        <p>Strike Rate: <span className="text-white">{stats.strikeRate ?? "—"}</span></p>
      </div>

      {/* Final Score */}
      {stats.finalScore !== undefined && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Model Score</p>
          <p className="text-2xl font-bold text-purple-400">
            {stats.finalScore}
          </p>
        </div>
      )}
    </Card>
  );
};

export default PlayerCard;
