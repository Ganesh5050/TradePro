export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  sector: string;
  marketCap?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

export interface Portfolio {
  id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  avg_price: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export interface UserBalance {
  user_id: string;
  balance: number;
  updated_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  symbol: string;
  created_at: string;
}
