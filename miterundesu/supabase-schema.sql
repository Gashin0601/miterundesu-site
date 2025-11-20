-- ============================================
-- ミテルンデス - Supabase データベーススキーマ
-- ============================================

-- 1. お問い合わせテーブル (contacts)
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('press', 'store', 'usage', 'other')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_contacts_status ON public.contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_inquiry_type ON public.contacts(inquiry_type);

-- RLS (Row Level Security) 有効化
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- サービスロールのみ全アクセス可能
CREATE POLICY "Service role can do everything on contacts"
  ON public.contacts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- 2. 店舗導入申請テーブル (store_applications)
CREATE TABLE IF NOT EXISTS public.store_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  poster_type TEXT NOT NULL CHECK (poster_type IN ('green', 'orange', 'both')),
  location TEXT,
  email TEXT,
  phone TEXT,
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'contacted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_store_applications_status ON public.store_applications(status);
CREATE INDEX IF NOT EXISTS idx_store_applications_created_at ON public.store_applications(created_at DESC);

-- RLS 有効化
ALTER TABLE public.store_applications ENABLE ROW LEVEL SECURITY;

-- サービスロールのみ全アクセス可能
CREATE POLICY "Service role can do everything on store_applications"
  ON public.store_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- 3. プレス申請テーブル (press_applications)
CREATE TABLE IF NOT EXISTS public.press_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  coverage_content TEXT NOT NULL,
  publication_date DATE,
  required_period_start DATE,
  required_period_end DATE,
  note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'code_sent')),
  press_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_press_applications_status ON public.press_applications(status);
CREATE INDEX IF NOT EXISTS idx_press_applications_created_at ON public.press_applications(created_at DESC);

-- RLS 有効化
ALTER TABLE public.press_applications ENABLE ROW LEVEL SECURITY;

-- サービスロールのみ全アクセス可能
CREATE POLICY "Service role can do everything on press_applications"
  ON public.press_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================
-- 自動更新トリガー (updated_at)
-- ============================================

-- トリガー関数作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 既存のトリガーを削除してから追加
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_store_applications_updated_at ON public.store_applications;
CREATE TRIGGER update_store_applications_updated_at
  BEFORE UPDATE ON public.store_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_press_applications_updated_at ON public.press_applications;
CREATE TRIGGER update_press_applications_updated_at
  BEFORE UPDATE ON public.press_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- 完了メッセージ
-- ============================================
-- スキーマの作成が完了しました。
-- Supabase Dashboard > SQL Editor でこのSQLを実行してください。
