-- ==============================================================================
-- YIELDNEST.ONLINE - SUPABASE DATABASE SCHEMA FOR ADMINISTRATORS
-- ==============================================================================
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- Project: cmgqwpnuddynznmgjqsp.supabase.co
-- ==============================================================================

-- 1. Enable pgcrypto extension for password encryption & UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Dedicated public.admin_users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT 'YieldNest Administrator',
    role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'admin', 'editor', 'analyst')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);

-- 4. Automatic updated_at Trigger
CREATE OR REPLACE FUNCTION public.handle_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_admin_users_updated_at();

-- 5. Seed / Register Authorized Admins in public.admin_users
INSERT INTO public.admin_users (email, full_name, role, is_active)
VALUES 
    ('ns.hariharasudhan@gmail.com', 'Harihara Sudhan (Master Admin)', 'super_admin', true),
    ('harihns.0306@gmail.com', 'Harihara Sudhan (Alternate Admin)', 'super_admin', true)
ON CONFLICT (email) DO UPDATE 
SET 
    role = EXCLUDED.role,
    is_active = true,
    updated_at = now();

-- 6. Link with existing auth.users ID if present
UPDATE public.admin_users a
SET auth_user_id = u.id
FROM auth.users u
WHERE LOWER(a.email) = LOWER(u.email);

-- 7. Ensure Admin Role and Email Confirmation in auth.users
UPDATE auth.users
SET 
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    raw_app_meta_data = jsonb_set(
        jsonb_set(COALESCE(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"'),
        '{is_admin}', 'true'::jsonb
    ),
    raw_user_meta_data = jsonb_set(
        jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"admin"'),
        '{is_admin}', 'true'::jsonb
    ),
    updated_at = now()
WHERE email IN ('ns.hariharasudhan@gmail.com', 'harihns.0306@gmail.com');

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Service role has unrestricted access
DROP POLICY IF EXISTS "Service role admin full access" ON public.admin_users;
CREATE POLICY "Service role admin full access"
    ON public.admin_users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Authenticated admins can view admin user profiles
DROP POLICY IF EXISTS "Authenticated users can read admin list" ON public.admin_users;
CREATE POLICY "Authenticated users can read admin list"
    ON public.admin_users
    FOR SELECT
    USING (true);

-- Grant table permissions
GRANT SELECT ON public.admin_users TO anon;
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;

-- ==============================================================================
-- HOW TO SET / RESET YOUR PASSWORD IN SUPABASE SQL EDITOR:
-- ==============================================================================
-- If you ever want to set a specific password for your admin account directly in SQL,
-- replace 'YourDesiredPassword123' with your chosen password and run:
--
-- UPDATE auth.users
-- SET encrypted_password = crypt('YourDesiredPassword123', gen_salt('bf')),
--     email_confirmed_at = now(),
--     updated_at = now()
-- WHERE email = 'ns.hariharasudhan@gmail.com';
-- ==============================================================================
