import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { useStockStore } from '@/stores/useStockStore';
// import { useAuthStore } from '@/stores/useAuthStore'; // Temporarily disabled
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown } from 'lucide-react';
import PortfolioPerformanceChart from '@/components/trading/PortfolioPerformanceChart';
import SellModal from '@/components/trading/SellModal';

export default function Portfolio() {
  const { holdings, balance, fetchPortfolio } = usePortfolioStore();
  const { stocks, fetchStocks } = useStockStore();
  // Mock values to replace useAuthStore while it's broken
  const user = { id: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
  const isAuthenticated = true;
  // const { user, isAuthenticated } = useAuthStore(); // Temporarily disabled
  const navigate = useNavigate();
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    stockName: string;
    quantity: number;
    price: number;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchPortfolio(user.id);
      fetchStocks();
    }
  }, [user, isAuthenticated]);

  // Auto-refresh portfolio every 2 seconds to show latest holdings
  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchPortfolio(user.id);
    }, 2000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  // Calculate metrics with live stock prices
  const enrichedHoldings = holdings.map(holding => {
    const liveStock = stocks.find(s => s.symbol === holding.symbol);
    const ltp = liveStock?.price || holding.avg_price;
    const invested = holding.avg_price * holding.quantity;
    const currentValue = ltp * holding.quantity;
    const pl = currentValue - invested;
    const plPercent = invested > 0 ? (pl / invested) * 100 : 0;
    const dayChange = liveStock?.changePercent || 0;
    
    return {
      ...holding,
      ltp,
      invested,
      currentValue,
      pl,
      plPercent,
      dayChange,
    };
  });

  const totalInvested = enrichedHoldings.reduce((sum, h) => sum + h.invested, 0);
  const totalCurrentValue = enrichedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPL = totalCurrentValue - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
  const dayPL = enrichedHoldings.reduce((sum, h) => sum + (h.currentValue * h.dayChange / 100), 0);
  const dayPLPercent = totalCurrentValue > 0 ? (dayPL / totalCurrentValue) * 100 : 0;

  // Generate colors for allocation chart
  const colors = [
    '#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#6366f1',
    '#14b8a6', '#10b981', '#84cc16', '#eab308', '#f59e0b',
    '#f97316', '#ef4444', '#a855f7', '#22d3ee', '#facc15'
  ];

  return (
    <div className="min-h-screen" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Holdings ({holdings.length})</h1>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Total Investment</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalInvested.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalCurrentValue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Day's P&L</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${dayPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dayPL >= 0 ? '+' : ''}₹{dayPL.toFixed(2)}
                </p>
                <span className={`text-sm ${dayPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dayPL >= 0 ? '+' : ''}{dayPLPercent.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Total P&L</p>
              <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPL >= 0 ? '+' : ''}₹{totalPL.toFixed(2)}
                </p>
                <span className={`text-sm ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Performance Chart */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center justify-between">
              <span>Portfolio Performance</span>
              <div className="flex items-center gap-4 text-sm font-normal">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600">Invested: ₹{totalInvested.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${totalPL >= 0 ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  <span className={totalPL >= 0 ? 'text-green-600' : 'text-red-600'}>
                    Current: ₹{totalCurrentValue.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {enrichedHoldings.length > 0 ? (
                <PortfolioPerformanceChart 
                  totalInvested={totalInvested}
                  currentValue={totalCurrentValue}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No portfolio data yet</p>
                    <p className="text-sm text-gray-500 mt-1">Start trading to see your portfolio performance</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Holdings Table */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">Instrument</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Qty</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Avg cost</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">LTP</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Investment</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Current value</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">P&L</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Net chg</TableHead>
                    <TableHead className="text-right text-gray-700 font-semibold">Day chg</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrichedHoldings.length === 0 ? (
                    <TableRow className="border-gray-200">
                      <TableCell colSpan={9} className="text-center text-gray-600 py-12">
                        No holdings yet. Start trading to build your portfolio!
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {enrichedHoldings.map((holding, idx) => {
                        const liveStock = stocks.find(s => s.symbol === holding.symbol);
                        const stockName = liveStock?.name || holding.symbol;
                        
                        return (
                          <TableRow 
                            key={holding.symbol} 
                            className="border-gray-200 hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedStock({
                              symbol: holding.symbol,
                              stockName: stockName,
                              quantity: holding.quantity,
                              price: holding.ltp
                            })}
                          >
                            <TableCell className="font-medium text-gray-900">{holding.symbol}</TableCell>
                            <TableCell className="text-right text-gray-900">{holding.quantity}</TableCell>
                            <TableCell className="text-right text-gray-900">{holding.avg_price.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-gray-900">{holding.ltp.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-gray-900">{holding.invested.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-gray-900">{holding.currentValue.toFixed(2)}</TableCell>
                            <TableCell className={`text-right font-medium ${holding.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding.pl >= 0 ? '+' : ''}₹{holding.pl.toFixed(2)}
                            </TableCell>
                            <TableCell className={`text-right ${holding.plPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding.plPercent >= 0 ? '+' : ''}{holding.plPercent.toFixed(2)}%
                            </TableCell>
                            <TableCell className={`text-right ${holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding.dayChange >= 0 ? '+' : ''}{holding.dayChange.toFixed(2)}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {/* Total Row */}
                      <TableRow className="border-gray-200 bg-gray-100 font-bold">
                        <TableCell className="text-gray-900">Total</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right text-gray-900">{totalInvested.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-gray-900">{totalCurrentValue.toFixed(2)}</TableCell>
                        <TableCell className={`text-right ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalPL >= 0 ? '+' : ''}{totalPL.toFixed(2)}
                        </TableCell>
                        <TableCell className={`text-right ${totalPLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
                        </TableCell>
                        <TableCell className={`text-right ${dayPLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {dayPLPercent >= 0 ? '+' : ''}{dayPLPercent.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Allocation Bar Chart */}
        {enrichedHoldings.length > 0 && (
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 font-semibold">Portfolio Allocation</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>● Current value</span>
                  </div>
                </div>
                
                {/* Colorful Bar Chart */}
                <div className="h-12 flex rounded-lg overflow-hidden">
                  {enrichedHoldings.map((holding, idx) => {
                    const percentage = (holding.currentValue / totalCurrentValue) * 100;
                    return (
                      <div
                        key={holding.symbol}
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: colors[idx % colors.length],
                        }}
                        className="relative group"
                        title={`${holding.symbol}: ${percentage.toFixed(2)}%`}
                      >
                        {percentage > 5 && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                            {holding.symbol}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="text-xs text-gray-600 font-medium">
                  ₹{totalCurrentValue.toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sell Modal */}
        {selectedStock && (
          <SellModal
            symbol={selectedStock.symbol}
            stockName={selectedStock.stockName}
            availableQuantity={selectedStock.quantity}
            currentPrice={selectedStock.price}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </div>
    </div>
  );
}
