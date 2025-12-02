import { useEffect } from 'react';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useStockStore } from '@/stores/useStockStore';
// import { useAuthStore } from '@/stores/useAuthStore'; // Temporarily disabled
import { useNavigate } from 'react-router-dom';
import StockCard from '@/components/trading/StockCard';
import { Button } from '@/components/ui/button';

export default function Watchlist() {
  const { watchlist, fetchWatchlist } = useWatchlistStore();
  const { stocks, fetchStocks } = useStockStore();
  // Mock values to replace useAuthStore while it's broken
  const user = { id: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
  const isAuthenticated = true;
  // const { user, isAuthenticated } = useAuthStore(); // Temporarily disabled
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchWatchlist(user.id);
      fetchStocks();
    }
  }, [user, isAuthenticated]);

  const watchlistStocks = stocks.filter(s => watchlist.includes(s.symbol));

  return (
    <div className="container mx-auto p-6 space-y-6" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'white' }}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <Button onClick={() => navigate('/dashboard')}>
          Browse Stocks
        </Button>
      </div>

      {watchlistStocks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
          <Button onClick={() => navigate('/dashboard')}>
            Add Stocks to Watchlist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {watchlistStocks.map(stock => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
