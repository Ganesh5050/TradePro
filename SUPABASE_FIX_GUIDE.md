# 🔧 SUPABASE DATABASE FIX GUIDE

## ❌ Current Issue
```
POST https://ycjdrsymcumenbbkffyx.supabase.co/auth/v1/signup 500 (Internal Server Error)
AuthApiError: Database error saving new user
```

## ✅ STEP-BY-STEP FIX

### 1. Go to Supabase Dashboard
- URL: https://ycjdrsymcumenbbkffyx.supabase.co
- Login with your credentials

### 2. Check Authentication Settings
- Navigate to **Authentication** → **Settings**
- Verify these settings:
  - **Site URL**: `http://localhost:8080`
  - **Redirect URLs**: `http://localhost:8080/verify-email`
  - **Enable email confirmations**: ✅ ON
  - **Enable email confirmations for new users**: ✅ ON

### 3. Configure Email Provider
- Navigate to **Authentication** → **Providers**
- Click on **Email** provider
- Ensure it's **Enabled**
- Choose one option:
  - **Option A**: Use Supabase's built-in email (recommended for development)
  - **Option B**: Configure custom SMTP settings

### 4. Fix Database Schema (SAFER APPROACH)
- Navigate to **SQL Editor** → **New Query**
- First, check what's in the auth tables:
```sql
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM auth.sessions;
SELECT COUNT(*) FROM auth.identities;
```

- **SAFER FIX** - Check constraints first:
```sql
-- Check for broken constraints
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid::regclass LIKE 'auth.%';
```

- **If you see constraint errors**, try this gentle fix:
```sql
-- Disable problematic constraints temporarily
ALTER TABLE auth.users DISABLE TRIGGER ALL;
ALTER TABLE auth.sessions DISABLE TRIGGER ALL;
ALTER TABLE auth.identities DISABLE TRIGGER ALL;

-- Re-enable triggers
ALTER TABLE auth.users ENABLE TRIGGER ALL;
ALTER TABLE auth.sessions ENABLE TRIGGER ALL;
ALTER TABLE auth.identities ENABLE TRIGGER ALL;
```

- **LAST RESORT ONLY** - If nothing else works:
```sql
-- WARNING: This deletes ALL users. Only use if absolutely necessary.
-- Better to create a new Supabase project instead.
DELETE FROM auth.users;
DELETE FROM auth.sessions;
DELETE FROM auth.identities;
DELETE FROM auth.refresh_tokens;
```

### 5. Test the Fix
- After running the SQL fixes, try signup again
- If still failing, check the **Logs** in Supabase dashboard
- Look for detailed error messages

### 6. Alternative: Create New Supabase Project
If the above doesn't work:
1. Create a new Supabase project
2. Update `.env` with new credentials
3. Run the setup wizard in the new project

## 🚀 After Fix
Once Supabase is working:
1. ✅ Real email verification will work
2. ✅ Users will receive confirmation emails
3. ✅ Only email owners can verify accounts
4. ✅ Secure authentication system

## 📞 If Issues Persist
Check Supabase logs for detailed error messages or contact Supabase support.
