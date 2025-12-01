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
          console.log('🔐 Using proper Supabase authentication...');
          
          // Use Supabase authentication
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          });

          if (error) {
            console.error('❌ Supabase login failed:', error.message);
            throw new Error(error.message);
          }

          if (data.user) {
            console.log('✅ Supabase login successful:', data.user.email);
            
            // Create user in local storage for app data
            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
            
            if (!storedUsers[email]) {
              const userId = data.user.id;
              const newUser = {
                id: userId,
                email: email,
                password: 'supabase-authenticated',
                name: data.user.user_metadata?.name || email.split('@')[0],
                emailVerified: data.user.email_confirmed_at ? true : false,
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
              emailVerified: storedUsers[email].emailVerified,
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
            throw new Error(`Failed to create user: ${error.message}`);
          }

          if (data.user && !data.user.email_confirmed_at) {
            console.log('✅ User created successfully, verification email sent to:', email);
            // User needs to verify email
            return;
          } else if (data.user && data.user.email_confirmed_at) {
            console.log('✅ User created and email already confirmed:', email);
            // User is already confirmed, create local account
            const userId = data.user.id;
            const newUser = {
              id: userId,
              email: email,
              password: 'supabase-authenticated',
              name: data.user.user_metadata?.name || email.split('@')[0],
              emailVerified: true,
              createdAt: new Date().toISOString(),
            };

            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
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

            console.log('✅ User account fully created and ready to login');
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
        try {
          console.log('🔍 Checking Supabase session...');
          
          // Check current Supabase session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ Session check failed:', error);
            set({ user: null, isAuthenticated: false });
            return;
          }

          if (session?.user) {
            console.log('✅ Valid Supabase session found:', session.user.email);
            
            // Get user from local storage or create if not exists
            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
            const email = session.user.email;
            
            if (!storedUsers[email]) {
              const userId = session.user.id;
              const newUser = {
                id: userId,
                email: email,
                password: 'supabase-authenticated',
                name: session.user.user_metadata?.name || email.split('@')[0],
                emailVerified: session.user.email_confirmed_at ? true : false,
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
              emailVerified: storedUsers[email].emailVerified,
            };
            
            set({ user, isAuthenticated: true });
          } else {
            console.log('🔓 No valid session found');
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('❌ Auth check error:', error);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'tradepro-auth-storage',
    }
  )
);