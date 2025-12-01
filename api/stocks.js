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
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.68, change: -3.21, changePercent: -1.30, volume: 98765400, marketCap: 770000000000 },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 325.67, change: 5.43, changePercent: 1.69, volume: 19876500, marketCap: 830000000000 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 456.78, change: 8.90, changePercent: 1.99, volume: 34567800, marketCap: 1120000000000 },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 445.23, change: -2.34, changePercent: -0.52, volume: 12345600, marketCap: 197000000000 }
    ];

    const mockIndices = [
      { symbol: '^GSPC', name: 'S&P 500', value: 4514.02, change: 12.45, changePercent: 0.28, volume: 0 },
      { symbol: '^DJI', name: 'Dow Jones', value: 35456.78, change: 156.23, changePercent: 0.44, volume: 0 },
      { symbol: '^IXIC', name: 'NASDAQ', value: 14234.56, change: -45.67, changePercent: -0.32, volume: 0 }
    ];

    if (url.includes('/stocks/all')) {
      return res.status(200).json(mockStocks);
    }
    
    if (url.includes('/stocks/indices/all')) {
      return res.status(200).json(mockIndices);
    }

    if (url.includes('/stocks/search')) {
      const query = req.query.q || '';
      const filtered = mockStocks.filter(s => 
        s.symbol.toLowerCase().includes(query.toLowerCase()) ||
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      return res.status(200).json(filtered);
    }

    if (url.includes('/stocks/') && !url.includes('/all') && !url.includes('/search') && !url.includes('/indices')) {
      const symbol = url.split('/stocks/')[1].split('?')[0];
      const stock = mockStocks.find(s => s.symbol === symbol);
      if (stock) {
        return res.status(200).json(stock);
      } else {
        return res.status(404).json({ error: 'Stock not found' });
      }
    }

    return res.status(404).json({ error: 'Endpoint not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
