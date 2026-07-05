import { useEffect, useState } from 'react';
import { useStockStore } from '@/stores/useStockStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePortfolioStore } from '@/stores/usePortfolioStore';
import { Input } from '@/components/ui/input';
import StockCard from '@/components/trading/StockCard';
import PortfolioSummary from '@/components/trading/PortfolioSummary';
import { Search, Filter, ChevronDown, ArrowUp, ArrowDown, Cpu, Play, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { runStressTest, StressTestResult } from '@/utils/stress-test-simulation';
import { googleSheetsService } from '@/services/googleSheets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { stocks, indices, fetchStocks, fetchIndices, isLoading } = useStockStore();
  const { user, isAuthenticated } = useAuthStore();
  const { balance, holdings, fetchPortfolio } = usePortfolioStore();
  const [search, setSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [indicesFilter, setIndicesFilter] = useState<'neutral' | 'desc' | 'asc'>('neutral');
  const [stocksFilter, setStocksFilter] = useState<'alpha-asc' | 'alpha-desc' | 'high' | 'low'>('alpha-asc');

  // System Performance Monitor state
  const [showPerfMonitor, setShowPerfMonitor] = useState(false);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<StressTestResult | null>(null);

  // Fetch portfolio data when user is authenticated
  useEffect(() => {
    if (user && isAuthenticated) {
      fetchPortfolio(user.id);
    }
  }, [user, isAuthenticated]);

  // Auto-refresh portfolio every 2 seconds
  useEffect(() => {
    if (!user || !isAuthenticated) return;
    
    const interval = setInterval(() => {
      fetchPortfolio(user.id);
    }, 2000);

    return () => clearInterval(interval);
  }, [user, isAuthenticated]);

  // Filter and sort stocks
  const filtered = (stocks || [])
    .filter(s => 
      s.price && s.price > 0 && // Only show stocks with valid price
      (s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (stocksFilter === 'alpha-asc') {
        return a.symbol.localeCompare(b.symbol); // A-Z
      } else if (stocksFilter === 'alpha-desc') {
        return b.symbol.localeCompare(a.symbol); // Z-A
      } else if (stocksFilter === 'high') {
        return b.changePercent - a.changePercent; // Highest change first
      } else if (stocksFilter === 'low') {
        return a.changePercent - b.changePercent; // Lowest change first
      }
      return 0;
    });

  // Sort indices based on filter - NIFTY 50 always first
  const sortedIndices = (() => {
    const allIndices = [...(indices || [])];
    
    // Find NIFTY 50
    const nifty50Index = allIndices.findIndex(idx => 
      (idx.Symbol || idx.symbol || '').includes('NIFTY_50') || 
      (idx.Symbol || idx.symbol || '').includes('NIFTY 50')
    );
    
    let nifty50 = null;
    let restIndices = allIndices;
    
    // Separate NIFTY 50 from rest
    if (nifty50Index !== -1) {
      nifty50 = allIndices[nifty50Index];
      restIndices = allIndices.filter((_, idx) => idx !== nifty50Index);
    }
    
    // Sort rest of indices based on filter
    if (indicesFilter === 'neutral') {
      // Keep original order - do nothing
    } else if (indicesFilter === 'desc') {
      // High to low
      restIndices.sort((a, b) => {
        const changeA = parseFloat(a.Change || a.change || 0);
        const changeB = parseFloat(b.Change || b.change || 0);
        return changeB - changeA;
      });
    } else if (indicesFilter === 'asc') {
      // Low to high
      restIndices.sort((a, b) => {
        const changeA = parseFloat(a.Change || a.change || 0);
        const changeB = parseFloat(b.Change || b.change || 0);
        return changeA - changeB;
      });
    }
    
    // Return NIFTY 50 first, then sorted rest
    return nifty50 ? [nifty50, ...restIndices] : restIndices;
  })();

  // Calculate portfolio metrics
  const totalInvested = holdings.reduce((sum, h) => sum + (h.avg_price * h.quantity), 0);
  const currentValue = holdings.reduce((sum, h) => {
    const stock = stocks?.find(s => s.symbol === h.symbol);
    return sum + ((stock?.price || h.avg_price) * h.quantity);
  }, 0);
  const profitLoss = currentValue - totalInvested;
  const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  const handleRunStressTest = async () => {
    setIsRunningTest(true);
    setTestLog([]);
    setTestResult(null);
    try {
      const result = await runStressTest((msg) => {
        setTestLog(prev => [...prev, msg]);
      });
      setTestResult(result);
    } catch (e) {
      setTestLog(prev => [...prev, `❌ Test error: ${e}`]);
    } finally {
      setIsRunningTest(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      paddingTop: '100px',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '32px 24px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
            Market Dashboard
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            {isAuthenticated ? `Welcome back, ${user?.email || 'Trader'}` : 'Browse and trade stocks'}
          </p>
        </div>

        {/* ===== SYSTEM PERFORMANCE MONITOR WIDGET ===== */}
        <div className="mb-6">
          <button
            onClick={() => setShowPerfMonitor(v => !v)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Cpu className="w-4 h-4" />
            System Performance Monitor
            <ChevronRight className={`w-4 h-4 transition-transform ${showPerfMonitor ? 'rotate-90' : ''}`} />
          </button>
          {showPerfMonitor && (
            <div className="mt-3 p-4 bg-gray-950 rounded-2xl border border-gray-800 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-gray-200">DAG State Reconciliation Stress Test</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Validates that Zustand state updates maintain 60 FPS under peak data load ({stocks.length} stocks)</p>
                </div>
                <button
                  onClick={handleRunStressTest}
                  disabled={isRunningTest}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-full transition-colors flex-shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isRunningTest ? 'Running...' : 'Run Test'}
                </button>
              </div>

              {/* Live log */}
              {testLog.length > 0 && (
                <div className="bg-black/40 p-3 rounded-lg font-mono text-xs text-gray-400 space-y-0.5 max-h-28 overflow-y-auto">
                  {testLog.map((line, i) => <div key={i}>{line}</div>)}
                </div>
              )}

              {/* Results */}
              {testResult && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Stocks Updated', value: testResult.totalStocksUpdated.toLocaleString(), color: 'text-white' },
                    { label: 'Avg FPS', value: `${testResult.avgFps} FPS`, color: testResult.avgFps >= 55 ? 'text-green-400' : 'text-yellow-400' },
                    { label: 'Min FPS', value: `${testResult.minFps} FPS`, color: testResult.minFps >= 30 ? 'text-green-400' : 'text-red-400' },
                    { label: 'Dropped Frames', value: `${testResult.droppedFrames}`, color: testResult.droppedFrames === 0 ? 'text-green-400' : 'text-yellow-400' },
                    { label: 'Total Duration', value: `${testResult.durationMs} ms`, color: 'text-white' },
                    { label: 'Pipeline Stats', value: `${googleSheetsService.getStats().successRatePercent}% success`, color: 'text-green-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider">{label}</p>
                      <p className={`font-bold font-mono text-sm mt-0.5 ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              )}
              {testResult && (
                <p className="text-[10px] text-gray-600 italic text-right">
                  Screenshot these results for the paper's "DAG State Reconciliation" validation section.
                </p>
              )}
            </div>
          )}
        </div>
        {/* ===================================================== */}

        {/* Portfolio Summary - Only show if authenticated */}
        {isAuthenticated && (
          <div className="mb-8">
            <PortfolioSummary
              balance={balance}
              totalInvested={totalInvested}
              currentValue={currentValue}
              profitLoss={profitLoss}
              profitLossPercent={profitLossPercent}
            />
          </div>
        )}

        {/* Market Indices - ALL INDICES */}
        {indices && indices.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Market Indices ({indices.length})</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-1.5 px-4 py-2 h-10 font-medium text-sm whitespace-nowrap transition-all"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '100px',
                      boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
                      border: 'none',
                      color: 'black'
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 bg-white border border-gray-200 shadow-lg">
                  <DropdownMenuItem 
                    onClick={() => setIndicesFilter('neutral')}
                    className={`cursor-pointer ${indicesFilter === 'neutral' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      Neutral
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setIndicesFilter('desc')}
                    className={`cursor-pointer ${indicesFilter === 'desc' ? 'bg-green-50 text-green-700 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      High to Low %
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setIndicesFilter('asc')}
                    className={`cursor-pointer ${indicesFilter === 'asc' ? 'bg-red-50 text-red-700 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Low to High %
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {sortedIndices.map((index: any, idx: number) => {
                const change = parseFloat(index.Change || index.change || 0);
                const isPositive = change >= 0;
                const indexSymbol = index.Symbol || index.symbol || 'INDEX';
                return (
                  <Card 
                    key={idx} 
                    className="bg-white border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => window.location.href = `/index/${indexSymbol}`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-gray-700">
                        {indexSymbol}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-900">
                        {parseFloat(index.Price || index.LTP || index.price || 0).toFixed(2)}
                      </div>
                      <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{change.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filter for Stocks */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative flex-1" style={{ maxWidth: '1300px' }}>
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search stocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-14 text-gray-900 placeholder:text-gray-400 text-base"
              style={{
                backgroundColor: 'white',
                borderRadius: '100px',
                boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
                border: 'none',
                outline: 'none',
                fontSize: '16px'
              }}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-1.5 px-4 py-2 h-10 font-medium text-sm whitespace-nowrap transition-all"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '100px',
                  boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
                  border: 'none',
                  color: 'black'
                }}
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
              <DropdownMenuItem 
                onClick={() => setStocksFilter('alpha-asc')}
                className={`cursor-pointer flex items-center justify-between ${stocksFilter === 'alpha-asc' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Alphabetical
                </span>
                <ArrowUp className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStocksFilter('alpha-desc')}
                className={`cursor-pointer flex items-center justify-between ${stocksFilter === 'alpha-desc' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  Alphabetical
                </span>
                <ArrowDown className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStocksFilter('high')}
                className={`cursor-pointer ${stocksFilter === 'high' ? 'bg-green-50 text-green-700 font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  High
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setStocksFilter('low')}
                className={`cursor-pointer ${stocksFilter === 'low' ? 'bg-red-50 text-red-700 font-medium' : 'hover:bg-gray-50'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Low
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* All Stocks Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {search ? `Search Results (${filtered.length})` : `All Stocks (${stocks?.length || 0})`}
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="text-gray-600 mt-4">Loading stocks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-600 text-lg">No stocks found</p>
              <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(stock => (
                <div key={stock.symbol} onClick={() => setSelectedStock(stock)}>
                  <StockCard stock={stock} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
