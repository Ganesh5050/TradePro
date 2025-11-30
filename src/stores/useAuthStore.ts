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
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            // Check if error is due to unconfirmed email
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

            // Create initial portfolio if it doesn't exist
            await createInitialPortfolio(data.user.id);
          }
        } catch (error: any) {
          console.error('Login error:', error);
          throw new Error(error.message || 'Login failed');
        }
      },
  
      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, isAuthenticated: false, isEmailVerified: false });
        } catch (error) {
          console.error('Logout error:', error);
          // Still clear local state even if Supabase logout fails
          set({ user: null, isAuthenticated: false, isEmailVerified: false });
        }
      },
  
      signup: async (email: string, password: string, name?: string) => {
        try {
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
            // User is automatically signed in (email might be auto-confirmed in dev)
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

            // Create initial portfolio
            await createInitialPortfolio(data.user.id);
          }
        } catch (error: any) {
          console.error('Signup error:', error);
          throw new Error(error.message || 'Signup failed');
        }
      },

      checkAuth: async () => {
        try {
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
        } catch (error) {
          console.error('Auth check error:', error);
          set({ user: null, isAuthenticated: false, isEmailVerified: false });
        }
      },

      resendVerification: async () => {
        try {
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

// Helper function to create initial portfolio
async function createInitialPortfolio(userId: string) {
  try {
    // Check if portfolio already exists
    const { data: existingPortfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingPortfolio) {
      // Create new portfolio with initial balance
      const { error } = await supabase
        .from('portfolios')
        .insert({
          user_id: userId,
          balance: 100000,
          holdings: [],
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error creating initial portfolio:', error);
      }
    }
  } catch (error) {
    console.error('Error in createInitialPortfolio:', error);
  }
}