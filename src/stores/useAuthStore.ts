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
  verifyEmail: (email: string, code: string) => Promise<void>;
  pendingUsers: { [email: string]: { password: string; name?: string; tempId: string } };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      pendingUsers: {},

      login: async (email: string, password: string) => {
        try {
          console.log('🚀 QUICK FIX - Logging in user...');
          
          // Get stored users from localStorage
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          if (storedUsers[email] && storedUsers[email].password === password) {
            const user: User = {
              id: storedUsers[email].id,
              email: email,
              name: storedUsers[email].name,
              emailVerified: true,
            };
            set({ user, isAuthenticated: true });
            console.log('✅ Login successful!');
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
          console.log('🚀 QUICK FIX - Creating user...');
          
          // Check if user exists
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          if (storedUsers[email]) {
            throw new Error('User already exists');
          }

          // Create user immediately (temporary bypass)
          const userId = 'user-' + Date.now();
          const newUser = {
            id: userId,
            email: email,
            password: password,
            name: email.split('@')[0],
            emailVerified: true,
            createdAt: new Date().toISOString(),
          };

          storedUsers[email] = newUser;
          localStorage.setItem('tradepro-users', JSON.stringify(storedUsers));

          // Create portfolio
          const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
          portfolios[userId] = {
            balance: 100000,
            holdings: [],
            transactions: [],
          };
          localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));

          console.log('✅ User created successfully!');
          
        } catch (error: any) {
          console.error('Signup error:', error);
          throw new Error(error.message || 'Signup failed');
        }
      },

      verifyEmail: async (email: string, code: string) => {
        try {
          // Get verification codes
          const verificationCodes = JSON.parse(localStorage.getItem('tradepro-verification-codes') || '{}');
          const storedCode = verificationCodes[email];

          if (!storedCode || storedCode.code !== code) {
            throw new Error('Invalid verification code');
          }

          // Check if code is expired ( 5 minutes
          const createdAt = new Date(storedCode.createdAt);
          const now = new Date();
          const timeDiff = now.getTime() - createdAt.getTime();
          const fiveMinutes = 5 * 60 * 1000;

          if (timeDiff > fiveMinutes) {
            throw new Error('Verification code has expired');
          }

          // Get pending users
          const pendingUsers = JSON.parse(localStorage.getItem('tradepro-pending-users') || '{}');
          
          if (!pendingUsers[email]) {
            throw new Error('User not found or already verified');
          }

          const pendingUser = pendingUsers[email];

          // Get stored users (verified users)
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          // Double check no verified user exists
          if (storedUsers[email]) {
            throw new Error('User already verified');
          }

          // Now create the actual user in the main database
          const userId = 'user-' + Date.now();
          const newUser = {
            id: userId,
            email: email,
            password: pendingUser.password, // Use original password
            name: pendingUser.name,
            emailVerified: true, // User is now verified
            createdAt: new Date().toISOString(),
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

          // Remove from pending users and verification codes
          delete pendingUsers[email];
          delete verificationCodes[email];
          localStorage.setItem('tradepro-pending-users', JSON.stringify(pendingUsers));
          localStorage.setItem('tradepro-verification-codes', JSON.stringify(verificationCodes));

          // Update store state
          set({ pendingUsers });

        } catch (error: any) {
          console.error('Email verification error:', error);
          throw new Error(error.message || 'Email verification failed');
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