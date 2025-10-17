interface StatComparison {
  label: string;
  player1Value: number;
  player2Value: number;
  player1Display: string;
  player2Display: string;
}

interface PerformanceComparisonProps {
  player1Name: string;
  player2Name: string;
  stats: StatComparison[];
}

const PerformanceComparison = ({
  player1Name,
  player2Name,
  stats,
}: PerformanceComparisonProps) => {
  const getBarWidth = (value: number, maxValue: number) => {
    return `${(value / maxValue) * 100}%`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="bg-card rounded-3xl p-8 shadow-[var(--shadow-card)] border border-border">
        <h2 className="text-3xl font-bold text-foreground mb-8">
          Performance Stats Comparison
        </h2>

        <div className="space-y-8">
          {/* Header Row */}
          <div className="grid grid-cols-[200px_1fr_1fr] gap-4 pb-4 border-b border-border">
            <div className="font-semibold text-foreground">Stat</div>
            <div className="font-semibold text-blue-600 text-center">
              {player1Name}
            </div>
            <div className="font-semibold text-red-600 text-center">
              {player2Name}
            </div>
          </div>

          {/* Stats Rows */}
          {stats.map((stat, index) => {
            const maxValue = Math.max(stat.player1Value, stat.player2Value);

            return (
              <div key={index} className="space-y-2">
                <div className="font-medium text-foreground">{stat.label}</div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Player 1 Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                        style={{
                          width: getBarWidth(stat.player1Value, maxValue),
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">
                      {stat.player1Display}
                    </div>
                  </div>

                  {/* Player 2 Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                        style={{
                          width: getBarWidth(stat.player2Value, maxValue),
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-red-600 font-semibold">
                      {stat.player2Display}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceComparison;
