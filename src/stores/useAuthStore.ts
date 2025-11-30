import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/config/supabase';

interface User {
  id: string;
  email: string;
  name?: string;
  email_confirmed_at?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  resendVerification: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isEmailVerified: false,
  
      login: async (email: string, password: string) => {
        try {
          // Check if we're in development mode and using localhost
          const isDevelopment = import.meta.env.DEV;
          
          if (isDevelopment) {
            // Use localStorage for development
            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
            
            if (storedUsers[email] && storedUsers[email].password === password) {
              // Check if email is verified
              if (storedUsers[email].emailVerified === false) {
                throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
              }
              
              const user: User = {
                id: storedUsers[email].id,
                email: email,
                name: storedUsers[email].name,
                email_confirmed_at: new Date().toISOString(), // Auto-verify in dev
              };
              set({ user, isAuthenticated: true, isEmailVerified: true });
            } else {
              throw new Error('Invalid email or password');
            }
          } else {
            // Use Supabase for production
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error) {
              if (error.message.includes('Email not confirmed')) {
                throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
              }
              throw new Error(error.message);
            }

            if (data.user) {
              const isVerified = !!data.user.email_confirmed_at;
              
              if (!isVerified) {
                throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
              }

              const user: User = {
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || email.split('@')[0],
                email_confirmed_at: data.user.email_confirmed_at,
              };
              
              set({ 
                user, 
                isAuthenticated: true, 
                isEmailVerified: true 
              });
            }
          }
        } catch (error: any) {
          console.error('Login error:', error);
          throw new Error(error.message || 'Login failed');
        }
      },
  
      logout: async () => {
        try {
          const isDevelopment = import.meta.env.DEV;
          
          if (!isDevelopment) {
            await supabase.auth.signOut();
          }
          
          set({ user: null, isAuthenticated: false, isEmailVerified: false });
        } catch (error) {
          console.error('Logout error:', error);
          set({ user: null, isAuthenticated: false, isEmailVerified: false });
        }
      },
  
      signup: async (email: string, password: string, name?: string) => {
        try {
          const isDevelopment = import.meta.env.DEV;
          
          if (isDevelopment) {
            // Use localStorage for development but simulate email verification
            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
            
            if (storedUsers[email]) {
              throw new Error('User already exists');
            }

            const userId = 'user-' + Date.now();
            const newUser = {
              id: userId,
              email: email,
              password: password,
              name: name || email.split('@')[0],
              emailVerified: false, // Mark as not verified initially
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

            // Don't auto-login - show email verification message
            throw new Error('Account created! Please check your email to verify your account before logging in.');
          } else {
            // Use Supabase for production
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  name: name || email.split('@')[0],
                },
              },
            });

            if (error) {
              throw new Error(error.message);
            }

            if (data.user && !data.session) {
              // Email confirmation required
              throw new Error('Account created! Please check your email to verify your account before logging in.');
            }

            if (data.user && data.session) {
              const user: User = {
                id: data.user.id,
                email: data.user.email!,
                name: data.user.user_metadata?.name || email.split('@')[0],
                email_confirmed_at: data.user.email_confirmed_at,
              };
              
              set({ 
                user, 
                isAuthenticated: true, 
                isEmailVerified: !!data.user.email_confirmed_at 
              });
            }
          }
        } catch (error: any) {
          console.error('Signup error:', error);
          throw new Error(error.message || 'Signup failed');
        }
      },

      checkAuth: async () => {
        try {
          const isDevelopment = import.meta.env.DEV;
          
          if (isDevelopment) {
            // Auth is persisted via zustand persist middleware in development
            return;
          } else {
            // Check Supabase session in production
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
              const isVerified = !!session.user.email_confirmed_at;
              const user: User = {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                email_confirmed_at: session.user.email_confirmed_at,
              };
              
              set({ 
                user, 
                isAuthenticated: true, 
                isEmailVerified: isVerified 
              });
            } else {
              set({ user: null, isAuthenticated: false, isEmailVerified: false });
            }
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, isAuthenticated: false, isEmailVerified: false });
        }
      },

      resendVerification: async () => {
        try {
          const isDevelopment = import.meta.env.DEV;
          
          if (isDevelopment) {
            // Simulate email verification in development
            const { user } = get();
            if (!user?.email) {
              throw new Error('No email address found');
            }

            // Mark email as verified in localStorage
            const storedUsers = JSON.parse(localStorage.getItem('tradepro-users') || '{}');
            if (storedUsers[user.email]) {
              storedUsers[user.email].emailVerified = true;
              localStorage.setItem('tradepro-users', JSON.stringify(storedUsers));
            }
            
            return; // Success
          }

          const { user } = get();
          if (!user?.email) {
            throw new Error('No email address found');
          }

          const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email,
          });

          if (error) {
            throw new Error(error.message);
          }
        } catch (error: any) {
          console.error('Resend verification error:', error);
          throw new Error(error.message || 'Failed to resend verification email');
        }
      },
    }),
    {
      name: 'tradepro-auth-storage',
    }
  )
);