-- Migration: Add creator_notes table

CREATE TABLE public.creator_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.creator_notes ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own notes
CREATE POLICY "Users can insert their own creator notes"
ON public.creator_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only allow authenticated users to view their own notes
CREATE POLICY "Users can view their own creator notes"
ON public.creator_notes
FOR SELECT
USING (auth.uid() = user_id);
