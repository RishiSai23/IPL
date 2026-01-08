import React from "react";

interface MetricRowProps {
  title: string;
  leftScore: number;
  rightScore: number;
  highlight?: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({
  title,
  leftScore,
  rightScore,
  highlight = false,
}) => {
  const left = Math.round(leftScore);
  const right = Math.round(rightScore);

  const diff = Math.abs(left - right);
  const winnerSide = left > right ? "left" : "right";

  return (
    <div
      className={`
        relative rounded-xl px-6 py-5
        bg-slate-900/80
        ${highlight ? "ring-1 ring-yellow-400/50" : "ring-1 ring-white/5"}
      `}
    >
      {/* TITLE + ADVANTAGE */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-center">
        <div className="text-sm font-semibold text-gray-200">{title}</div>
        {highlight && (
          <div className="text-xs text-yellow-400 font-semibold">
            +{diff} advantage
          </div>
        )}
      </div>

      {/* BARS */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mt-6">

        {/* LEFT */}
        <div>
          <div className="text-xs text-gray-400 mb-1">{left}/100</div>
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${left}%` }}
            />
          </div>
        </div>

        {/* VS */}
        <div className="text-xs text-gray-500 font-semibold">VS</div>

        {/* RIGHT */}
        <div>
          <div className="text-xs text-gray-400 mb-1 text-right">
            {right}/100
          </div>
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all"
              style={{ width: `${right}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetricRow;
