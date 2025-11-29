import { supabase } from '../config/supabase';
import { Portfolio, Transaction } from '../types';

export class SupabaseService {
  // Get user portfolio
  async getPortfolio(userId: string): Promise<Portfolio[]> {
    const { data, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  // Get user balance
  async getUserBalance(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('user_balance')
      .select('balance')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Create initial balance if doesn't exist
      await supabase
        .from('user_balance')
        .insert({ user_id: userId, balance: 1000000 });
      return 1000000;
    }

    return data?.balance || 0;
  }

  // Buy stock
  async buyStock(userId: string, symbol: string, quantity: number, price: number) {
    const total = quantity * price;

    // Check balance
    const balance = await this.getUserBalance(userId);
    if (balance < total) {
      throw new Error('Insufficient balance');
    }

    // Update balance
    await supabase
      .from('user_balance')
      .update({ balance: balance - total })
      .eq('user_id', userId);

    // Add to portfolio
    const { data: existing } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .single();

    if (existing) {
      const newQty = existing.quantity + quantity;
      const newAvg = ((existing.avg_price * existing.quantity) + (price * quantity)) / newQty;

      await supabase
        .from('portfolio')
        .update({ 
          quantity: newQty, 
          avg_price: newAvg 
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('portfolio')
        .insert({ 
          user_id: userId, 
          symbol, 
          quantity, 
          avg_price: price 
        });
    }

    // Record transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        symbol,
        type: 'BUY',
        quantity,
        price,
        total
      });

    return { success: true, message: 'Stock purchased successfully' };
  }

  // Sell stock
  async sellStock(userId: string, symbol: string, quantity: number, price: number) {
    const total = quantity * price;

    // Check holdings
    const { data: holding } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId)
      .eq('symbol', symbol)
      .single();

    if (!holding || holding.quantity < quantity) {
      throw new Error('Insufficient holdings');
    }

    // Update balance
    const balance = await this.getUserBalance(userId);
    await supabase
      .from('user_balance')
      .update({ balance: balance + total })
      .eq('user_id', userId);

    // Update portfolio
    if (holding.quantity === quantity) {
      await supabase
        .from('portfolio')
        .delete()
        .eq('id', holding.id);
    } else {
      await supabase
        .from('portfolio')
        .update({ quantity: holding.quantity - quantity })
        .eq('id', holding.id);
    }

    // Record transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        symbol,
        type: 'SELL',
        quantity,
        price,
        total
      });

    return { success: true, message: 'Stock sold successfully' };
  }

  // Get transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Get watchlist
  async getWatchlist(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('watchlist')
      .select('symbol')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(w => w.symbol) || [];
  }

  // Add to watchlist
  async addToWatchlist(userId: string, symbol: string) {
    const { error } = await supabase
      .from('watchlist')
      .insert({ user_id: userId, symbol });

    if (error) throw error;
    return { success: true, message: 'Added to watchlist' };
  }

  // Remove from watchlist
  async removeFromWatchlist(userId: string, symbol: string) {
    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('symbol', symbol);

    if (error) throw error;
    return { success: true, message: 'Removed from watchlist' };
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 100) {
    const { data, error } = await supabase
      .from('user_balance')
      .select('user_id, balance')
      .order('balance', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
}

export const supabaseService = new SupabaseService();
