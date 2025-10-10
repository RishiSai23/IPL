// file: src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Use relative imports to avoid alias issues for now
import Index from "./pages/Index";
import Players from "./pages/Players";
import Analysis from "./pages/Analysis";
import Comparison from "./pages/Comparison";
import Auction from "./pages/Auction";
import AddMatch from "./pages/AddMatch";
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";
import Leaderboard from "./pages/Leaderboard";
import PlayerScorecard from "./pages/PlayerScorecard";




const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/players" element={<Players />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/auction" element={<Auction />} />
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