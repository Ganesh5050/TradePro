// Vercel serverless function for stocks API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url } = req;
    
    // Mock stocks data
    const mockStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24, volume: 52783400, marketCap: 2721000000000 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -0.85, changePercent: -0.61, volume: 28456700, marketCap: 1740000000000 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 4.32, changePercent: 1.15, volume: 23456700, marketCap: 2810000000000 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.78, change: 1.92, changePercent: 1.33, volume: 45678900, marketCap: 1500000000000 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.68, change: -3.21, changePercent: -1.30, volume: 118234500, marketCap: 770000000000 },
      { symbol: 'META', name: 'Meta Platforms', price: 326.49, change: 5.67, changePercent: 1.77, volume: 15678900, marketCap: 830000000000 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 468.35, change: 8.21, changePercent: 1.78, volume: 41234500, marketCap: 1150000000000 },
      { symbol: 'JPM', name: 'JPMorgan Chase', price: 148.92, change: -0.43, changePercent: -0.29, volume: 8234567, marketCap: 430000000000 },
      { symbol: 'V', name: 'Visa Inc.', price: 249.63, change: 1.85, changePercent: 0.75, volume: 5678900, marketCap: 500000000000 },
      { symbol: 'JNJ', name: 'Johnson & Johnson', price: 157.41, change: 0.92, changePercent: 0.59, volume: 4567890, marketCap: 390000000000 }
    ];

    // Mock indices data
    const mockIndices = [
      { symbol: '^GSPC', name: 'S&P 500', price: 4503.65, change: 12.45, changePercent: 0.28 },
      { symbol: '^DJI', name: 'Dow Jones', price: 35234.78, change: 156.32, changePercent: 0.45 },
      { symbol: '^IXIC', name: 'NASDAQ', price: 14234.56, change: -23.67, changePercent: -0.17 },
      { symbol: '^RUT', name: 'Russell 2000', price: 1987.45, change: 8.92, changePercent: 0.45 },
      { symbol: '^VIX', name: 'VIX', price: 14.56, change: -0.23, changePercent: -1.56 }
    ];

    // Route handling
    if (url.includes('/api/stocks/all')) {
      return res.status(200).json(mockStocks);
    } else if (url.includes('/api/stocks/indices/all')) {
      return res.status(200).json(mockIndices);
    } else if (url.includes('/api/stocks/search')) {
      const query = req.query.q || '';
      const filtered = mockStocks.filter(s => 
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      return res.status(200).json(filtered);
    } else if (url.includes('/api/stocks/')) {
      const symbol = url.split('/').pop();
      const stock = mockStocks.find(s => s.symbol === symbol.toUpperCase());
      if (stock) {
        return res.status(200).json(stock);
      } else {
        return res.status(404).json({ error: 'Stock not found' });
      }
    } else {
      // Default route - return all stocks
      return res.status(200).json(mockStocks);
    }

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
