// file: src/App.tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Use relative imports to avoid alias issues for now
import AddMatch from "./pages/AddMatch";
import Analysis from "./pages/Analysis";
import PlayerScore from "./pages/PlayerScore";
import Comparison from "./pages/Comparison";
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import MatchDetails from "./pages/MatchDetails";
import Matches from "./pages/Matches";
import Players from "./pages/Players";
import PlayerScorecard from "./pages/PlayerScorecard";




const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/players" element={<Players />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/player-score" element={<PlayerScore />} />
            <Route path="/add-match" element={<AddMatch />} />
            <Route path="/matches" element={<Matches />} /> {/* new */}
            <Route path="/matches/:id" element={<MatchDetails />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/scorecard/:playerKey" element={<PlayerScorecard />} />




          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
