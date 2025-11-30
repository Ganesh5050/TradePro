import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/config/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
  
      login: async (email: string, password: string) => {
        try {
          // Get stored users from localStorage
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          if (storedUsers[email] && storedUsers[email].password === password) {
            const user: User = {
              id: storedUsers[email].id,
              email: email,
              name: storedUsers[email].name,
            };
            set({ user, isAuthenticated: true });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error: any) {
          console.error('Login error:', error);
          throw new Error(error.message || 'Login failed');
        }
      },
  
      logout: async () => {
        try {
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
  
      signup: async (email: string, password: string) => {
        try {
          // Get stored users from localStorage
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          // Check if user already exists
          if (storedUsers[email]) {
            throw new Error('User already exists');
          }

          // Create new user
          const userId = 'user-' + Date.now();
          const newUser = {
            id: userId,
            email: email,
            password: password,
            name: email.split('@')[0],
          };

          storedUsers[email] = newUser;
          localStorage.setItem('tradepro-users', JSON.stringify(storedUsers));

          // Create initial portfolio
          const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
          portfolios[userId] = {
            balance: 100000,
            holdings: [],
            transactions: [],
          };
          localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));

          const user: User = {
            id: userId,
            email: email,
            name: newUser.name,
          };
          set({ user, isAuthenticated: true });
        } catch (error: any) {
          console.error('Signup error:', error);
          throw new Error(error.message || 'Signup failed');
        }
      },

      checkAuth: async () => {
        // Auth is persisted via zustand persist middleware
        // No need to check Supabase session
      },
    }),
    {
      name: 'tradepro-auth-storage',
    }
  )
);