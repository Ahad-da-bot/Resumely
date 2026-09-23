-- ==============================================================================
-- ADD ACHIEVEMENTS COLUMN TO PROFILES TABLE
-- ==============================================================================

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;

-- Comment for clarity
COMMENT ON COLUMN public.profiles.achievements IS 'Academic and professional honors, awards, and certifications JSONB list';
