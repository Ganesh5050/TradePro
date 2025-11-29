-- TradePro Elite Database Schema
-- Run this in Supabase SQL Editor

-- Portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  symbol TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  avg_price DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('BUY', 'SELL')),
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User balance table
CREATE TABLE IF NOT EXISTS user_balance (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  balance DECIMAL DEFAULT 1000000,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  symbol TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

-- Enable Row Level Security
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio
CREATE POLICY "Users can view own portfolio" 
  ON portfolio FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio" 
  ON portfolio FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio" 
  ON portfolio FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio" 
  ON portfolio FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view own transactions" 
  ON transactions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
  ON transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_balance
CREATE POLICY "Users can view own balance" 
  ON user_balance FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own balance" 
  ON user_balance FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own balance" 
  ON user_balance FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for watchlist
CREATE POLICY "Users can view own watchlist" 
  ON watchlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watchlist" 
  ON watchlist FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own watchlist" 
  ON watchlist FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_portfolio_user_id ON portfolio(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);

-- Function to initialize user balance on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_balance (user_id, balance)
  VALUES (NEW.id, 1000000);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create balance on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
