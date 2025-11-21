-- ============================================================
-- Migration: Add notes column to press_accounts table
-- Description: Add optional notes field for additional information
-- Date: 2025-11-21
-- ============================================================

ALTER TABLE public.press_accounts
ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN public.press_accounts.notes IS '備考・その他情報';
