import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStockStore } from "@/stores/useStockStore";
import { useAuthStore } from "@/stores/useAuthStore";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
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
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    console.log('🚀 App: Initializing...');
    checkAuth(); // Restore session
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
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/support" element={<Support />} />
        <Route path="/invite" element={<InviteFriends />} />
        <Route path="/shortcuts" element={<KeyboardShortcuts />} />
        <Route path="/manual" element={<UserManual />} />

        {/* Protected Routes - Require Authentication */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/stock/:symbol" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
        <Route path="/index/:symbol" element={<ProtectedRoute><IndexDetail /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><PriceAlertsPage /></ProtectedRoute>} />
        <Route path="/technical-analysis" element={<ProtectedRoute><TechnicalAnalysis /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><StockEvents /></ProtectedRoute>} />
        <Route path="/advanced-trading" element={<ProtectedRoute><AdvancedTradingPage /></ProtectedRoute>} />
        <Route path="/advanced/heatmaps" element={<ProtectedRoute><HeatMaps /></ProtectedRoute>} />
        <Route path="/advanced/sectors" element={<ProtectedRoute><Sectors /></ProtectedRoute>} />
        <Route path="/learn/patterns" element={<ProtectedRoute><Patterns /></ProtectedRoute>} />
        <Route path="/learn/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />

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
