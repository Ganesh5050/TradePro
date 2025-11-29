import { Router } from 'express';
import { googleSheetsService } from '../services/googleSheets.service';

const router = Router();

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
