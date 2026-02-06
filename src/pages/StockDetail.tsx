import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStockStore } from '@/stores/useStockStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StockChart from '@/components/trading/StockChart';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const { selectedStock, getStock, isLoading, stocks, fetchStocks } = useStockStore();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore();
  const { user, isAuthenticated } = useAuthStore();
  const { buyStock, sellStock, holdings, fetchPortfolio } = usePortfolioStore();

  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY EARLY RETURNS
  const [showBuySell, setShowBuySell] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [isProcessing, setIsProcessing] = useState(false);

  // Get stock when symbol changes or stocks are loaded (stocks are fetched in App.tsx)
  useEffect(() => {
    if (symbol && stocks.length > 0) {
      getStock(symbol);
    }
  }, [symbol, stocks.length]);

  // Fetch portfolio to check holdings
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchPortfolio(user.id);
    }
  }, [user, isAuthenticated]);

  // Show loading if stocks are not loaded yet
  if (stocks.length === 0) {
    return (
      <div className="container mx-auto p-6" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'white' }}>
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600 mt-4">Loading stock data...</p>
        </div>
      </div>
    );
  }

  // Show loading while getting the specific stock
  if (!selectedStock) {
    return (
      <div className="container mx-auto p-6" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'white' }}>
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600 mt-4">Loading {symbol}...</p>
        </div>
      </div>
    );
  }

  const isPositive = selectedStock.changePercent >= 0;
  const inWatchlist = isInWatchlist(selectedStock.symbol);

  // Check if user has this stock in portfolio
  const userHolding = holdings.find(h => h.symbol === selectedStock.symbol);
  const availableQuantity = userHolding?.quantity || 0;

  const handleBuy = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to trade');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setIsProcessing(true);
    try {
      await buyStock(user.id, selectedStock.symbol, selectedStock.name, quantity, stockPrice);
      toast.success(`Successfully bought ${quantity} shares of ${selectedStock.symbol} at ₹${stockPrice.toFixed(2)}`);
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to buy stock');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSell = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to trade');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    // Check if user has the stock
    if (!userHolding) {
      toast.error(`You don't own any shares of ${selectedStock.symbol}. Buy some first!`);
      return;
    }

    // Check if user has enough quantity
    if (quantity > availableQuantity) {
      toast.error(`Insufficient shares! You only have ${availableQuantity} shares of ${selectedStock.symbol}`);
      return;
    }

    setIsProcessing(true);
    try {
      await sellStock(user.id, selectedStock.symbol, selectedStock.name, quantity, stockPrice);
      toast.success(`Successfully sold ${quantity} shares of ${selectedStock.symbol} at ₹${stockPrice.toFixed(2)}`);
      setQuantity(1);
    } catch (error: any) {
      toast.error(error.message || 'Failed to sell stock');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWatchlist = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login first');
      return;
    }

    try {
      if (inWatchlist) {
        await removeFromWatchlist(user.id, selectedStock.symbol);
        toast.success('Removed from watchlist');
      } else {
        await addToWatchlist(user.id, selectedStock.symbol);
        toast.success('Added to watchlist');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update watchlist');
    }
  };

  // Safe values with defaults
  const stockPrice = selectedStock.price || 0;
  const stockChange = selectedStock.change || 0;
  const stockChangePercent = selectedStock.changePercent || 0;
  const stockVolume = selectedStock.volume || 0;
  const stockHigh = selectedStock.high || 0;
  const stockLow = selectedStock.low || 0;
  const stockOpen = selectedStock.open || 0;
  const stockClose = selectedStock.close || 0;
  const stockMarketCap = selectedStock.marketCap || 0;
  const stockSector = selectedStock.sector || 'N/A';

  return (
    <div className="container mx-auto p-6" style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Stock Name Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900">{selectedStock.symbol}</h1>
        <p className="text-xl text-gray-600">{selectedStock.name || 'Stock Name'}</p>
      </div>

      {/* Main Layout: Chart Left, Trading Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: Chart Preview */}
        <div className="lg:col-span-2">
          <StockChart symbol={selectedStock.symbol} />
        </div>

        {/* Right: Trading Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Trade {selectedStock.symbol}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Price */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Current Price</p>
                <p className="text-3xl font-bold text-gray-900">₹{stockPrice.toFixed(2)}</p>
                <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{stockChange.toFixed(2)} ({isPositive ? '+' : ''}{stockChangePercent.toFixed(2)}%)
                </p>
              </div>

              {/* Buy/Sell Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTradeType('buy')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${tradeType === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setTradeType('sell')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${tradeType === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Sell
                </button>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Shares)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {tradeType === 'sell' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {availableQuantity} shares
                  </p>
                )}
              </div>

              {/* Total Amount */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹{(stockPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {tradeType === 'buy' ? (
                <button
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'rgb(22, 163, 74)',
                    boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)'
                  }}
                  onClick={handleBuy}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Buy ${quantity} ${quantity === 1 ? 'Share' : 'Shares'}`}
                </button>
              ) : (
                <button
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'rgb(220, 38, 38)',
                    boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)'
                  }}
                  onClick={handleSell}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Sell ${quantity} ${quantity === 1 ? 'Share' : 'Shares'}`}
                </button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stock Data Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stock Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">{stockVolume.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">52W High</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">₹{stockHigh.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">52W Low</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">₹{stockLow.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">₹{stockOpen.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Close</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">₹{stockClose.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900">₹{stockMarketCap} Cr</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Sector</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-gray-900">{stockSector}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Change</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}₹{stockChange.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
