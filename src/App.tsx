
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Map from "./pages/Map";
import NotFound from "./pages/NotFound";
import Dashboard from "./components/Dashboard";

// Initialize Capacitor plugins
const initializeCapacitorPlugins = async () => {
  if (window.Capacitor) {
    try {
      // Any Capacitor plugin initialization would go here
      console.log("Capacitor plugins initialized");
    } catch (error) {
      console.error("Error initializing Capacitor plugins:", error);
    }
  }
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeCapacitorPlugins();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/map" 
              element={
                <Dashboard>
                  <Map />
                </Dashboard>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
