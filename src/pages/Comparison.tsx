import { useState } from "react";
import Navigation from "@/components/Navigation";
// import HeaderSection from "@/components/HeaderSection";
import CompareSection from "@/components/CompareSection";
import PerformanceComparison from "@/components/PerformanceComparison";
import TrendingPlayers from "@/components/TrendingPlayers";
import type { Player } from "@/types/player";
import { mockPlayers } from "@/data/mockPlayers";

const mockStats = [
  {
    label: "Matches",
    player1Value: 254,
    player2Value: 150,
    player1Display: "254",
    player2Display: "150",
  },
  {
    label: "Runs",
    player1Value: 12040,
    player2Value: 7540,
    player1Display: "12,040",
    player2Display: "7,540",
  },
  {
    label: "Average",
    player1Value: 59.3,
    player2Value: 61.2,
    player1Display: "59.3",
    player2Display: "61.2",
  },
  {
    label: "Strike Rate",
    player1Value: 93.2,
    player2Value: 88.4,
    player1Display: "93.2",
    player2Display: "88.4",
  },
  {
    label: "Centuries",
    player1Value: 43,
    player2Value: 29,
    player1Display: "43",
    player2Display: "29",
  },
  {
    label: "Half Centuries",
    player1Value: 64,
    player2Value: 36,
    player1Display: "64",
    player2Display: "36",
  },
];

const trendingPlayers = [
  { id: "3", name: "Andre Russell" },
  { id: "4", name: "Rashid Khan" },
  { id: "2", name: "Jasprit Bumrah" },
  { id: "1", name: "Virat Kohli" },
];

const CompareCricketersPage = () => {
  const [player1, setPlayer1] = useState<Player | undefined>(undefined);
  const [player2, setPlayer2] = useState<Player | undefined>(undefined);

  const handleSelectPlayer1 = (player: Player) => {
    setPlayer1(player);
  };

  const handleSelectPlayer2 = (player: Player) => {
    setPlayer2(player);
  };

  const handleSelectTrendingPlayer = (player: { id: string; name: string }) => {
    console.log("Selected trending player:", player.name);
    // Find the player in mockPlayers array
    const selectedPlayer = mockPlayers.find((p) => p.id === player.id);
    if (selectedPlayer) {
      // Set as player 1 if empty, otherwise player 2
      if (!player1) {
        setPlayer1(selectedPlayer);
      } else if (!player2) {
        setPlayer2(selectedPlayer);
      } else {
        setPlayer2(selectedPlayer);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* <HeaderSection /> */}

      <CompareSection
        player1={player1}
        player2={player2}
        onSelectPlayer1={handleSelectPlayer1}
        onSelectPlayer2={handleSelectPlayer2}
      />

      {player1 && player2 && (
        <PerformanceComparison
          player1Name={player1.name}
          player2Name={player2.name}
          stats={mockStats}
        />
      )}

      <TrendingPlayers
        players={trendingPlayers}
        onSelectPlayer={handleSelectTrendingPlayer}
      />
    </div>
  );
};

export default CompareCricketersPage;
