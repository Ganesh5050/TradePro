# 🔧 SUPABASE DASHBOARD FIX

## Since we can't modify auth schema directly, let's check dashboard settings

### Step 1: Authentication Settings
1. Go to https://ycjdrsymcumenbbkffyx.supabase.co
2. Navigate to **Authentication** → **Settings**
3. Check these exact settings:
   - **Enable email confirmations**: Must be ✅ ON
   - **Enable email confirmations for new users**: Must be ✅ ON
   - **Site URL**: `http://localhost:8080`
   - **Redirect URLs**: `http://localhost:8080/verify-email`

### Step 2: Email Provider Configuration
1. Go to **Authentication** → **Providers**
2. Click on **Email** provider
3. Ensure:
   - **Enable email provider**: ✅ ON
   - **Allow new users to sign up**: ✅ ON
   - **Confirm email signups**: ✅ ON
   - **Secure email change**: ✅ ON

### Step 3: Check for Schema Issues
1. Go to **Database** → **Extensions**
2. Ensure `pg_cron` and `pg_net` are enabled
3. Go to **Database** → **Triggers**
4. Look for any auth-related triggers that might be failing

### Step 4: API Settings
1. Go to **Project Settings** → **API**
2. Check JWT settings are correct
3. Ensure service role key is valid

## If dashboard settings are correct:
The issue might be a corrupted auth schema that only Supabase support can fix.
Contact Supabase support with the error details.
