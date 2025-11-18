-- ============================================================
-- Migration: Add position field to press_applications table
-- Description: Adds position (役職・部署) field to support
--              the press application form
-- ============================================================

-- Add position column to press_applications table
ALTER TABLE public.press_applications
ADD COLUMN IF NOT EXISTS position TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.press_applications.position IS '役職・部署（任意フィールド）';
