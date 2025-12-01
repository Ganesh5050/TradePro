import { create } from 'zustand';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number | string;
  sector: string;
  high: number;
  low: number;
  open: number;
  close: number;
}

interface StockState {
  stocks: Stock[];
  indices: any[];
  watchlist: string[];
  selectedStock: Stock | null;
  isLoading: boolean;
  fetchStocks: () => Promise<void>;
  fetchIndices: () => Promise<void>;
  getStock: (symbol: string) => void;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  setSelectedStock: (stock: Stock | null) => void;
}

// Mock data for Indian stocks (fallback only)
const mockStocks: Stock[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.80, change: 34.20, changePercent: 1.41, volume: 15234567, marketCap: 165000, sector: 'Oil & Gas', high: 2856.80, low: 2100.00, open: 2450, close: 2456.80 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3890.45, change: -23.15, changePercent: -0.59, volume: 8765432, marketCap: 142000, sector: 'IT', high: 4120.00, low: 3200.00, open: 3900, close: 3890.45 },
];

const mockIndices = [
  { Symbol: 'NIFTY 50', Price: 19500.50, Change: 125.30 },
  { Symbol: 'SENSEX', Price: 65432.10, Change: -89.45 },
  { Symbol: 'NIFTY BANK', Price: 44123.75, Change: 234.60 },
  { Symbol: 'NIFTY IT', Price: 31245.20, Change: 156.80 },
  { Symbol: 'NIFTY PHARMA', Price: 13567.90, Change: -45.30 }
];

export const useStockStore = create<StockState>((set, get) => ({
  stocks: mockStocks, // Initialize with mock data immediately
  indices: mockIndices,
  watchlist: [],
  selectedStock: null,
  isLoading: false,
  
  fetchStocks: async () => {
    set({ isLoading: true });
    
    try {
      // For localhost development, use the correct backend URL
      const isDevelopment = import.meta.env.DEV;
      const API_BASE = isDevelopment 
        ? 'http://localhost:3001/api' 
        : 'https://trade-pro-backend.onrender.com';
      
      console.log('🔍 Stock Store API_BASE:', API_BASE);
      const response = await fetch(`${API_BASE}/stocks/all`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Loaded stocks from Google Sheets:', result.data.length);
        set({ stocks: result.data, isLoading: false });
      } else {
        console.warn('⚠️ No data from API, using mock data');
        set({ stocks: mockStocks, isLoading: false });
      }
    } catch (error) {
      console.error('❌ Failed to fetch stocks from API:', error);
      console.log('🔄 Using mock data for development');
      set({ stocks: mockStocks, isLoading: false });
    }
  },
  
  fetchIndices: async () => {
    try {
      // For localhost development, use the correct backend URL
      const isDevelopment = import.meta.env.DEV;
      const API_BASE = isDevelopment 
        ? 'http://localhost:3001/api' 
        : 'https://trade-pro-backend.onrender.com';
      
      console.log('🔍 Indices Store API_BASE:', API_BASE);
      const response = await fetch(`${API_BASE}/stocks/indices/all`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log('✅ Loaded indices from Google Sheets:', result.data.length);
        set({ indices: result.data });
      } else {
        console.warn('⚠️ No indices from API, using mock data');
        set({ indices: mockIndices });
      }
    } catch (error) {
      console.error('❌ Failed to fetch indices from API:', error);
      set({ indices: mockIndices });
    }
  },

  getStock: (symbol: string) => {
    const { stocks } = get();
    console.log('🔍 Looking for stock:', symbol);
    console.log('📊 Total stocks available:', stocks.length);
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      console.log('✅ Stock found:', stock);
      set({ selectedStock: stock });
    } else {
      console.warn(`❌ Stock ${symbol} not found in ${stocks.length} stocks`);
      console.log('Available symbols sample:', stocks.slice(0, 10).map(s => s.symbol));
      set({ selectedStock: null });
    }
  },
  
  addToWatchlist: (symbol: string) => {
    const { watchlist } = get();
    if (!watchlist.includes(symbol)) {
      set({ watchlist: [...watchlist, symbol] });
    }
  },
  
  removeFromWatchlist: (symbol: string) => {
    const { watchlist } = get();
    set({ watchlist: watchlist.filter(s => s !== symbol) });
  },
  
  setSelectedStock: (stock: Stock | null) => {
    set({ selectedStock: stock });
  },
}));