import { Card } from "@/components/ui/card";

interface PlayerCardProps {
  player?: any;
  title?: string;
}

const PlayerCard = ({ player }: PlayerCardProps) => {
  // Early return if player is not provided
  if (!player) {
    return null;
  }

  return (
    <Card className="relative bg-gradient-to-b from-[#0a0a0a] via-[#120b2e] to-[#0a0a0a] border border-cyan-500 rounded-xl overflow-hidden text-white shadow-[0_0_20px_rgba(0,255,255,0.2)] p-4 group transition-transform hover:scale-105">
      {/* Player Image Section - Fixed for proper image display */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden border border-cyan-400/40 flex items-center justify-center aspect-[4/5]">
        <img
          src={player.image || "/placeholder-player.png"}
          alt={player.name || "Player"}
          className="object-cover w-full h-full rounded-md p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Player Info */}
      <div className="text-center mt-4 space-y-1">
        <h2 className="text-lg font-bold tracking-wide uppercase">
          {player.name || "Unknown Player"}
        </h2>
        <p className="text-sm text-cyan-300 font-semibold">
          {player.team || "N/A"}
        </p>
        <p className="text-xs text-gray-400 uppercase">
          {player.position || ""}
        </p>
      </div>

      {/* Price Section */}
      <div className="text-center mt-5">
        <p className="text-base font-semibold text-gray-400 line-through">
          ₹{player.auctionValue?.previous ?? "2000"}
        </p>
        <p className="text-xl font-extrabold text-purple-400 drop-shadow-md">
          ₹{player.auctionValue?.predicted ?? "1699"}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button className="w-[48%] py-2 text-sm font-bold tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md hover:opacity-90 shadow-[0_0_10px_rgba(0,255,255,0.4)]">
          REGISTER
        </button>
        <button className="w-[48%] py-2 text-sm font-bold tracking-wider bg-gradient-to-r from-purple-500 to-pink-600 rounded-md hover:opacity-90 shadow-[0_0_10px_rgba(255,0,255,0.3)]">
          EXPLORE
        </button>
      </div>

      {/* Decorative Accent */}
      <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-500" />
    </Card>
  );
};

export default PlayerCard;
