import { supabase } from '@/config/supabase';

export interface TradeOrder {
  symbol: string;
  quantity: number;
  price: number;
  type: 'BUY' | 'SELL';
}

export interface Portfolio {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

class TradingService {
  async executeTrade(userId: string, order: TradeOrder) {
    try {
      const totalAmount = order.quantity * order.price;
      
      // Check user balance
      const { data: user } = await supabase
        .from('users')
        .select('virtualCash')
        .eq('id', userId)
        .single();
      
      if (!user) throw new Error('User not found');
      
      if (order.type === 'BUY' && user.virtualCash < totalAmount) {
        throw new Error('Insufficient funds');
      }
      
      // Create transaction
      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          userId,
          symbol: order.symbol,
          type: order.type,
          quantity: order.quantity,
          price: order.price,
          totalAmount
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update portfolio
      await this.updatePortfolio(userId, order);
      
      // Update user balance
      const newBalance = order.type === 'BUY' 
        ? user.virtualCash - totalAmount 
        : user.virtualCash + totalAmount;
      
      await supabase
        .from('users')
        .update({ virtualCash: newBalance })
        .eq('id', userId);
      
      return { success: true, transaction };
    } catch (error) {
      console.error('Trade execution error:', error);
      return { success: false, error: (error as Error).message };
    }
  }
  
  private async updatePortfolio(userId: string, order: TradeOrder) {
    const { data: existing } = await supabase
      .from('portfolios')
      .select('*')
      .eq('userId', userId)
      .eq('symbol', order.symbol)
      .single();
    
    if (order.type === 'BUY') {
      if (existing) {
        const newQuantity = existing.quantity + order.quantity;
        const newAvgPrice = ((existing.avgPrice * existing.quantity) + (order.price * order.quantity)) / newQuantity;
        
        await supabase
          .from('portfolios')
          .update({
            quantity: newQuantity,
            avgPrice: newAvgPrice
          })
          .eq('userId', userId)
          .eq('symbol', order.symbol);
      } else {
        await supabase
          .from('portfolios')
          .insert({
            userId,
            symbol: order.symbol,
            quantity: order.quantity,
            avgPrice: order.price
          });
      }
    } else if (order.type === 'SELL' && existing) {
      const newQuantity = existing.quantity - order.quantity;
      
      if (newQuantity <= 0) {
        await supabase
          .from('portfolios')
          .delete()
          .eq('userId', userId)
          .eq('symbol', order.symbol);
      } else {
        await supabase
          .from('portfolios')
          .update({ quantity: newQuantity })
          .eq('userId', userId)
          .eq('symbol', order.symbol);
      }
    }
  }
  
  async getPortfolio(userId: string): Promise<Portfolio[]> {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('userId', userId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return [];
    }
  }
  
  async getTransactionHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }
}

export const tradingService = new TradingService();
