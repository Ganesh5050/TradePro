import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Cache for stock data
let stocksCache: any[] = [];
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

async function fetchStocksData() {
  const now = Date.now();
  if (now - lastFetch < CACHE_DURATION && stocksCache.length > 0) {
    return stocksCache;
  }

  try {
    const sheetUrl = process.env.GOOGLE_STOCKS_SHEET_URL || 'https://docs.google.com/spreadsheets/d/17FYJ4BMGpYFgVno379vCZHOkmqE5_gVBipy6ZYxg4c4/export?format=csv&gid=0';
    const response = await fetch(sheetUrl);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    stocksCache = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const stock: any = {};
        headers.forEach((header, index) => {
          stock[header] = values[index]?.trim() || '';
        });
        return stock;
      })
      .filter(stock => stock.Symbol);
    
    lastFetch = now;
    return stocksCache;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return stocksCache;
  }
}

app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await fetchStocksData();
    res.json({ success: true, count: stocks.length, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stocks' });
  }
});

app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const stocks = await fetchStocksData();
    const stock = stocks.find(s => s.Symbol === req.params.symbol);
    
    if (stock) {
      res.json({ success: true, data: stock });
    } else {
      res.status(404).json({ success: false, error: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stock' });
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const query = (req.query.q as string || '').toLowerCase();
    const stocks = await fetchStocksData();
    
    const results = stocks
      .filter(s => 
        s.Symbol?.toLowerCase().includes(query) || 
        s.Name?.toLowerCase().includes(query)
      )
      .slice(0, 20);
    
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

app.listen(PORT, () => {
  console.log(`📈 Stocks Server running on port ${PORT}`);
});
