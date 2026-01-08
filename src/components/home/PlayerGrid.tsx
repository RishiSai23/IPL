type Player = {
    name: string;
    team: string;
    runs: number;
    matches: number;
    sr: number;
    final: number;
    pressure: number;
    consistency: number;
    opposition: number;
  };
  
  const players: Player[] = [
    {
      name: "Rohan Kunnummal",
      team: "Kerala",
      runs: 368,
      matches: 8,
      sr: 160.7,
      final: 62.57,
      pressure: 40.57,
      consistency: 33.12,
      opposition: 100,
    },
    {
      name: "Sanju Samson",
      team: "Kerala",
      runs: 284,
      matches: 7,
      sr: 135.2,
      final: 60.96,
      pressure: 40.02,
      consistency: 49.04,
      opposition: 87.76,
    },
    {
      name: "Sai Sudharsan",
      team: "Tamil Nadu",
      runs: 192,
      matches: 6,
      sr: 152.4,
      final: 56.91,
      pressure: 50.17,
      consistency: 21.67,
      opposition: 85.42,
    },
  ];
  
  const MiniPie = ({ value }: { value: number }) => {
    return (
      <div
        className="relative h-8 w-8 rounded-full"
        style={{
          background: `conic-gradient(#14b8a6 ${value * 3.6}deg, #1f2933 0deg)`,
        }}
      >
        <div className="absolute inset-1 rounded-full bg-black flex items-center justify-center text-[10px] text-gray-300">
          {value}
        </div>
      </div>
    );
  };
  
  const Bar = ({ value }: { value: number }) => (
    <div className="h-2 w-full rounded bg-white/10">
      <div
        className="h-2 rounded bg-teal-400"
        style={{ width: `${value}%` }}
      />
    </div>
  );
  
  const PlayerGrid = () => {
    return (
      <section
        id="players"
        className="px-6 md:px-20 py-24 max-w-7xl mx-auto border-t border-white/10"
      >
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold">Player Database</h2>
          <p className="text-sm text-gray-400 mt-1">
            Shortlist domestic players, then deep-dive into comparison
          </p>
        </div>
  
        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-black/50">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Team</th>
                <th className="px-4 py-3 text-right">Runs</th>
                <th className="px-4 py-3 text-right">SR</th>
                <th className="px-4 py-3 text-right">Final</th>
                <th className="px-4 py-3 text-center">Pressure</th>
                <th className="px-4 py-3 text-center">Consistency</th>
                <th className="px-4 py-3 text-center">Opposition</th>
              </tr>
            </thead>
  
            <tbody className="divide-y divide-white/5">
              {players.map((p) => (
                <tr
                  key={p.name}
                  className="hover:bg-white/5 transition"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {p.name}
                  </td>
                  <td className="px-4 py-4 text-gray-400">
                    {p.team}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {p.runs}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {p.sr}
                  </td>
  
                  {/* Final score bar */}
                  <td className="px-4 py-4 min-w-[140px]">
                    <div className="text-teal-400 text-xs mb-1">
                      {p.final}
                    </div>
                    <Bar value={p.final} />
                  </td>
  
                  {/* Mini charts */}
                  <td className="px-4 py-4 flex justify-center">
                    <MiniPie value={Math.round(p.pressure)} />
                  </td>
  
                  <td className="px-4 py-4 flex justify-center">
                    <MiniPie value={Math.round(p.consistency)} />
                  </td>
  
                  <td className="px-4 py-4 flex justify-center">
                    <MiniPie value={Math.round(p.opposition / 1)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };
  
  export default PlayerGrid;
  