import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Players from "./pages/Players";
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";
import Leaderboard from "./pages/Leaderboard";
import Analysis from "./pages/Analysis";
import PlayerScore from "./pages/PlayerScore";
import PlayerScorecard from "./pages/PlayerScorecard";
import AddMatch from "./pages/AddMatch";
import PhysicalAnalysis from "./pages/PhysicalAnalysis";
import CompareCricketersPage from "./pages/Comparison";

// Football (keep – don’t break existing)
import FootballDashboard from "./pages/Football/FootballDashboard";

// Auth
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* PUBLIC */}
                <Route path="/login" element={<LoginPage />} />

                {/* PROTECTED */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/players" element={<Players />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/matches/:id" element={<MatchDetails />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/player-score" element={<PlayerScore />} />
                  <Route path="/scorecard/:playerKey" element={<PlayerScorecard />} />
                  <Route path="/add-match" element={<AddMatch />} />
                  <Route path="/physicalAnalysis" element={<PhysicalAnalysis />} />

                  {/* ✅ CRITICAL FIX — BOTH ROUTES */}
                  <Route path="/compare" element={<CompareCricketersPage />} />
                  <Route path="/comparison" element={<CompareCricketersPage />} />

                  {/* Football */}
                  <Route
                    path="/football/dashboard"
                    element={<FootballDashboard />}
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
