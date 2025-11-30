// For localhost development, use the correct backend URL
const isDevelopment = import.meta.env.DEV;
const API_BASE = isDevelopment 
  ? 'http://localhost:3001/api' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api');

export class ApiService {
  // Stocks
  async getAllStocks() {
    const res = await fetch(`${API_BASE}/stocks/all`);
    return res.json();
  }

  async getStock(symbol: string) {
    const res = await fetch(`${API_BASE}/stocks/${symbol}`);
    return res.json();
  }

  async searchStocks(query: string) {
    const res = await fetch(`${API_BASE}/stocks/search/query?q=${encodeURIComponent(query)}`);
    return res.json();
  }

  async getIndices() {
    const res = await fetch(`${API_BASE}/stocks/indices/all`);
    return res.json();
  }

  // Portfolio
  async getPortfolio(userId: string) {
    const res = await fetch(`${API_BASE}/portfolio/${userId}`);
    return res.json();
  }

  async buyStock(userId: string, symbol: string, quantity: number, price: number) {
    const res = await fetch(`${API_BASE}/portfolio/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, symbol, quantity, price })
    });
    return res.json();
  }

  async sellStock(userId: string, symbol: string, quantity: number, price: number) {
    const res = await fetch(`${API_BASE}/portfolio/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, symbol, quantity, price })
    });
    return res.json();
  }

  async getTransactions(userId: string) {
    const res = await fetch(`${API_BASE}/portfolio/transactions/${userId}`);
    return res.json();
  }

  // Watchlist
  async getWatchlist(userId: string) {
    const res = await fetch(`${API_BASE}/watchlist/${userId}`);
    return res.json();
  }

  async addToWatchlist(userId: string, symbol: string) {
    const res = await fetch(`${API_BASE}/watchlist/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, symbol })
    });
    return res.json();
  }

  async removeFromWatchlist(userId: string, symbol: string) {
    const res = await fetch(`${API_BASE}/watchlist/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, symbol })
    });
    return res.json();
  }

  // Leaderboard
  async getLeaderboard(limit: number = 100) {
    const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`);
    return res.json();
  }
}

export const apiService = new ApiService();
