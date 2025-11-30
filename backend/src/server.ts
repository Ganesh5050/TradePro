import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import stocksRoutes from './routes/stocks.routes';
import portfolioRoutes from './routes/portfolio.routes';
import watchlistRoutes from './routes/watchlist.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import { errorHandler } from './middleware/error.middleware';
import { googleSheetsService } from './services/googleSheets.service';

const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stocks', stocksRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    environment: config.server.nodeEnv,
    version: '1.0.1'
  });
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'TradePro Backend is running!',
    timestamp: new Date(),
    stocksUrl: config.googleSheets.stocksUrl?.substring(0, 50) + '...',
    indicesUrl: config.googleSheets.indicesUrl?.substring(0, 50) + '...'
  });
});

// Error handling
app.use(errorHandler);

// Pre-fetch data on startup
(async () => {
  console.log('🚀 Pre-fetching market data...');
  await Promise.all([
    googleSheetsService.fetchStocks(),
    googleSheetsService.fetchIndices()
  ]);
  console.log('✅ Initial data loaded');
})();

// Auto-refresh every 30 seconds
setInterval(async () => {
  console.log('🔄 Refreshing market data...');
  await Promise.all([
    googleSheetsService.fetchStocks(),
    googleSheetsService.fetchIndices()
  ]);
}, 30000);

// Start server
app.listen(PORT, () => {
  const isProduction = config.server.nodeEnv === 'production';
  const baseUrl = isProduction ? 'https://trade-pro-backend.onrender.com' : `http://localhost:${PORT}`;
  
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   TradePro Elite Backend API Server       ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`🚀 Server: ${baseUrl}`);
  console.log(`💚 Health: ${baseUrl}/api/health`);
  console.log('');
  console.log('📡 API Endpoints:');
  console.log('   Stocks:');
  console.log('     GET  /api/stocks/all');
  console.log('     GET  /api/stocks/:symbol');
  console.log('     GET  /api/stocks/search/query?q=...');
  console.log('     GET  /api/stocks/indices/all');
  console.log('   Portfolio:');
  console.log('     GET  /api/portfolio/:userId');
  console.log('     POST /api/portfolio/buy');
  console.log('     POST /api/portfolio/sell');
  console.log('     GET  /api/portfolio/transactions/:userId');
  console.log('   Watchlist:');
  console.log('     GET  /api/watchlist/:userId');
  console.log('     POST /api/watchlist/add');
  console.log('     POST /api/watchlist/remove');
  console.log('   Leaderboard:');
  console.log('     GET  /api/leaderboard');
  console.log('');
});
