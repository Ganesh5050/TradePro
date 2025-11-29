const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface Stock {
  Symbol: string;
  Name: string;
  Price?: string;
  Change?: string;
  ChangePercent?: string;
  Volume?: string;
  MarketCap?: string;
  Sector?: string;
  Industry?: string;
}

class StockService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 30000; // 30 seconds
  
  async getAllStocks(): Promise<Stock[]> {
    const cacheKey = 'all_stocks';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/stocks`);
      const result = await response.json();
      
      if (result.success) {
        this.cache.set(cacheKey, { data: result.data, timestamp: Date.now() });
        return result.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching stocks:', error);
      return [];
    }
  }
  
  async getStock(symbol: string): Promise<Stock | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/${symbol}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching stock:', error);
      return null;
    }
  }
  
  async searchStocks(query: string): Promise<Stock[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }
}

export const stockService = new StockService();
