import Navigation from "@/components/Navigation";
import type { FootballPlayer } from "@/types/footballPlayer";
import FootballPlayerCard from "@/components/FootballPlayerCard";
import { useState, useEffect } from "react";
// FIX 1: Import all necessary components and functions
import PerformanceChart from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Trophy } from "lucide-react";
import PerformanceComparison from "@/components/PerformanceComparison";
import { getPlayerDetails, getAllCachedPlayers } from "@/api/footballApi";

// Define a type for the minimal player list used in the selection dialog
type MinimalPlayer = {
  id: string;
  name: string;
  club: string;
  position: string;
};

const FootballComparisonPage = () => {
  const [player1Id, setPlayer1Id] = useState<string | null>(null);
  const [player2Id, setPlayer2Id] = useState<string | null>(null);

  const [player1, setPlayer1] = useState<FootballPlayer | undefined>(undefined);
  const [player2, setPlayer2] = useState<FootballPlayer | undefined>(undefined);

  // NEW STATE: For the selection dialog and the cached player list
  const [availablePlayers, setAvailablePlayers] = useState<MinimalPlayer[]>([]);
  const [showPlayerSelect, setShowPlayerSelect] = useState(false);
  const [playerToSet, setPlayerToSet] = useState<1 | 2>(1); // Tracks which slot to fill

  // Re-adding loading and error states for proper UX
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(false);

  // --- NEW: Load the full cached player list once on mount ---
  useEffect(() => {
    const fetchList = async () => {
      setListLoading(true);
      try {
        const list = await getAllCachedPlayers();
        setAvailablePlayers(list);
      } catch (e) {
        console.error("Failed to load player list:", e);
      } finally {
        setListLoading(false);
      }
    };
    fetchList();
  }, []); // FIX 2: PREVENT FETCHING WITH BAD/PLACEHOLDER IDs
  // -----------------------------------------------------------

  useEffect(() => {
    // Only proceed if player1Id is set AND is a string (not null/undefined)
    if (!player1Id) {
      setPlayer1(undefined);
      return;
    }

    setLoading1(true);
    setError1(null);

    getPlayerDetails(player1Id)
      .then((data) => {
        const mappedPlayer: FootballPlayer = mapApiPlayerToFootballPlayer(data);
        setPlayer1(mappedPlayer);
      })
      .catch((e) => {
        console.error("Error fetching P1:", e);
        // The 404 should now only happen if the ID is truly missing from the cache.
        setError1(
          `Failed to load player (ID: ${player1Id}). Check backend cache.`
        );
      })
      .finally(() => setLoading1(false));
  }, [player1Id]); // FIX 3: PREVENT FETCHING WITH BAD/PLACEHOLDER IDs

  useEffect(() => {
    // Only proceed if player2Id is set AND is a string (not null/undefined)
    if (!player2Id) {
      setPlayer2(undefined);
      return;
    }

    setLoading2(true);
    setError2(null);

    getPlayerDetails(player2Id)
      .then((data) => {
        const mappedPlayer: FootballPlayer = mapApiPlayerToFootballPlayer(data);
        setPlayer2(mappedPlayer);
      })
      .catch((e) => {
        console.error("Error fetching P2:", e);
        setError2(
          `Failed to load player (ID: ${player2Id}). Check backend cache.`
        );
      })
      .finally(() => setLoading2(false));
  }, [player2Id]);

  // Helper to open the dialog for selection
  const handleOpenSelect = (playerNum: 1 | 2) => {
    setPlayerToSet(playerNum);
    setShowPlayerSelect(true);
  };

  // Helper to handle selection from the list
  const handlePlayerSelected = (playerId: string) => {
    if (playerToSet === 1) {
      setPlayer1Id(playerId);
    } else {
      setPlayer2Id(playerId);
    }
    setShowPlayerSelect(false);
  }; // The rest of the file (mapApiPlayerToFootballPlayer and JSX) remains the same.

  function mapApiPlayerToFootballPlayer(apiData: any): FootballPlayer {
    return {
      id: apiData.id,
      name: apiData.name,
      age: apiData.age ?? 0,
      nationality: apiData.nationality ?? "Unknown",
      club: apiData.club ?? "Unknown Club",
      position: apiData.position ?? "Unknown Position",
      marketValue: {
        predicted: apiData?.marketValue?.predicted ?? apiData.marketValue ?? 0,
        lastAuction: apiData?.marketValue?.lastAuction,
      },
      leadership: apiData.leadership ?? 0,
      stats: apiData.stats || {
        goals: 0,
        assists: 0,
        speed: 0,
        accuracy: 0,
        stamina: 0,
        matches: 0,
        yellowCards: 0,
        redCards: 0,
      },
    };
  }

  const comparisonMetrics =
    player1 && player2
      ? [
          {
            key: "goals",
            label: "Goals",
            player1: player1.stats.goals,
            player2: player2.stats.goals,
          },
          {
            key: "assists",
            label: "Assists",
            player1: player1.stats.assists,
            player2: player2.stats.assists,
          },
          {
            key: "speed",
            label: "Top Speed (km/h)",
            player1: Number(player1.stats.speed),
            player2: Number(player2.stats.speed),
          },
          {
            key: "accuracy",
            label: "Pass Accuracy (%)",
            player1: player1.stats.accuracy,
            player2: player2.stats.accuracy,
          },
          {
            key: "stamina",
            label: "Stamina Index",
            player1: player1.stats.stamina,
            player2: player2.stats.stamina,
          },
          {
            key: "matches",
            label: "Matches",
            player1: player1.stats.matches,
            player2: player2.stats.matches,
          },
          {
            key: "leadership",
            label: "Leadership",
            player1: player1.leadership,
            player2: player2.leadership,
          },
        ]
      : [];

  const radarData =
    player1 && player2
      ? [
          {
            metric: "Goals",
            player1: Math.min(10, player1.stats.goals / 5),
            player2: Math.min(10, player2.stats.goals / 5),
          },
          {
            metric: "Assists",
            player1: Math.min(10, player1.stats.assists / 5),
            player2: Math.min(10, player2.stats.assists / 5),
          },
          {
            metric: "Speed",
            player1: Math.min(10, Number(player1.stats.speed) / 3.5),
            player2: Math.min(10, Number(player2.stats.speed) / 3.5),
          },
          {
            metric: "Stamina",
            player1: Math.min(10, player1.stats.stamina / 10),
            player2: Math.min(10, player2.stats.stamina / 10),
          },
          {
            metric: "Leadership",
            player1: player1.leadership,
            player2: player2.leadership,
          },
          {
            metric: "Pass Accuracy",
            player1: Math.min(10, player1.stats.accuracy / 10),
            player2: Math.min(10, player2.stats.accuracy / 10),
          },
          {
            metric: "Matches",
            player1: Math.min(10, player1.stats.matches / 30),
            player2: Math.min(10, player2.stats.matches / 30),
          },
        ]
      : [];

  const getWinner = (a: number, b: number): "player1" | "player2" | "tie" => {
    if (a > b) return "player1";
    if (b > a) return "player2";
    return "tie";
  };

  const getBetterPlayer = () => {
    if (!player1 || !player2) return null;
    let p1Wins = 0,
      p2Wins = 0;
    comparisonMetrics.forEach((metric) => {
      const winner = getWinner(metric.player1, metric.player2);
      if (winner === "player1") p1Wins++;
      if (winner === "player2") p2Wins++;
    });
    if (p1Wins > p2Wins)
      return { winner: player1, score: `${p1Wins}-${p2Wins}` };
    if (p2Wins > p1Wins)
      return { winner: player2, score: `${p2Wins}-${p1Wins}` };
    return { winner: null, score: `${p1Wins}-${p2Wins}` };
  };

  const result = getBetterPlayer();

  // Component for Player Selection Dialog (mock using simple rendering)
  const PlayerSelectDialog = () => {
    if (!showPlayerSelect) return null;

    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={() => setShowPlayerSelect(false)}
      >
        <Card
          className="w-full max-w-lg max-h-[80vh] overflow-y-auto glass-card border-emerald-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="sticky top-0 bg-black/70 backdrop-blur-sm z-10 border-b border-emerald-500/20">
            <CardTitle className="text-white text-xl">
              Select Player {playerToSet} ({availablePlayers.length} Available)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {listLoading && (
              <p className="text-center p-6 text-emerald-400">
                Loading player list from cache...
              </p>
            )}
            {!listLoading && availablePlayers.length === 0 && (
              <p className="text-center p-6 text-red-500">
                No players found in the local cache. Please check your backend
                server and the `playerData.json` file.
              </p>
            )}

            <ul className="divide-y divide-emerald-500/10">
              {availablePlayers.map((p) => (
                <li
                  key={p.id}
                  className="p-4 flex justify-between items-center hover:bg-emerald-500/10 transition duration-150 cursor-pointer"
                  onClick={() => handlePlayerSelected(p.id)}
                >
                  <div>
                    <p className="text-white font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-400">
                      {p.club} - {p.position}
                    </p>
                  </div>
                  <button className="text-emerald-400 text-sm hover:text-emerald-300">
                    Select
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-green-950 to-black text-white">
      {PlayerSelectDialog()} {/* Render the selection dialog */}     {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
               {" "}
        <div className="mb-6">
                   {" "}
          <h1 className="text-3xl font-bold flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8 text-emerald-400" />     
                 {" "}
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                            Compare Footballers            {" "}
            </span>
                     {" "}
          </h1>
                   {" "}
          <p className="text-gray-300">
                        Select two players to analyze head-to-head performance.
                     {" "}
          </p>
                 {" "}
        </div>
                {/* Loading and Error Indicators */}
        {(loading1 || loading2 || listLoading) && (
          <p className="text-center text-emerald-400">Loading data...</p>
        )}
        {(error1 || error2) && (
          <p className="text-center text-red-500">{error1 || error2}</p>
        )}
                {/* End Indicators */}       {" "}
        <div className="flex justify-center items-start gap-6">
                   {" "}
          <div className="w-72">
                       {" "}
            <FootballPlayerCard
              title="Player 1"
              player={player1} // MODIFIED: Call the helper to open the selection dialog
              onSelectPlayer={() => handleOpenSelect(1)}
            />
                     {" "}
          </div>
                   {" "}
          <div className="flex items-center h-full pt-10">
                        <span className="text-2xl font-bold">VS</span>         {" "}
          </div>
                   {" "}
          <div className="w-72">
                       {" "}
            <FootballPlayerCard
              title="Player 2"
              player={player2} // MODIFIED: Call the helper to open the selection dialog
              onSelectPlayer={() => handleOpenSelect(2)}
            />
                     {" "}
          </div>
                 {" "}
        </div>
        {player1 && player2 && (
          <div className="space-y-6">
            <PerformanceComparison
              player1Name={player1.name}
              player2Name={player2.name}
              stats={comparisonMetrics.map((m) => {
                const format = (key: string, rawVal: number) => {
                  const val = Number(rawVal);

                  if (!Number.isFinite(val)) {
                    return "N/A";
                  }
                  if (key === "accuracy") return `${rawVal.toFixed(1)}%`;
                  if (key === "speed") return `${rawVal.toFixed(1)} km/h`;
                  // return Number.isFinite(rawVal)
                  //   ? rawVal.toLocaleString()
                  //   : String(rawVal);
                  return val.toLocaleString();
                };
                return {
                  label: m.label,
                  player1Value: m.player1,
                  player2Value: m.player2,
                  player1Display: format(m.key, m.player1),
                  player2Display: format(m.key, m.player2),
                };
              })}
            />

            <Card className="glass-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  <span className="text-white">Skill Radar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  type="radar"
                  data={radarData}
                  dataKey="player1"
                  xAxisKey="metric"
                  height={400}
                />
              </CardContent>
            </Card>

            {result?.winner && (
              <Card className="glass-card shadow-card bg-emerald-500/10 border-emerald-500/20">
                <CardContent className="text-center py-6">
                  <Trophy className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white">
                    Overall Winner: {result.winner.name}
                  </h2>
                  <p className="text-gray-300">
                    Wins {result.score} across key metrics
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default FootballComparisonPage;
