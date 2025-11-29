import { Router } from 'express';
import { supabaseService } from '../services/supabase.service';

const router = Router();

// Get watchlist
router.get('/:userId', async (req, res) => {
  try {
    const watchlist = await supabaseService.getWatchlist(req.params.userId);
    res.json({ success: true, data: watchlist });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add to watchlist
router.post('/add', async (req, res) => {
  try {
    const { userId, symbol } = req.body;
    
    if (!userId || !symbol) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const result = await supabaseService.addToWatchlist(userId, symbol);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Remove from watchlist
router.post('/remove', async (req, res) => {
  try {
    const { userId, symbol } = req.body;
    
    if (!userId || !symbol) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const result = await supabaseService.removeFromWatchlist(userId, symbol);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
