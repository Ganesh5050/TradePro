# 🔍 SUPABASE SETTINGS CHECKLIST

## Go to: https://ycjdrsymcumenbbkffyx.supabase.co

### 1. Authentication → Settings
- [ ] Site URL: `http://localhost:8080`
- [ ] Redirect URLs: `http://localhost:8080/verify-email`
- [ ] Enable email confirmations: ✅ ON
- [ ] Enable email confirmations for new users: ✅ ON
- [ ] Enable phone confirmations: (can be OFF)

### 2. Authentication → Providers
- [ ] Email provider: ✅ Enabled
- [ ] "Allow new users to sign up": ✅ ON
- [ ] "Confirm email signups": ✅ ON
- [ ] "Secure email change": ✅ ON

### 3. Project Settings → API
- [ ] JWT Settings → Expiry time: 3600 (1 hour)
- [ ] JWT Settings → Refresh token expiry: 604800 (7 days)

### 4. Database → Replication
- [ ] auth schema: ✅ Enabled for replication
- [ ] realtime: ✅ Enabled

### 5. Run Diagnostic SQL
- Open SQL Editor
- Run queries from SUPABASE_DIAGNOSTIC.sql
- Note any errors or unexpected results
