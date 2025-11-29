import { create } from 'zustand';
import { apiService } from '@/services/api.service';

interface WatchlistState {
  watchlist: string[];
  isLoading: boolean;
  fetchWatchlist: (userId: string) => Promise<void>;
  addToWatchlist: (userId: string, symbol: string) => Promise<void>;
  removeFromWatchlist: (userId: string, symbol: string) => Promise<void>;
  isInWatchlist: (symbol: string) => boolean;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  isLoading: false,

  fetchWatchlist: async (userId: string) => {
    set({ isLoading: true });
    try {
      const result = await apiService.getWatchlist(userId);
      if (result.success) {
        set({ watchlist: result.data, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
      set({ isLoading: false });
    }
  },

  addToWatchlist: async (userId: string, symbol: string) => {
    try {
      const result = await apiService.addToWatchlist(userId, symbol);
      if (result.success) {
        set({ watchlist: [...get().watchlist, symbol] });
      }
    } catch (error) {
      throw error;
    }
  },

  removeFromWatchlist: async (userId: string, symbol: string) => {
    try {
      const result = await apiService.removeFromWatchlist(userId, symbol);
      if (result.success) {
        set({ watchlist: get().watchlist.filter(s => s !== symbol) });
      }
    } catch (error) {
      throw error;
    }
  },

  isInWatchlist: (symbol: string) => {
    return get().watchlist.includes(symbol);
  },
}));
