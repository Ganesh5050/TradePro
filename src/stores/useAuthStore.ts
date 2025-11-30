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
  verifyEmail: (email: string, password: string, name?: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
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
          // Get stored users from localStorage (only verified users)
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          // Get pending users
          const pendingUsers = JSON.parse(localStorage.getItem('tradepro-pending-users') || '{}');
          
          // Check if user is pending verification
          if (pendingUsers[email]) {
            throw new Error('Email is not confirmed. Please verify your email.');
          }
          
          if (storedUsers[email] && storedUsers[email].password === password) {
            // All stored users are verified by definition now
            const user: User = {
              id: storedUsers[email].id,
              email: email,
              name: storedUsers[email].name,
              emailVerified: true,
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
          // Get stored users from localStorage (only verified users)
          const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
          
          // Check if user already exists AND is verified
          if (storedUsers[email]) {
            throw new Error('User already exists');
          }

          // Get pending users
          const pendingUsers = JSON.parse(localStorage.getItem('tradepro-pending-users') || '{}');
          
          // Check if user is already pending verification
          if (pendingUsers[email]) {
            throw new Error('Verification email already sent. Please check your email.');
          }

          // Create pending user (not in main database yet)
          const tempId = 'pending-' + Date.now();
          const pendingUser = {
            password: password,
            name: email.split('@')[0],
            tempId: tempId,
            createdAt: new Date().toISOString(),
          };

          pendingUsers[email] = pendingUser;
          localStorage.setItem('tradepro-pending-users', JSON.stringify(pendingUsers));

          // Update store state
          set({ pendingUsers });

          // Send verification email
          const { error } = await supabase.auth.api.sendMagicLink({
            email,
            options: {
              emailRedirectTo: 'https://your-app.com/verify-email',
            },
          });

          if (error) {
            throw new Error(error.message);
          }

        } catch (error: any) {
          console.error('Signup error:', error);
          throw new Error(error.message || 'Signup failed');
        }
      },

      checkAuth: async () => {
        // Auth is persisted via zustand persist middleware
        // No need to check Supabase session
      },

      verifyEmail: async (email: string, password: string, name?: string) => {
        try {
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
            name: name || pendingUser.name,
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

          // Remove from pending users
          delete pendingUsers[email];
          localStorage.setItem('tradepro-pending-users', JSON.stringify(pendingUsers));

          // Update store state
          set({ pendingUsers });

        } catch (error: any) {
          console.error('Email verification error:', error);
          throw new Error(error.message || 'Email verification failed');
        }
      },

      resendVerificationEmail: async (email: string) => {
        try {
          // Get pending users
          const pendingUsers = JSON.parse(localStorage.getItem('tradepro-pending-users') || '{}');
          
          if (!pendingUsers[email]) {
            throw new Error('Email not found. Please signup first.');
          }

          // Send verification email
          const { error } = await supabase.auth.api.sendMagicLink({
            email,
            options: {
              emailRedirectTo: 'https://your-app.com/verify-email',
            },
          });

          if (error) {
            throw new Error(error.message);
          }

        } catch (error: any) {
          console.error('Resend verification email error:', error);
          throw new Error(error.message || 'Failed to resend verification email');
        }
      },
    }),
    {
      name: 'tradepro-auth-storage',
    }
  )
);