// Vercel serverless function for /api/stocks/indices/all
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Mock indices data
    const mockIndices = [
      { symbol: '^GSPC', name: 'S&P 500', price: 4503.65, change: 12.45, changePercent: 0.28 },
      { symbol: '^DJI', name: 'Dow Jones', price: 35234.78, change: 156.32, changePercent: 0.45 },
      { symbol: '^IXIC', name: 'NASDAQ', price: 14234.56, change: -23.67, changePercent: -0.17 },
      { symbol: '^RUT', name: 'Russell 2000', price: 1987.45, change: 8.92, changePercent: 0.45 },
      { symbol: '^VIX', name: 'VIX', price: 14.56, change: -0.23, changePercent: -1.56 }
    ];

    return res.status(200).json({
      success: true,
      data: mockIndices
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
