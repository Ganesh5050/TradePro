import { Router } from 'express';
import { supabaseService } from '../services/supabase.service';

const router = Router();

// Get portfolio
router.get('/:userId', async (req, res) => {
  try {
    const portfolio = await supabaseService.getPortfolio(req.params.userId);
    const balance = await supabaseService.getUserBalance(req.params.userId);
    res.json({ success: true, data: { portfolio, balance } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buy stock
router.post('/buy', async (req, res) => {
  try {
    const { userId, symbol, quantity, price } = req.body;
    
    if (!userId || !symbol || !quantity || !price) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const result = await supabaseService.buyStock(userId, symbol, quantity, price);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Sell stock
router.post('/sell', async (req, res) => {
  try {
    const { userId, symbol, quantity, price } = req.body;
    
    if (!userId || !symbol || !quantity || !price) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const result = await supabaseService.sellStock(userId, symbol, quantity, price);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get transactions
router.get('/transactions/:userId', async (req, res) => {
  try {
    const transactions = await supabaseService.getTransactions(req.params.userId);
    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
