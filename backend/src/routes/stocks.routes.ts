import { Router } from 'express';
import { googleSheetsService } from '../services/googleSheets.service';
import axios from 'axios';
import { config } from '../config/env';

const router = Router();

// Debug endpoint to check environment variables
router.get('/env', async (req, res) => {
  try {
    const result = {
      success: true,
      environment: {
        stocksUrl: process.env.STOCKS_SHEET_URL || 'NOT_SET',
        indicesUrl: process.env.INDICES_SHEET_URL || 'NOT_SET',
        supabaseUrl: process.env.SUPABASE_URL || 'NOT_SET',
        nodeEnv: process.env.NODE_ENV || 'NOT_SET',
        port: process.env.PORT || 'NOT_SET'
      }
    };
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Debug endpoint to test Google Sheets URLs
router.get('/debug', async (req, res) => {
  try {
    console.log('🔍 Debug: Testing Google Sheets URLs...');
    
    const stocksUrl = config.googleSheets.stocksUrl;
    const indicesUrl = config.googleSheets.indicesUrl;
    
    console.log('Stocks URL:', stocksUrl);
    console.log('Indices URL:', indicesUrl);
    
    // Test stocks URL
    const stocksResponse = await axios.get(stocksUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/csv,text/plain,*/*'
      },
      timeout: 10000
    });
    
    // Test indices URL
    const indicesResponse = await axios.get(indicesUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/csv,text/plain,*/*'
      },
      timeout: 10000
    });
    
    const result = {
      success: true,
      stocks: {
        url: stocksUrl,
        status: stocksResponse.status,
        contentType: stocksResponse.headers['content-type'],
        dataLength: stocksResponse.data?.length || 0,
        preview: stocksResponse.data?.substring(0, 500) || 'No data'
      },
      indices: {
        url: indicesUrl,
        status: indicesResponse.status,
        contentType: indicesResponse.headers['content-type'],
        dataLength: indicesResponse.data?.length || 0,
        preview: indicesResponse.data?.substring(0, 500) || 'No data'
      }
    };
    
    res.json(result);
  } catch (error: any) {
    console.error('Debug error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.code || error.response?.status || 'Unknown'
    });
  }
});

// Get all stocks
router.get('/all', async (req, res) => {
  try {
    const stocks = await googleSheetsService.fetchStocks();
    res.json({ success: true, data: stocks, count: stocks.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stocks' });
  }
});

// Get stock by symbol
router.get('/:symbol', async (req, res) => {
  try {
    await googleSheetsService.fetchStocks();
    const stock = googleSheetsService.getStockBySymbol(req.params.symbol);
    
    if (stock) {
      res.json({ success: true, data: stock });
    } else {
      res.status(404).json({ success: false, error: 'Stock not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch stock' });
  }
});

// Search stocks
router.get('/search/query', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    await googleSheetsService.fetchStocks();
    const stocks = googleSheetsService.searchStocks(query);
    res.json({ success: true, data: stocks, count: stocks.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed' });
  }
});

// Get indices
router.get('/indices/all', async (req, res) => {
  try {
    const indices = await googleSheetsService.fetchIndices();
    res.json({ success: true, data: indices, count: indices.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch indices' });
  }
});

export default router;
