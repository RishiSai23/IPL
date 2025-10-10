// file: src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

// Use relative imports to avoid alias issues for now
import Index from "./pages/Index";
import Players from "./pages/Players";
import Analysis from "./pages/Analysis";
// import Comparison from "./pages/Comparison.tsx";
import PhysicalAnalysis from "./pages/PhysicalAnalysis.tsx";
import Comparison from "./pages/Comparison.tsx";

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
            <Route path="/auction" element={<PhysicalAnalysis />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
