# Aditi Super App — Database Architecture & Schema

## 1. Overview
The database engine uses **PostgreSQL 15** hosted on Supabase with strict **Row Level Security (RLS)** applied across all user-facing and financial tables.

## 2. Core Entities

### 1. `profiles`
- Primary Key: `id UUID` (Foreign Key to `auth.users(id)` ON DELETE CASCADE)
- Attributes: `name`, `email`, `handle`, `avatar_url`, `bio`, `location`, `zodiac_sign`, `gender`, `date_of_birth`, `time_of_birth`, `place_of_birth`, `is_verified`, `email_verified`, `phone_verified`.
- Policies: Publicly readable for authenticated members; writable only by owner (`auth.uid() = id`).

### 2. `friendships` & `user_blocks`
- Manages 1-on-1 social graph and privacy blocklists.
- Constraints: `UNIQUE(user_id, friend_id)`, `UNIQUE(blocker_id, blocked_id)`.

### 3. `conversations` & `messages`
- `conversations`: Group and 1-on-1 message threads.
- `conversation_members`: Explicit membership linking with pinned/muted states.
- `messages`: Server-authoritative messages with `expires_at TIMESTAMPTZ` for disappearing messages.

### 4. `posts`, `post_likes`, `post_comments`
- Normalized feed relations.
- `post_likes`: `UNIQUE(post_id, user_id)` ensuring accurate multi-user like counts.

### 5. `properties` & `property_saves`
- Real estate listings with geolocation, pricing, media arrays, and bookmark associations.

### 6. `matrimony_profiles` & `matrimony_interests`
- Privacy-controlled matchmaking profiles with verified status, star/zodiac signs, and interest dispatch tracking.

### 7. `tutors` & `tutor_bookings`
- Educational marketplace with conflict-protected time slot reservations (`start_at`, `end_at`).

### 8. `tasks`, `habits`, `habit_entries`
- Productivity and personal LifeOS tracker with daily habit completion logs.

## 3. Row Level Security (RLS) Policy Design Pattern
All user-owned data adheres strictly to:
```sql
CREATE POLICY "Users own their records"
    ON public.table_name FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```
