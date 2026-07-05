import { create } from 'zustand';
import { supabase } from '@/config/supabase';

interface Portfolio {
  symbol: string;
  quantity: number;
  avg_price: number;
}

interface Transaction {
  id: string;
  symbol: string;
  stock_name: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

interface PortfolioState {
  holdings: Portfolio[];
  transactions: Transaction[];
  balance: number;
  isLoading: boolean;
  fetchPortfolio: (userId: string) => Promise<void>;
  buyStock: (userId: string, symbol: string, stockName: string, quantity: number, price: number) => Promise<void>;
  sellStock: (userId: string, symbol: string, stockName: string, quantity: number, price: number) => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
}

// Helper to sync user's entire portfolio state to Supabase for consistency and leaderboard
const syncToSupabase = async (userId: string, userPortfolio: any) => {
  try {
    const investedValue = userPortfolio.holdings.reduce((sum: number, h: Portfolio) => sum + (h.quantity * h.avg_price), 0);
    const totalValue = userPortfolio.balance + investedValue;

    const { error } = await supabase
      .from('profiles')
      .update({ 
        total_pnl: totalValue,
        portfolio_data: userPortfolio 
      })
      .eq('id', userId);

    if (error) {
      console.error('Supabase update error:', error);
    }
  } catch (error) {
    console.error('Failed to sync to Supabase:', error);
  }
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  holdings: [],
  transactions: [],
  balance: 1000000, // ₹10,00,000 (10 lakhs) initial virtual money
  isLoading: false,

  fetchPortfolio: async (userId: string) => {
    set({ isLoading: true });
    try {
      // 1. Try to fetch from Supabase first (True Consistency)
      const { data, error } = await supabase
        .from('profiles')
        .select('portfolio_data')
        .eq('id', userId)
        .single();

      let userPortfolio;

      if (!error && data?.portfolio_data) {
        userPortfolio = data.portfolio_data;
      } else {
        // Fallback to local storage if Supabase is empty for this user
        const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
        userPortfolio = portfolios[userId] || { balance: 1000000, holdings: [], transactions: [] };
        
        // Sync the initial default state to Supabase
        await syncToSupabase(userId, userPortfolio);
      }

      set({ 
        balance: userPortfolio.balance,
        holdings: userPortfolio.holdings,
        transactions: userPortfolio.transactions,
        isLoading: false 
      });

      // Also update local storage as a backup
      const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
      portfolios[userId] = userPortfolio;
      localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));

    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
      set({ isLoading: false });
    }
  },

  buyStock: async (userId: string, symbol: string, stockName: string, quantity: number, price: number) => {
    try {
      const total = quantity * price;
      const { balance, holdings } = get();

      if (total > balance) {
        throw new Error('Insufficient balance');
      }

      const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
      const userPortfolio = { 
        balance: get().balance, 
        holdings: [...get().holdings], 
        transactions: [...get().transactions] 
      };

      // Create transaction
      const transaction: Transaction = {
        id: 'txn-' + Date.now(),
        symbol,
        stock_name: stockName,
        type: 'BUY',
        quantity,
        price,
        total,
        created_at: new Date().toISOString(),
      };
      userPortfolio.transactions.unshift(transaction);

      // Update or create holding
      const existingHoldingIndex = userPortfolio.holdings.findIndex((h: Portfolio) => h.symbol === symbol);

      if (existingHoldingIndex >= 0) {
        const existingHolding = userPortfolio.holdings[existingHoldingIndex];
        const newQuantity = existingHolding.quantity + quantity;
        const newAvgPrice = ((existingHolding.avg_price * existingHolding.quantity) + total) / newQuantity;

        userPortfolio.holdings[existingHoldingIndex] = {
          symbol,
          quantity: newQuantity,
          avg_price: newAvgPrice,
        };
      } else {
        userPortfolio.holdings.push({
          symbol,
          quantity,
          avg_price: price,
        });
      }

      // Update balance
      userPortfolio.balance = balance - total;

      // Save to localStorage
      portfolios[userId] = userPortfolio;
      localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));

      // ** CRITICAL FIX: Sync to Supabase permanently **
      await syncToSupabase(userId, userPortfolio);

      // Refresh portfolio state in UI
      set({ 
        balance: userPortfolio.balance,
        holdings: userPortfolio.holdings,
        transactions: userPortfolio.transactions
      });
    } catch (error: any) {
      console.error('Buy stock error:', error);
      throw new Error(error.message || 'Failed to buy stock');
    }
  },

  sellStock: async (userId: string, symbol: string, stockName: string, quantity: number, price: number) => {
    try {
      const total = quantity * price;
      const { balance, holdings } = get();

      // Check if user has enough shares
      const holding = holdings.find(h => h.symbol === symbol);
      if (!holding || holding.quantity < quantity) {
        throw new Error('Insufficient shares to sell');
      }

      const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
      const userPortfolio = { 
        balance: get().balance, 
        holdings: [...get().holdings], 
        transactions: [...get().transactions] 
      };

      // Create transaction
      const transaction: Transaction = {
        id: 'txn-' + Date.now(),
        symbol,
        stock_name: stockName,
        type: 'SELL',
        quantity,
        price,
        total,
        created_at: new Date().toISOString(),
      };
      userPortfolio.transactions.unshift(transaction);

      // Update holding
      const holdingIndex = userPortfolio.holdings.findIndex((h: Portfolio) => h.symbol === symbol);
      const newQuantity = userPortfolio.holdings[holdingIndex].quantity - quantity;

      if (newQuantity === 0) {
        // Remove holding if quantity becomes 0
        userPortfolio.holdings.splice(holdingIndex, 1);
      } else {
        // Update holding quantity
        userPortfolio.holdings[holdingIndex].quantity = newQuantity;
      }

      // Update balance
      userPortfolio.balance = balance + total;

      // Save to localStorage
      portfolios[userId] = userPortfolio;
      localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));

      // ** CRITICAL FIX: Sync to Supabase permanently **
      await syncToSupabase(userId, userPortfolio);

      // Refresh portfolio state in UI
      set({ 
        balance: userPortfolio.balance,
        holdings: userPortfolio.holdings,
        transactions: userPortfolio.transactions
      });
    } catch (error: any) {
      console.error('Sell stock error:', error);
      throw new Error(error.message || 'Failed to sell stock');
    }
  },

  fetchTransactions: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('portfolio_data')
        .eq('id', userId)
        .single();

      if (!error && data?.portfolio_data) {
        set({ transactions: data.portfolio_data.transactions.slice(0, 50) });
      } else {
        const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
        const userPortfolio = portfolios[userId] || { balance: 1000000, holdings: [], transactions: [] };
        set({ transactions: userPortfolio.transactions.slice(0, 50) });
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  },
}));
