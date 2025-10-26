import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Components & Pages
import AddMatch from "./pages/AddMatch";
import Analysis from "./pages/Analysis";
import PhysicalAnalysis from "./pages/PhysicalAnalysis.tsx";
import PlayerScore from "./pages/PlayerScore";
import Index from "./pages/Index";
import Leaderboard from "./pages/Leaderboard";
import MatchDetails from "./pages/MatchDetails";
import Matches from "./pages/Matches";
import Players from "./pages/Players";
import PlayerScorecard from "./pages/PlayerScorecard";
import FootballDashboard from "./pages/Football/FootballDashboard.tsx";
import FootballComparison from "./pages/Football/FootballComparison.tsx";
import LoginPage from "./components/LoginPage.tsx";

// NEW IMPORTS
import ProtectedRoute from "./components/ProtectedRoute.tsx"; // The combined Auth Guard and Layout Wrapper

import { MotionConfig, LazyMotion, domAnimation } from "framer-motion";

const queryClient = new QueryClient();

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* PUBLIC ROUTE: Accessible without login */}
                <Route path="/login" element={<LoginPage />} />

                {/* ---------------------------------------------------- */}
                {/* PROTECTED ROUTES: Wrapped by ProtectedRoute */}
                {/* ---------------------------------------------------- */}
                <Route element={<ProtectedRoute />}>
                  {/* The content for these nested routes is rendered inside <AuthenticatedLayout> */}
                  <Route path="/" element={<Index />} />
                  <Route path="/players" element={<Players />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/pfAnalysis" element={<PlayerScore />} />
                  <Route
                    path="/physicalAnalysis"
                    element={<PhysicalAnalysis />}
                  />
                  <Route path="/comparison" element={<FootballComparison />} />
                  <Route path="/physical" element={<PhysicalAnalysis />} />
                  <Route path="/player-score" element={<PlayerScore />} />
                  <Route path="/add-match" element={<AddMatch />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/matches/:id" element={<MatchDetails />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route
                    path="/scorecard/:playerKey"
                    element={<PlayerScorecard />}
                  />
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
