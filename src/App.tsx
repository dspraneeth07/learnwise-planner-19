
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StudyProvider } from "./context/StudyContext";
import Index from "./pages/Index";
import StudyDetails from "./pages/StudyDetails";
import GeneratedPlan from "./pages/GeneratedPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StudyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/study-details" element={<StudyDetails />} />
            <Route path="/generated-plan" element={<GeneratedPlan />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StudyProvider>
  </QueryClientProvider>
);

export default App;
