import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SymptomChecker from "./components/SymptomChecker";
import YogaModule from "./components/YogaModule";
import PoseDetection from "./components/PoseDetection";
import NutritionModule from "./components/NutritionModule";
import CycleTracker from "./components/CycleTracker";
import StressManagement from "./components/StressManagement";
import EmergencySupport from "./components/EmergencySupport";
import YogaCamera from "./pages/YogaCamera";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/yoga" element={<YogaModule />} />
          <Route path="/pose-detection" element={<PoseDetection />} />
          <Route path="/nutrition" element={<NutritionModule />} />
          <Route path="/cycle-tracker" element={<CycleTracker />} />
          <Route path="/stress-management" element={<StressManagement />} />
          <Route path="/emergency" element={<EmergencySupport />} />
          <Route path="/yoga-camera" element={<YogaCamera />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
