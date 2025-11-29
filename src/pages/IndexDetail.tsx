import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStockStore } from '@/stores/useStockStore';

const IndexDetail = () => {
  const { symbol } = useParams();
  const { indices, fetchIndices } = useStockStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Indices are already being fetched in App.tsx
  // Just set loading to false once we have data
  useEffect(() => {
    if (indices.length > 0) {
      setIsLoading(false);
    }
  }, [indices.length]);
  
  // Find the index from the store
  const indexData = indices.find(idx => {
    const idxSymbol = idx.Symbol || idx.symbol || '';
    console.log('🔍 Comparing:', idxSymbol, 'with', symbol);
    return idxSymbol === symbol;
  });

  console.log('🔍 Looking for index:', symbol);
  console.log('📊 Available indices:', indices.length);
  console.log('📊 Available symbols:', indices.map(i => i.Symbol || i.symbol));
  console.log('✅ Found index data:', indexData);

  // Show loading if indices are not loaded yet
  if (indices.length === 0 || isLoading) {
    return (
      <div className="min-h-screen pb-12 px-4" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="text-gray-600 mt-4">Loading index data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only show "not found" if we have indices loaded but can't find this one
  if (!indexData && indices.length > 0) {
    return (
      <div className="min-h-screen pb-12 px-4" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Index not found: {symbol}</p>
            <p className="text-gray-400 text-sm mt-2">The index "{symbol}" could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Safe values with defaults
  const indexName = indexData?.Symbol || indexData?.symbol || symbol || 'INDEX';
  const indexValue = parseFloat(indexData?.Price || indexData?.price || 0);
  const indexChange = parseFloat(indexData?.Change || indexData?.change || 0);
  const indexHigh = parseFloat(indexData?.High || indexData?.high || 0);
  const indexLow = parseFloat(indexData?.Low || indexData?.low || 0);
  const indexOpen = parseFloat(indexData?.Open || indexData?.open || 0);
  const indexChangePercent = indexValue > 0 ? (indexChange / indexValue) * 100 : 0;

  const isPositive = indexChange > 0;

  return (
    <div className="min-h-screen pb-12 px-4" style={{ paddingTop: '120px', backgroundColor: 'white' }}>
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl">{indexName}</CardTitle>
                  <p className="text-muted-foreground">Indian Stock Index</p>
                </div>
                <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="text-3xl font-bold">{indexValue.toFixed(2)}</div>
                  <div className="flex items-center gap-2 justify-end">
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span>
                      {isPositive ? '+' : ''}{indexChange.toFixed(2)} ({isPositive ? '+' : ''}{indexChangePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Open</p>
                  <p className="font-semibold">{indexOpen.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">High</p>
                  <p className="font-semibold text-green-600">{indexHigh.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Low</p>
                  <p className="font-semibold text-red-600">{indexLow.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                    <span className="font-semibold">Live</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chart Section */}
          <Card>
            <CardHeader>
              <CardTitle>Index Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                Chart visualization will be integrated here
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default IndexDetail;
