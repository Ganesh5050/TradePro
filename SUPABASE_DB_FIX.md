# Supabase Database Error Fix

## Error: "Database error saving new user"

This error occurs when Supabase auth schema is corrupted or missing tables.

## Quick Fix Steps:

### 1. Check Supabase Auth Schema
Go to Supabase Dashboard → Database → SQL Editor and run:

```sql
-- Check if auth schema exists
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'auth';
```

### 2. Check Critical Tables
```sql
-- Check if users table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth' 
AND table_name = 'users';
```

### 3. If Missing, Recreate Auth Schema
⚠️ **WARNING**: This will delete all existing users!

```sql
-- Drop and recreate auth schema (ONLY if you're okay losing data)
DROP SCHEMA IF EXISTS auth CASCADE;
CREATE SCHEMA auth;

-- Supabase will automatically recreate the required tables
-- when you restart the project or make a new signup attempt
```

### 4. Alternative: Contact Supabase Support
If you have important data, contact Supabase support instead of recreating.

### 5. Test After Fix
Try signup again - should work without database errors.

## For Now: Use Mock Data
Since this is a database configuration issue, your frontend should work with mock data while you fix Supabase.
