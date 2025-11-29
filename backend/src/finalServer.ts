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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/stocks', async (req, res) => {
  try {
    const sheetUrl = process.env.GOOGLE_STOCKS_SHEET_URL || 'https://docs.google.com/spreadsheets/d/17FYJ4BMGpYFgVno379vCZHOkmqE5_gVBipy6ZYxg4c4/export?format=csv&gid=0';
    const response = await fetch(sheetUrl);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const stocks = lines.slice(1)
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
    
    res.json({ success: true, count: stocks.length, data: stocks });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stocks' });
  }
});

app.get('/api/indices', async (req, res) => {
  try {
    const sheetUrl = process.env.GOOGLE_INDICES_SHEET_URL || 'https://docs.google.com/spreadsheets/d/1fZPztlpXcuUy-AY8yHk1HfjrUuBdAxtBdLb6nyui8yM/export?format=csv&gid=0';
    const response = await fetch(sheetUrl);
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const indices = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const index: any = {};
        headers.forEach((header, idx) => {
          index[header] = values[idx]?.trim() || '';
        });
        return index;
      })
      .filter(index => index.Symbol);
    
    res.json({ success: true, count: indices.length, data: indices });
  } catch (error) {
    console.error('Error fetching indices:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch indices' });
  }
});

app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    // Implement stock detail fetching
    res.json({ success: true, data: { symbol, name: symbol, price: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stock' });
  }
});

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('subscribe', (symbols: string[]) => {
    console.log('Client subscribed to:', symbols);
    socket.join(symbols);
  });
  
  socket.on('unsubscribe', (symbols: string[]) => {
    symbols.forEach(symbol => socket.leave(symbol));
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Final Server running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
});
