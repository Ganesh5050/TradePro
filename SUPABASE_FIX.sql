-- SAFE FIX: Recreate missing auth.config table
-- This is the exact cause of "Database error saving new user"

-- 1. Create the missing auth.config table
CREATE TABLE IF NOT EXISTS auth.config (
    name text PRIMARY KEY,
    value text
);

-- 2. Insert required email configuration
INSERT INTO auth.config (name, value) VALUES 
('external_email_enabled', 'true'),
('mailer_autoconfirm', 'false'),
('mailer_secure_email_change_enabled', 'true'),
('sms_autoconfirm', 'false')
ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value;

-- 3. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.config TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.config TO service_role;
