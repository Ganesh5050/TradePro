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
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const user: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                    emailVerified: true // Assume verified for now since we bypass
                };
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }

            supabase.auth.onAuthStateChange((_event, session) => {
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
            console.error('Check auth error:', error);
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        try {
            // 1. Verify with custom backend
            try {
                const checkResponse = await fetch('http://localhost:3001/api/check-custom-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (checkResponse.ok) {
                    const checkData = await checkResponse.json();
                    if (!checkData.canLogin) {
                        return { success: false, message: checkData.message };
                    }
                }
            } catch (err) {
                console.warn('Backend check failed, proceeding with Supabase login anyway');
            }

            // 2. Login with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
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
            return { success: false, message: error.message || 'Login failed' };
        }
    },

    signup: async (email, password, name) => {
        try {
            // Signup with Supabase - No email confirmation
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: undefined, // Disable confirmation
                    data: {
                        name: name || email.split('@')[0],
                    }
                }
            });

            if (error) throw error;

            if (data.user) {
                // Log in immediately
                const user: User = {
                    id: data.user.id,
                    email: data.user.email || '',
                    name: name || email.split('@')[0],
                    emailVerified: true
                };
                set({ user, isAuthenticated: true });
                return { success: true, message: 'Account created successfully!' };
            }

            return { success: false, message: 'Signup failed' };
        } catch (error: any) {
            return { success: false, message: error.message || 'Signup failed' };
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
    }
}));
