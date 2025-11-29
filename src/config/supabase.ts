import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ycjdrsymcumenbbkffyx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljamRyc3ltY3VtZW5iYmtmZnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTY0MDQsImV4cCI6MjA3MTg3MjQwNH0.8E4MJxjYdJA1pjxFEy8WzQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
