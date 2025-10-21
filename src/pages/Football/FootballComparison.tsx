import Navigation from "@/components/Navigation";
import type { FootballPlayer } from "@/types/footballPlayer";
import FootballPlayerCard from "@/components/FootballPlayerCard";
import PerformanceChart from "@/components/PerformanceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Trophy, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import PerformanceComparison from "@/components/PerformanceComparison";
// NOTE: Ensure your @/api/footballApi file exports getPlayerDetails
import { testApiConnection } from "@/api/footballApi";

// Define a type for the API test status
type ApiStatus = "idle" | "loading" | "success" | "error";

const FootballComparisonPage = () => {
  // --- New State for API Test ---
  const [apiTestStatus, setApiTestStatus] = useState<ApiStatus>("idle");
  const [apiTestError, setApiTestError] = useState<string | null>(null);
  // -------------------------------

  const [player1Id, setPlayer1Id] = useState<string | null>(null);
  const [player2Id, setPlayer2Id] = useState<string | null>(null);

  const [player1, setPlayer1] = useState<FootballPlayer | undefined>(undefined);
  const [player2, setPlayer2] = useState<FootballPlayer | undefined>(undefined);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  // --- New useEffect for API Connection Test ---
  useEffect(() => {
    const runTest = async () => {
      setApiTestStatus("loading");
      setApiTestError(null);
      try {
        // Using a known Player ID (e.g., 7705 for Cristiano Ronaldo)
        await testApiConnection("7705");
        setApiTestStatus("success");
      } catch (e: any) {
        setApiTestStatus("error");
        // Extract a concise error message for display
        const status = e.response?.status;
        let message = "Failed to connect to API.";

        if (status === 403) {
          message =
            "403: API Key (X-Auth-Token) is Invalid or Missing. Check your .env file.";
        } else if (status === 404) {
          message =
            "404: Endpoint Not Found (The test player ID might be wrong).";
        } else if (status === 429) {
          message =
            "429: Rate Limit Exceeded. Please wait a minute and refresh.";
        } else if (e.request) {
          message =
            "Network/CORS Error: Could not reach the API. Check your browser's console.";
        }
        setApiTestError(message);
        console.error("API Test Failed:", e);
      }
    };
    // Run the test only once when the component mounts
    runTest();
  }, []);
  // ---------------------------------------------

  //   useEffect(() => {
  //     if (!player1Id) return;
  //     setLoading1(true);
  //     setError1(null);
  //     // NOTE: Make sure getPlayerDetails is imported from "@/api/footballApi"
  // //     getPlayerDetails(player1Id)
  // //       .then((data) => {
  // //         const mappedPlayer: FootballPlayer = mapApiPlayerToFootballPlayer(data);
  // //         setPlayer1(mappedPlayer);
  // //       })
  // //       .catch(() => setError1("Failed to load Player 1 data"))
  // //       .finally(() => setLoading1(false));
  // //   }, [player1Id]);

  // //   useEffect(() => {
  // //     if (!player2Id) return;
  // //     setLoading2(true);
  // //     setError2(null);
  // //     getPlayerDetails(player2Id)
  // //       .then((data) => {
  // //         const mappedPlayer: FootballPlayer = mapApiPlayerToFootballPlayer(data);
  // //         setPlayer2(mappedPlayer);
  // //       })
  // //       .catch(() => setError2("Failed to load Player 2 data"))
  // //       .finally(() => setLoading2(false));
  // //   }, [player2Id]);

  // The rest of the functions (mapApiPlayerToFootballPlayer, comparisonMetrics, etc.) remain unchanged
  function mapApiPlayerToFootballPlayer(apiData: any): FootballPlayer {
    return {
      id: apiData.id,
      name: apiData.name,
      age: apiData.age ?? 0,
      nationality: apiData.nationality ?? "Unknown",
      // NOTE: club and stats properties are highly unlikely to be direct properties of the /persons/{id} endpoint
      // The API only returns basic person data (name, DOB, nationality, position, currentTeam).
      // The stats properties here (goals, assists, speed, etc.) are **custom/fictional** properties you've added.
      club: apiData.currentTeam?.name ?? "Unknown Club", // Corrected club mapping for football-data.org API
      position: apiData.position ?? "Unknown Position",
      marketValue: apiData.marketValue ?? 0,
      leadership: apiData.leadership ?? 0, // Fictional
      stats: {
        goals: apiData.goals ?? 0, // Fictional/Custom
        assists: apiData.assists ?? 0, // Fictional/Custom
        speed: apiData.speed ?? 0, // Fictional/Custom
        accuracy: apiData.passAccuracy ?? 0, // Fictional/Custom
        stamina: apiData.stamina ?? 0, // Fictional/Custom
        matches: apiData.matches ?? 0, // Fictional/Custom
        yellowCards: apiData.yellowCards ?? 0, // Fictional/Custom
        redCards: apiData.redCards ?? 0, // Fictional/Custom
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
            player1: player1.stats.speed,
            player2: player2.stats.speed,
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
            player1: Math.min(10, player1.stats.speed / 3.5),
            player2: Math.min(10, player2.stats.speed / 3.5),
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

  // --- JSX for API Test Status Display ---
  const renderApiStatus = () => {
    if (apiTestStatus === "loading") {
      return (
        <p className="text-center text-yellow-500 flex items-center justify-center">
          Testing API connection...
        </p>
      );
    }
    if (apiTestStatus === "success") {
      return (
        <p className="text-center text-emerald-400 flex items-center justify-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>API Connection Successful! You can proceed.</span>
        </p>
      );
    }
    if (apiTestStatus === "error") {
      return (
        <p className="text-center text-red-500 flex items-center justify-center space-x-2">
          <XCircle className="w-5 h-5" />
          <span className="font-bold">API Test Failed:</span> {apiTestError}
        </p>
      );
    }
    return null;
  };
  // ---------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-green-950 to-black text-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-emerald-400" />
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Compare Footballers
            </span>
          </h1>
          <p className="text-gray-300">
            Select two players to analyze head-to-head performance.
          </p>
        </div>

        {/* API Status Indicator */}
        <div className="py-2">{renderApiStatus()}</div>
        {/* End API Status Indicator */}

        <div className="flex justify-center items-start gap-6">
          <div className="w-72">
            <FootballPlayerCard
              title="Player 1"
              player={player1}
              onSelectPlayer={(player) => setPlayer1Id(player?.id ?? null)}
            />
          </div>
          <div className="flex items-center h-full pt-10">
            <span className="text-2xl font-bold">VS</span>
          </div>
          <div className="w-72">
            <FootballPlayerCard
              title="Player 2"
              player={player2}
              onSelectPlayer={(player) => setPlayer2Id(player?.id ?? null)}
            />
          </div>
        </div>

        {(loading1 || loading2) && (
          <p className="text-center text-emerald-400">Loading player data...</p>
        )}

        {(error1 || error2) && (
          <p className="text-center text-red-500">{error1 || error2}</p>
        )}

        {player1 && player2 && (
          <div className="space-y-6">
            <PerformanceComparison
              player1Name={player1.name}
              player2Name={player2.name}
              stats={comparisonMetrics.map((m) => {
                const format = (key: string, val: number) => {
                  if (key === "accuracy") return `${val.toFixed(1)}%`;
                  if (key === "speed") return `${val.toFixed(1)} km/h`;
                  return Number.isFinite(val)
                    ? val.toLocaleString()
                    : String(val);
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
      </div>
    </div>
  );
};

export default FootballComparisonPage;
