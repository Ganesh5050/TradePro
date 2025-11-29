import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStockStore } from "@/stores/useStockStore";
import Navbar from "./components/layout/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import StockDetail from "./pages/StockDetail";
import IndexDetail from "./pages/IndexDetail";
import Portfolio from "./pages/Portfolio";
import Learn from "./pages/Learn";
import Leaderboard from "./pages/Leaderboard";
import News from "./pages/News";
import Watchlist from "./pages/Watchlist";
import Settings from "./pages/Settings";
import PriceAlertsPage from "./pages/PriceAlertsPage";
import TechnicalAnalysis from "./pages/TechnicalAnalysis";
import StockEvents from "./pages/StockEvents";
import AdvancedTradingPage from "./pages/AdvancedTradingPage";
import HeatMaps from "./pages/HeatMaps";
import Sectors from "./pages/Sectors";
import Patterns from "./pages/learn/Patterns";
import Recommendations from "./pages/learn/Recommendations";
import Rules from "./pages/Rules";
import Support from "./pages/Support";
import InviteFriends from "./pages/InviteFriends";
import KeyboardShortcuts from "./pages/KeyboardShortcuts";
import UserManual from "./pages/UserManual";
import Transactions from "./pages/Transactions";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { fetchStocks, fetchIndices } = useStockStore();

  // Fetch all data once on app startup and keep refreshing
  useEffect(() => {
    console.log('🚀 App: Loading all stocks and indices data on startup...');
    fetchStocks();
    fetchIndices();

    // Auto-refresh every 3.5 seconds for live data
    const interval = setInterval(() => {
      fetchStocks();
      fetchIndices();
    }, 3500); // 3.5 seconds for faster live updates

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stock/:symbol" element={<StockDetail />} />
        <Route path="/index/:symbol" element={<IndexDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/news" element={<News />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/alerts" element={<PriceAlertsPage />} />
        <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
        <Route path="/events" element={<StockEvents />} />
        <Route path="/advanced-trading" element={<AdvancedTradingPage />} />
        <Route path="/advanced/heatmaps" element={<HeatMaps />} />
        <Route path="/advanced/sectors" element={<Sectors />} />
        <Route path="/learn/patterns" element={<Patterns />} />
        <Route path="/learn/recommendations" element={<Recommendations />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<InviteFriends />} />
        <Route path="/shortcuts" element={<KeyboardShortcuts />} />
        <Route path="/manual" element={<UserManual />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
