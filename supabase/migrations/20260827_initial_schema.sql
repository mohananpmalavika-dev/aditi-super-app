-- ========================================================================
-- ADITI SUPER APP — PRODUCTION POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- Version: 2.0.0 (Hardened RLS & Exclusion Constraints)
-- ========================================================================

-- Enable required Postgres extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ========================================================================
-- 1. USER PROFILES & ACCOUNTS (Linked directly to auth.users)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT DEFAULT '',
    location TEXT DEFAULT 'Global',
    zodiac_sign TEXT,
    gender TEXT,
    date_of_birth DATE,
    time_of_birth TIME,
    place_of_birth TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Explicit RLS Policies for profiles
CREATE POLICY "Profiles are readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- Auto create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, handle, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'handle', '@' || split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================================
-- 2. USER RELATIONSHIPS & MODERATION (Friendships, Blocks, Reports)
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own friendships"
    ON public.friendships FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert friendships where they are the requester"
    ON public.friendships FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their friendships"
    ON public.friendships FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id OR auth.uid() = friend_id)
    WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete their friendships"
    ON public.friendships FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE TABLE IF NOT EXISTS public.user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocklist"
    ON public.user_blocks FOR SELECT
    TO authenticated
    USING (auth.uid() = blocker_id);

CREATE POLICY "Users can insert into their own blocklist"
    ON public.user_blocks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete from their own blocklist"
    ON public.user_blocks FOR DELETE
    TO authenticated
    USING (auth.uid() = blocker_id);

CREATE TABLE IF NOT EXISTS public.user_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    target_content_id TEXT,
    category TEXT NOT NULL CHECK (category IN ('spam', 'harassment', 'fraud', 'inappropriate', 'other')),
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can submit reports"
    ON public.user_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their submitted reports"
    ON public.user_reports FOR SELECT
    TO authenticated
    USING (auth.uid() = reporter_id);

-- ========================================================================
-- 3. CONVERSATIONS & MULTI-USER REALTIME MESSAGING
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'direct' CHECK (type IN ('direct', 'group', 'channel')),
    name TEXT,
    avatar_url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.conversation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view conversations they belong to"
    ON public.conversations FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_members
            WHERE conversation_members.conversation_id = conversations.id
            AND conversation_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Authenticated users can create conversations"
    ON public.conversations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update conversation metadata"
    ON public.conversations FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = created_by
        OR EXISTS (
            SELECT 1 FROM public.conversation_members
            WHERE conversation_members.conversation_id = conversations.id
            AND conversation_members.user_id = auth.uid()
            AND conversation_members.role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() = created_by
        OR EXISTS (
            SELECT 1 FROM public.conversation_members
            WHERE conversation_members.conversation_id = conversations.id
            AND conversation_members.user_id = auth.uid()
            AND conversation_members.role = 'admin'
        )
    );

CREATE POLICY "Members can view membership rows of their conversations"
    ON public.conversation_members FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.conversation_members AS cm
            WHERE cm.conversation_id = conversation_members.conversation_id
            AND cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users or admins can add members"
    ON public.conversation_members FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.conversations
            WHERE conversations.id = conversation_members.conversation_id
            AND conversations.created_by = auth.uid()
        )
    );

CREATE POLICY "Members can update their own preferences (pinned, muted)"
    ON public.conversation_members FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can leave or admins can remove members"
    ON public.conversation_members FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.conversations
            WHERE conversations.id = conversation_members.conversation_id
            AND conversations.created_by = auth.uid()
        )
    );

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    text TEXT NOT NULL DEFAULT '',
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video', 'audio', 'video_note', 'sticker', 'gif', 'file')),
    reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    is_disappearing BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation members can read active non-expired messages"
    ON public.messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.conversation_members
            WHERE conversation_members.conversation_id = messages.conversation_id
            AND conversation_members.user_id = auth.uid()
        )
        AND (expires_at IS NULL OR expires_at > NOW())
    );

CREATE POLICY "Conversation members can send messages"
    ON public.messages FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
            SELECT 1 FROM public.conversation_members
            WHERE conversation_members.conversation_id = messages.conversation_id
            AND conversation_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Senders can edit their messages"
    ON public.messages FOR UPDATE
    TO authenticated
    USING (auth.uid() = sender_id)
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Senders can delete their messages"
    ON public.messages FOR DELETE
    TO authenticated
    USING (auth.uid() = sender_id);

CREATE TABLE IF NOT EXISTS public.message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, emoji)
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view message reactions"
    ON public.message_reactions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.messages
            JOIN public.conversation_members ON conversation_members.conversation_id = messages.conversation_id
            WHERE messages.id = message_reactions.message_id
            AND conversation_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add reactions"
    ON public.message_reactions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their reactions"
    ON public.message_reactions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ========================================================================
-- 4. SOCIAL POSTS, COMMENTS, LIKES
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    tags TEXT[] DEFAULT '{}',
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts viewable by all authenticated users"
    ON public.posts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create their own posts"
    ON public.posts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
    ON public.posts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
    ON public.posts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes viewable by all authenticated users"
    ON public.post_likes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can like posts"
    ON public.post_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
    ON public.post_likes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments viewable by authenticated users"
    ON public.post_comments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can post comments"
    ON public.post_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
    ON public.post_comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ========================================================================
-- 5. REAL ESTATE MARKETPLACE
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('Buy', 'Rent', 'Commercial')),
    price NUMERIC NOT NULL,
    price_formatted TEXT NOT NULL,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    area_sqft INTEGER NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_review', 'published', 'sold', 'rented')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Properties viewable by all authenticated users"
    ON public.properties FOR SELECT
    TO authenticated
    USING (status = 'published' OR auth.uid() = owner_id);

CREATE POLICY "Users can insert property listings"
    ON public.properties FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their property listings"
    ON public.properties FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE TABLE IF NOT EXISTS public.property_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id, user_id)
);

ALTER TABLE public.property_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved properties"
    ON public.property_saves FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save properties"
    ON public.property_saves FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave properties"
    ON public.property_saves FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- ========================================================================
-- 6. MATRIMONY PROFILES & INTERESTS
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.matrimony_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    age INTEGER NOT NULL CHECK (age >= 18),
    height TEXT NOT NULL,
    profession TEXT NOT NULL,
    education TEXT NOT NULL,
    location TEXT NOT NULL,
    religion TEXT DEFAULT 'Hindu',
    community TEXT,
    star TEXT,
    photos TEXT[] DEFAULT '{}',
    about TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

ALTER TABLE public.matrimony_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active matrimony profiles viewable by authenticated users"
    ON public.matrimony_profiles FOR SELECT
    TO authenticated
    USING (is_active = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their matrimony profile"
    ON public.matrimony_profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their matrimony profile"
    ON public.matrimony_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.matrimony_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sender_id, recipient_id)
);

ALTER TABLE public.matrimony_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Interest visible to sender and recipient"
    ON public.matrimony_interests FOR SELECT
    TO authenticated
    USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send matrimony interests"
    ON public.matrimony_interests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update interest status"
    ON public.matrimony_interests FOR UPDATE
    TO authenticated
    USING (auth.uid() = recipient_id)
    WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Senders can withdraw interest"
    ON public.matrimony_interests FOR DELETE
    TO authenticated
    USING (auth.uid() = sender_id);

-- ========================================================================
-- 7. TUTOR MARKETPLACE & DOUBLE-BOOKING CONFLICT EXCLUSION
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.tutors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    hourly_rate NUMERIC NOT NULL,
    avatar_url TEXT NOT NULL,
    experience_years INTEGER NOT NULL DEFAULT 1,
    bio TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_verification')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active tutors viewable by authenticated users"
    ON public.tutors FOR SELECT
    TO authenticated
    USING (status = 'active' OR auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.tutor_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Strict PostgreSQL Double-Booking Exclusion Constraint
    CONSTRAINT no_overlapping_tutor_bookings
    EXCLUDE USING gist (
        tutor_id WITH =,
        tstzrange(start_at, end_at) WITH &&
    ) WHERE (status != 'cancelled')
);

ALTER TABLE public.tutor_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bookings viewable by student and tutor"
    ON public.tutor_bookings FOR SELECT
    TO authenticated
    USING (
        auth.uid() = student_id 
        OR auth.uid() = (SELECT user_id FROM public.tutors WHERE tutors.id = tutor_bookings.tutor_id)
    );

CREATE POLICY "Students can create bookings"
    ON public.tutor_bookings FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Participants can update booking status"
    ON public.tutor_bookings FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = student_id 
        OR auth.uid() = (SELECT user_id FROM public.tutors WHERE tutors.id = tutor_bookings.tutor_id)
    )
    WITH CHECK (
        auth.uid() = student_id 
        OR auth.uid() = (SELECT user_id FROM public.tutors WHERE tutors.id = tutor_bookings.tutor_id)
    );

-- ========================================================================
-- 8. PRODUCTIVITY: TASKS & HABITS
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMPTZ,
    completed BOOLEAN DEFAULT FALSE,
    category TEXT DEFAULT 'Personal',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their tasks"
    ON public.tasks FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their tasks"
    ON public.tasks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their tasks"
    ON public.tasks FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their tasks"
    ON public.tasks FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Health',
    color TEXT DEFAULT '#8b5cf6',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their habits"
    ON public.habits FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their habits"
    ON public.habits FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their habits"
    ON public.habits FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their habits"
    ON public.habits FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.habit_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, entry_date)
);

ALTER TABLE public.habit_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their habit entries"
    ON public.habit_entries FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their habit entries"
    ON public.habit_entries FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their habit entries"
    ON public.habit_entries FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ========================================================================
-- 9. PERFORMANCE INDEXES
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_city_price ON public.properties(city, price);
CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON public.tasks(user_id, due_date);
CREATE INDEX IF NOT EXISTS idx_bookings_tutor_time ON public.tutor_bookings(tutor_id, start_at);
