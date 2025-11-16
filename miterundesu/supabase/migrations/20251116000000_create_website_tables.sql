-- ============================================================
-- Migration: Create website tables for miterundesu
-- Description: Creates tables for contact forms, store applications,
--              and press applications
-- ============================================================

-- 1. contacts テーブル（お問い合わせフォーム）
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('press', 'store', 'usage', 'other')),
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. store_applications テーブル（店舗導入申し込み）
CREATE TABLE IF NOT EXISTS public.store_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL,
    industry TEXT NOT NULL CHECK (industry IN ('supermarket', 'convenience', 'museum', 'theater', 'hospital', 'other')),
    poster_type TEXT NOT NULL CHECK (poster_type IN ('green', 'orange')),
    location TEXT,
    email TEXT,
    phone TEXT,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. press_applications テーブル（プレスモード申請）
CREATE TABLE IF NOT EXISTS public.press_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    coverage_content TEXT NOT NULL,
    publication_date DATE,
    required_period_start DATE,
    required_period_end DATE,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    press_code TEXT UNIQUE,
    code_expires_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. stores テーブル（承認された店舗情報）
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.store_applications(id),
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    poster_type TEXT NOT NULL CHECK (poster_type IN ('green', 'orange')),
    location TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. press_codes テーブル（発行されたプレスコード）
CREATE TABLE IF NOT EXISTS public.press_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.press_applications(id),
    code TEXT NOT NULL UNIQUE,
    media_name TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    used_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- Indexes for better query performance
-- ============================================================

-- contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_inquiry_type ON public.contacts(inquiry_type);

-- store_applications indexes
CREATE INDEX IF NOT EXISTS idx_store_apps_status ON public.store_applications(status);
CREATE INDEX IF NOT EXISTS idx_store_apps_created_at ON public.store_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_apps_industry ON public.store_applications(industry);

-- press_applications indexes
CREATE INDEX IF NOT EXISTS idx_press_apps_status ON public.press_applications(status);
CREATE INDEX IF NOT EXISTS idx_press_apps_code ON public.press_applications(press_code);
CREATE INDEX IF NOT EXISTS idx_press_apps_created_at ON public.press_applications(created_at DESC);

-- stores indexes
CREATE INDEX IF NOT EXISTS idx_stores_active ON public.stores(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_industry ON public.stores(industry);
CREATE INDEX IF NOT EXISTS idx_stores_poster_type ON public.stores(poster_type);

-- press_codes indexes
CREATE INDEX IF NOT EXISTS idx_press_codes_code ON public.press_codes(code);
CREATE INDEX IF NOT EXISTS idx_press_codes_active ON public.press_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_press_codes_expires_at ON public.press_codes(expires_at);

-- ============================================================
-- Functions: Auto-update updated_at timestamp
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_applications_updated_at
    BEFORE UPDATE ON public.store_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_press_applications_updated_at
    BEFORE UPDATE ON public.press_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at
    BEFORE UPDATE ON public.stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_press_codes_updated_at
    BEFORE UPDATE ON public.press_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_codes ENABLE ROW LEVEL SECURITY;

-- contacts policies
CREATE POLICY "Anyone can insert contacts" ON public.contacts
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Service role can view all contacts" ON public.contacts
    FOR SELECT TO service_role USING (true);

CREATE POLICY "Service role can update contacts" ON public.contacts
    FOR UPDATE TO service_role USING (true);

CREATE POLICY "Service role can delete contacts" ON public.contacts
    FOR DELETE TO service_role USING (true);

-- store_applications policies
CREATE POLICY "Anyone can insert store applications" ON public.store_applications
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Service role can view all store applications" ON public.store_applications
    FOR SELECT TO service_role USING (true);

CREATE POLICY "Service role can update store applications" ON public.store_applications
    FOR UPDATE TO service_role USING (true);

CREATE POLICY "Service role can delete store applications" ON public.store_applications
    FOR DELETE TO service_role USING (true);

-- press_applications policies
CREATE POLICY "Anyone can insert press applications" ON public.press_applications
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Service role can view all press applications" ON public.press_applications
    FOR SELECT TO service_role USING (true);

CREATE POLICY "Service role can update press applications" ON public.press_applications
    FOR UPDATE TO service_role USING (true);

CREATE POLICY "Service role can delete press applications" ON public.press_applications
    FOR DELETE TO service_role USING (true);

-- stores policies (public read access for approved stores)
CREATE POLICY "Anyone can view active stores" ON public.stores
    FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Service role has full access to stores" ON public.stores
    FOR ALL TO service_role USING (true);

-- press_codes policies (restricted access)
CREATE POLICY "Service role has full access to press codes" ON public.press_codes
    FOR ALL TO service_role USING (true);

-- ============================================================
-- Comments for documentation
-- ============================================================

COMMENT ON TABLE public.contacts IS 'お問い合わせフォームからの送信データ';
COMMENT ON TABLE public.store_applications IS '店舗導入申し込みデータ';
COMMENT ON TABLE public.press_applications IS 'プレスモード申請データ';
COMMENT ON TABLE public.stores IS '承認された店舗情報（公開用）';
COMMENT ON TABLE public.press_codes IS '発行されたプレスコード';
