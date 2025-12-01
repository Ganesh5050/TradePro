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
          // First try Supabase authentication
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });

          if (error) {
            console.error('❌ Supabase login failed:', error.message);
            
            // If Supabase fails, check local storage for legacy users
            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
            const pendingUsers = JSON.parse(localStorage.getItem('tradepro-pending-users') || '{}');
            
            // Check if user is pending verification
            if (pendingUsers[email]) {
              throw new Error('Email is not confirmed. Please verify your email.');
            }
            
            if (storedUsers[email] && storedUsers[email].password === password) {
              // Legacy local user
              const user: User = {
                id: storedUsers[email].id,
                email: email,
                name: storedUsers[email].name,
                emailVerified: true,
              };
              set({ user, isAuthenticated: true });
              return;
            }
            
            throw new Error('Invalid email or password');
          }

          // Supabase login successful
          if (data.user) {
            console.log('✅ Supabase login successful:', data.user.email);
            
            // Check if user exists in local storage, if not create it
            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
            
            if (!storedUsers[email]) {
              const userId = 'user-' + Date.now();
              const newUser = {
                id: userId,
                email: email,
                password: 'supabase-authenticated',
                name: data.user.user_metadata?.name || email.split('@')[0],
                emailVerified: true,
                createdAt: new Date().toISOString(),
              };

              storedUsers[email] = newUser;
              localStorage.setItem('tradepro-users', JSON.stringify(storedUsers));

              // Create initial portfolio if not exists
              const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
              if (!portfolios[userId]) {
                portfolios[userId] = {
                  balance: 100000,
                  holdings: [],
                  transactions: [],
                };
                localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));
              }
            }

            const user: User = {
              id: storedUsers[email].id,
              email: email,
              name: storedUsers[email].name,
              emailVerified: true,
            };
            
            set({ user, isAuthenticated: true });
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
          console.log('📧 Creating user with proper Supabase authentication...');
          
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
            const pendingUser = pendingUsers[email];
            const createdAt = new Date(pendingUser.createdAt);
            const now = new Date();
            const timeDiff = now.getTime() - createdAt.getTime();
            const oneMinute = 60 * 1000; // 60 seconds in milliseconds
            
            if (timeDiff < oneMinute) {
              const remainingTime = Math.ceil((oneMinute - timeDiff) / 1000);
              throw new Error(`Please wait ${remainingTime} seconds before requesting another verification email.`);
            }
            
            // If 1 minute has passed, allow re-sending by updating the pending user
            console.log('1 minute passed, allowing re-send of verification email');
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

          // Send verification email using Supabase - PROPER WAY
          try {
            console.log('📧 Sending verification email to:', email);
            console.log('🔑 Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
            
            // Use proper Supabase signup with email confirmation
            const { data, error } = await supabase.auth.signUp({
              email: email,
              password: password,
              options: {
                emailRedirectTo: `${window.location.origin}/verify-email`,
                data: {
                  name: email.split('@')[0]
                }
              }
            });

            console.log('📧 Supabase signup response:', { data, error });

            if (error) {
              console.error('❌ Supabase signup failed:', error.message);
              
              // If Supabase is having database issues, we need to fix it properly
              if (error.message.includes('Database error saving new user')) {
                throw new Error('Supabase database is not configured properly. Please check your Supabase project settings and ensure the auth schema is correctly set up.');
              }
              
              throw new Error(`Failed to create user: ${error.message}. Please check your Supabase configuration.`);
            }

            if (data.user && !data.user.email_confirmed_at) {
              console.log('✅ User created successfully, verification email sent to:', email);
            } else if (data.user && data.user.email_confirmed_at) {
              console.log('✅ User created and email already confirmed:', email);
              // User is already confirmed, create local account
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

              // Create initial portfolio
              const portfolios = JSON.parse(localStorage.getItem('tradepro-portfolios') || '{}');
              portfolios[userId] = {
                balance: 100000,
                holdings: [],
                transactions: [],
              };
              localStorage.setItem('tradepro-portfolios', JSON.stringify(portfolios));

              // Remove from pending if exists
              delete pendingUsers[email];
              localStorage.setItem('tradepro-pending-users', JSON.stringify(pendingUsers));

              console.log('✅ User account fully created and ready to login');
              return; // Success - no error thrown
            }
            
          } catch (emailError) {
            console.error('❌ Email service error:', emailError);
            throw new Error('Email service is not configured. Please set up Supabase email authentication properly.');
          }

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