import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string, defaultValue: string) => {
    let value = import.meta.env[key] || defaultValue;
    // Remove wrapping quotes if present (Vercel sometimes adds them)
    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
    }
    // Remove whitespace
    value = value.trim();
    return value;
};

const rawSupabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://ycjdrsymcumenbbkffyx.supabase.co');
// Ensure URL has protocol
const supabaseUrl = rawSupabaseUrl.startsWith('http') ? rawSupabaseUrl : `https://${rawSupabaseUrl}`;

const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljamRyc3ltY3VtZW5iYmtmZnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTY0MDQsImV4cCI6MjA3MTg3MjQwNH0.8E4MJxjYdJA1pjxFEy8WjB54Cjq96tr2MrrSjQN86bo');

console.log('🔌 Connecting to Supabase:', supabaseUrl); // Debug log

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
