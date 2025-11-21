-- ============================================================
-- Migration: Create press_accounts table for User ID + Password authentication
-- Description: Creates the new authentication system for press mode
-- Date: 2025-11-21
-- ============================================================

-- First, ensure the helper function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. press_accounts テーブル（プレスモード認証用）
CREATE TABLE IF NOT EXISTS public.press_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    organization_type TEXT CHECK (organization_type IN ('newspaper', 'tv', 'magazine', 'web_media', 'other')),
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    approved_by TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes for better query performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_press_accounts_user_id ON public.press_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_press_accounts_active ON public.press_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_press_accounts_expires_at ON public.press_accounts(expires_at);
CREATE INDEX IF NOT EXISTS idx_press_accounts_organization ON public.press_accounts(organization_name);

-- ============================================================
-- Triggers: Auto-update updated_at timestamp
-- ============================================================

DROP TRIGGER IF EXISTS update_press_accounts_updated_at ON public.press_accounts;
CREATE TRIGGER update_press_accounts_updated_at
    BEFORE UPDATE ON public.press_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

ALTER TABLE public.press_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own account" ON public.press_accounts;
DROP POLICY IF EXISTS "Anonymous can check user_id for login" ON public.press_accounts;
DROP POLICY IF EXISTS "Service role has full access to press accounts" ON public.press_accounts;

-- Allow authenticated users to read their own account
CREATE POLICY "Users can view their own account" ON public.press_accounts
    FOR SELECT TO authenticated
    USING (user_id = current_user);

-- Allow anonymous users to check if user_id exists (for login)
CREATE POLICY "Anonymous can check user_id for login" ON public.press_accounts
    FOR SELECT TO anon
    USING (is_active = true);

-- Service role has full access
CREATE POLICY "Service role has full access to press accounts" ON public.press_accounts
    FOR ALL TO service_role USING (true);

-- ============================================================
-- Helper function: Check password (will be used by app)
-- ============================================================

-- Note: Password verification will be done in the app using bcrypt
-- This table stores bcrypt hashed passwords

-- ============================================================
-- Insert test/review accounts
-- ============================================================

-- Review account for App Store Review
-- Password: ReviewPass2025 (will be hashed)
-- This is a placeholder - real hash will be inserted via separate script

INSERT INTO public.press_accounts (
    user_id,
    password_hash,
    organization_name,
    organization_type,
    contact_person,
    email,
    approved_by,
    approved_at,
    expires_at,
    is_active
) VALUES (
    'apple-review',
    '$2a$10$PLACEHOLDER_WILL_BE_UPDATED',
    'App Store Review Team',
    'other',
    'App Review',
    'appstore-review@apple.com',
    'System',
    NOW(),
    '2099-12-31'::TIMESTAMP WITH TIME ZONE,
    true
) ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- Comments for documentation
-- ============================================================

COMMENT ON TABLE public.press_accounts IS 'プレスモード認証用アカウント（ユーザーID + パスワード方式）';
COMMENT ON COLUMN public.press_accounts.user_id IS 'ログイン用ユーザーID（一意）';
COMMENT ON COLUMN public.press_accounts.password_hash IS 'bcryptハッシュ化されたパスワード';
COMMENT ON COLUMN public.press_accounts.organization_name IS '組織名';
COMMENT ON COLUMN public.press_accounts.expires_at IS 'アカウント有効期限';
COMMENT ON COLUMN public.press_accounts.is_active IS 'アカウント有効フラグ';
COMMENT ON COLUMN public.press_accounts.last_login_at IS '最終ログイン日時';
