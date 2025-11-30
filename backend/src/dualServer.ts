import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:8080',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Cache
let stocksCache: any[] = [];
let indicesCache: any[] = [];
let lastStocksFetch = 0;
let lastIndicesFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Fetch Stocks from Google Sheets
async function fetchStocksData() {
  const now = Date.now();
  if (now - lastStocksFetch < CACHE_DURATION && stocksCache.length > 0) {
    return stocksCache;
  }

  try {
    const sheetUrl = process.env.STOCKS_SHEET_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTe_jvQxbvO9CPQfHWKWJNujBlPfojS8bVcCoVYCq7TGL5ovst6prSgGwt-cEdzFUoDZlBfCDkfAec9/pub?output=csv';
    console.log('📊 Fetching stocks from Google Sheets...');
    console.log('URL:', sheetUrl);
    const response = await fetch(sheetUrl);
    const csvText = await response.text();
    
    console.log('Response length:', csvText.length);
    console.log('Response preview:', csvText.substring(0, 200));
    
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
      .filter(stock => stock.SYMBOL || stock.Symbol);
    
    lastStocksFetch = now;
    console.log(`✅ Fetched ${stocksCache.length} stocks`);
    return stocksCache;
  } catch (error) {
    console.error('❌ Error fetching stocks:', error);
    return stocksCache;
  }
}

// Fetch Indices from Google Sheets
async function fetchIndicesData() {
  const now = Date.now();
  if (now - lastIndicesFetch < CACHE_DURATION && indicesCache.length > 0) {
    return indicesCache;
  }

  try {
    const sheetUrl = process.env.INDICES_SHEET_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRmu-1ua2OhETfc4MIcuPCs7ZDH-SMRTh2QIr3IbD35OUB1NxDfIKkLL2osGMZ76kKlU5opx722TiBz/pub?output=csv';
    console.log('📈 Fetching indices from Google Sheets...');
    console.log('URL:', sheetUrl);
    const response = await fetch(sheetUrl);
    const csvText = await response.text();
    
    console.log('Response length:', csvText.length);
    console.log('Response preview:', csvText.substring(0, 200));
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    indicesCache = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const index: any = {};
        headers.forEach((header, idx) => {
          index[header] = values[idx]?.trim() || '';
        });
        return index;
      })
      .filter(index => index.SYMBOL || index.Symbol || index.INDEX);
    
    lastIndicesFetch = now;
    console.log(`✅ Fetched ${indicesCache.length} indices`);
    return indicesCache;
  } catch (error) {
    console.error('❌ Error fetching indices:', error);
    return indicesCache;
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    stocks: stocksCache.length,
    indices: indicesCache.length
  });
});

// Debug endpoint to check environment variables
app.get('/api/stocks/env', (req, res) => {
  res.json({
    success: true,
    environment: {
      stocksUrl: process.env.STOCKS_SHEET_URL || 'NOT_SET',
      indicesUrl: process.env.INDICES_SHEET_URL || 'NOT_SET',
      nodeEnv: process.env.NODE_ENV || 'NOT_SET',
      port: process.env.PORT || 'NOT_SET'
    }
  });
});

// Debug endpoint to test URLs
app.get('/api/stocks/debug', async (req, res) => {
  try {
    const stocksUrl = process.env.STOCKS_SHEET_URL || 'NOT_SET';
    const indicesUrl = process.env.INDICES_SHEET_URL || 'NOT_SET';
    
    const stocksResponse = await fetch(stocksUrl);
    const indicesResponse = await fetch(indicesUrl);
    
    const stocksText = await stocksResponse.text();
    const indicesText = await indicesResponse.text();
    
    res.json({
      success: true,
      stocks: {
        url: stocksUrl,
        status: stocksResponse.status,
        length: stocksText.length,
        preview: stocksText.substring(0, 500)
      },
      indices: {
        url: indicesUrl,
        status: indicesResponse.status,
        length: indicesText.length,
        preview: indicesText.substring(0, 500)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stocks API
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
        s.Name?.toLowerCase().includes(query) ||
        s.CompanyName?.toLowerCase().includes(query)
      )
      .slice(0, 20);
    
    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// Indices API
app.get('/api/indices', async (req, res) => {
  try {
    const indices = await fetchIndicesData();
    res.json({ success: true, count: indices.length, data: indices });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch indices' });
  }
});

app.get('/api/index/:symbol', async (req, res) => {
  try {
    const indices = await fetchIndicesData();
    const index = indices.find(i => i.Symbol === req.params.symbol);
    
    if (index) {
      res.json({ success: true, data: index });
    } else {
      res.status(404).json({ success: false, error: 'Index not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch index' });
  }
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  socket.on('subscribe', (symbols: string[]) => {
    console.log('📊 Client subscribed to:', symbols);
    socket.join(symbols);
  });
  
  socket.on('unsubscribe', (symbols: string[]) => {
    symbols.forEach(symbol => socket.leave(symbol));
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Pre-fetch data on startup
(async () => {
  console.log('🚀 Pre-fetching data...');
  await Promise.all([
    fetchStocksData(),
    fetchIndicesData()
  ]);
  console.log('✅ Initial data loaded');
})();

// Auto-refresh data every 30 seconds
setInterval(async () => {
  console.log('🔄 Auto-refreshing data...');
  await Promise.all([
    fetchStocksData(),
    fetchIndicesData()
  ]);
}, 30000);

// Start server
httpServer.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   TradePro Elite Backend Server           ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📡 Endpoints:');
  console.log(`   GET /api/stocks`);
  console.log(`   GET /api/stock/:symbol`);
  console.log(`   GET /api/search?q=query`);
  console.log(`   GET /api/indices`);
  console.log(`   GET /api/index/:symbol`);
  console.log('');
});
