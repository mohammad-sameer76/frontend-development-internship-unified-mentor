import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CollegeDashboard from "./pages/CollegeDashboard";
import Colleges from "./pages/Colleges";
import CollegeDetail from "./pages/CollegeDetail";
import AptitudeTest from "./pages/AptitudeTest";
import CollegeAuth from "./pages/CollegeAuth";
import CareerSelection from "./pages/CareerSelection";
import LocationSelection from "./pages/LocationSelection";
import CollegeRegistration from "./pages/CollegeRegistration";
import StudentProfile from "./pages/StudentProfile";
import TestCompletion from "./pages/TestCompletion";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/college-auth" element={<CollegeAuth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/college-dashboard" element={<CollegeDashboard />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/college/:id" element={<CollegeDetail />} />
            <Route path="/college/:id/register" element={<CollegeRegistration />} />
            <Route path="/career-selection" element={<CareerSelection />} />
            <Route path="/location-selection" element={<LocationSelection />} />
            <Route path="/test" element={<AptitudeTest />} />
            <Route path="/test-completion" element={<TestCompletion />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/applications" element={<Applications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
