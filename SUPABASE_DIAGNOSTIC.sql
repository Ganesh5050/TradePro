-- SAFE DIAGNOSTIC QUERIES - NO DELETION
-- Run these one by one in Supabase SQL Editor

-- 1. Check if auth schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'auth';

-- 2. Check auth tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth';

-- 3. Check current users (just count, no data exposure)
SELECT COUNT(*) as total_users FROM auth.users;

-- 4. Check for any constraint issues (FIXED VERSION)
SELECT conname, conrelid::regclass::text, confrelid::regclass::text 
FROM pg_constraint 
WHERE conrelid::regclass::text LIKE 'auth.%';

-- 5. Check recent auth errors in logs
SELECT * FROM auth.audit_log_entries ORDER BY created_at DESC LIMIT 5;

-- 6. Check if email confirmation is enabled
SELECT * FROM auth.config WHERE name = 'external_email_enabled';
