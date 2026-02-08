// For localhost development, use the correct backend URL
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : 'https://trade-pro-backend.onrender.com');

// Mock data fallback when backend is not available
const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.15, changePercent: 1.24 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -0.85, changePercent: -0.61 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: 4.32, changePercent: 1.15 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.78, change: 1.92, changePercent: 1.33 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.68, change: -3.21, changePercent: -1.30 }
];

const mockIndices = [
  { symbol: '^GSPC', name: 'S&P 500', value: 4514.02, change: 12.45, changePercent: 0.28 },
  { symbol: '^DJI', name: 'Dow Jones', value: 35456.78, change: 156.23, changePercent: 0.44 },
  { symbol: '^IXIC', name: 'NASDAQ', value: 14234.56, change: -45.67, changePercent: -0.32 }
];

export class ApiService {
  private async fetchWithFallback(url: string, fallbackData: any) {
    try {
      const fullUrl = `${API_BASE}${url}`;
      console.log('🔍 API_BASE:', API_BASE);
      console.log('🔍 URL:', url);
      console.log('🔍 Full URL:', fullUrl);

      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error('Backend not available');
      return await res.json();
    } catch (error) {
      console.warn('Backend not available, using mock data:', error);
      return fallbackData;
    }
  }
  // Stocks
  async getAllStocks() {
    return this.fetchWithFallback('/api/stocks/all', mockStocks);
  }

  async getStock(symbol: string) {
    const stock = mockStocks.find(s => s.symbol === symbol);
    return this.fetchWithFallback(`/api/stocks/${symbol}`, stock || null);
  }

  async searchStocks(query: string) {
    const filtered = mockStocks.filter(s =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    return this.fetchWithFallback(`/api/stocks/search?q=${encodeURIComponent(query)}`, filtered);
  }

  async getIndices() {
    return this.fetchWithFallback('/api/stocks/indices/all', mockIndices);
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
