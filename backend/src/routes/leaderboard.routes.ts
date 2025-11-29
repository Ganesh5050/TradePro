import { Router } from 'express';
import { supabaseService } from '../services/supabase.service';

const router = Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const leaderboard = await supabaseService.getLeaderboard(limit);
    res.json({ success: true, data: leaderboard });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
