-- ========================================================================
-- ADITI SUPER APP — Real-time Friendship & Multi-User Social Sync Migration
-- Version: 2026.08.30
-- ========================================================================

-- 1. Ensure friendships table exists with resilient status check
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Update constraint if table already existed with old constraint
ALTER TABLE public.friendships DROP CONSTRAINT IF EXISTS friendships_status_check;
ALTER TABLE public.friendships ADD CONSTRAINT friendships_status_check 
    CHECK (status IN ('pending', 'accepted', 'rejected', 'declined'));

-- 2. Enable Real-Time Replication on friendships table
ALTER TABLE public.friendships REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Row Level Security Policies for Friendships
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can select their own friendships" ON public.friendships;
DROP POLICY IF EXISTS "Public select friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can insert friendships where they are the requester" ON public.friendships;
DROP POLICY IF EXISTS "Users can update their friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can delete their friendships" ON public.friendships;

-- Allow reading friendships for involved users (and authenticated/anon reads for lookup)
CREATE POLICY "Users can select their own friendships"
    ON public.friendships FOR SELECT
    USING (
        auth.uid() IS NULL 
        OR auth.uid() = user_id 
        OR auth.uid() = friend_id
    );

-- Allow authenticated users to send/insert requests
CREATE POLICY "Users can insert friendships where they are the requester"
    ON public.friendships FOR INSERT
    WITH CHECK (
        auth.uid() IS NULL 
        OR auth.uid() = user_id
    );

-- Allow both users to update friendship status (e.g. Accept / Decline)
CREATE POLICY "Users can update their friendships"
    ON public.friendships FOR UPDATE
    USING (
        auth.uid() IS NULL 
        OR auth.uid() = user_id 
        OR auth.uid() = friend_id
    )
    WITH CHECK (
        auth.uid() IS NULL 
        OR auth.uid() = user_id 
        OR auth.uid() = friend_id
    );

-- Allow deleting friendships
CREATE POLICY "Users can delete their friendships"
    ON public.friendships FOR DELETE
    USING (
        auth.uid() IS NULL 
        OR auth.uid() = user_id 
        OR auth.uid() = friend_id
    );

-- 4. Ensure profiles are readable so users can discover & resolve handles/emails
DROP POLICY IF EXISTS "Profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Profiles are readable by everyone"
    ON public.profiles FOR SELECT
    USING (true);
