import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/config/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  verifyEmail: (email: string) => Promise<void>;
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
            // Check if email is verified
            if (!storedUsers[email].emailVerified) {
              throw new Error('Email is not confirmed. Please verify your email.');
            }
            
            const user: User = {
              id: storedUsers[email].id,
              email: email,
              name: storedUsers[email].name,
              emailVerified: storedUsers[email].emailVerified,
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
            emailVerified: false, // Start as unverified
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

          // Don't auto-login - user needs to verify email first
        } catch (error: any) {
          console.error('Signup error:', error);
          throw new Error(error.message || 'Signup failed');
        }
      },

      checkAuth: async () => {
        // Auth is persisted via zustand persist middleware
        // No need to check Supabase session
      },

      verifyEmail: async (email: string) => {
        try {
          // Get stored users from localStorage
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          if (storedUsers[email]) {
            storedUsers[email].emailVerified = true;
            localStorage.setItem('tradepro-users', JSON.stringify(storedUsers));
          } else {
            throw new Error('User not found');
          }
        } catch (error: any) {
          console.error('Email verification error:', error);
          throw new Error(error.message || 'Email verification failed');
        }
      },
    }),
    {
      name: 'tradepro-auth-storage',
    }
  )
);