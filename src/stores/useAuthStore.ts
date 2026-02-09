import { create } from 'zustand';
import { supabase } from '../config/supabase';

interface User {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    signup: (email: string, password: string, name?: string) => Promise<{ success: boolean; message: string }>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    checkAuth: async () => {
        try {
            console.log('🔍 Checking auth session...');
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                console.log('✅ Session found:', session.user.email);
                const user: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                    emailVerified: true
                };
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                console.log('❌ No session found');
                set({ user: null, isAuthenticated: false, isLoading: false });
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange((_event, session) => {
                console.log('🔄 Auth state changed:', _event, session?.user?.email);
                if (session?.user) {
                    const user: User = {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                        emailVerified: true
                    };
                    set({ user, isAuthenticated: true, isLoading: false });
                } else {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            });
        } catch (error) {
            console.error('❌ Check auth error:', error);
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    login: async (email, password) => {
        try {
            console.log('🔐 Attempting login:', email);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error('❌ Login error:', error.message);
                throw error;
            }

            if (data.user) {
                console.log('✅ Login successful:', data.user.email);
                const user: User = {
                    id: data.user.id,
                    email: data.user.email || '',
                    name: data.user.user_metadata?.name || email.split('@')[0],
                    emailVerified: true
                };
                set({ user, isAuthenticated: true });
                return { success: true, message: 'Logged in successfully' };
            }

            return { success: false, message: 'Login failed' };
        } catch (error: any) {
            console.error('❌ Login failed:', error.message);
            return { success: false, message: error.message || 'Invalid email or password' };
        }
    },

    signup: async (email, password, name) => {
        try {
            console.log('📝 Attempting signup:', email);

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name || email.split('@')[0],
                    }
                }
            });

            if (error) {
                console.error('❌ Signup error:', error.message);
                throw error;
            }

            if (data.user) {
                console.log('✅ Signup successful:', data.user.email);

                // Check if email confirmation is required
                if (data.user.identities && data.user.identities.length === 0) {
                    return {
                        success: false,
                        message: 'User already exists. Please login instead.'
                    };
                }

                // If email confirmation is disabled, user can login immediately
                if (data.session) {
                    const user: User = {
                        id: data.user.id,
                        email: data.user.email || '',
                        name: data.user.user_metadata?.name || email.split('@')[0],
                        emailVerified: true
                    };
                    set({ user, isAuthenticated: true });
                    return { success: true, message: 'Account created successfully! You are now logged in.' };
                }

                // Email confirmation required
                return {
                    success: true,
                    message: 'Account created! Please check your email to verify your account.'
                };
            }

            return { success: false, message: 'Signup failed' };
        } catch (error: any) {
            console.error('❌ Signup failed:', error.message);
            return { success: false, message: error.message || 'Signup failed' };
        }
    },

    logout: async () => {
        try {
            console.log('🚪 Logging out...');
            await supabase.auth.signOut();
            set({ user: null, isAuthenticated: false });
            console.log('✅ Logged out successfully');
        } catch (error) {
            console.error('❌ Logout error:', error);
        }
    },
}));
