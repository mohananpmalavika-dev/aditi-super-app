-- ========================================================================
-- ADITI SUPER APP — DELETE USER ACCOUNTS FROM DATABASE
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ========================================================================

-- OPTION 1: Delete ALL user accounts from the database
-- (Cascades automatically to public.profiles, posts, chats, matrimony, properties, tasks, etc.)
DELETE FROM auth.users;

-- ------------------------------------------------------------------------

-- OPTION 2: Delete a specific user account by email
-- Replace 'user@example.com' with the email address you want to remove:
-- DELETE FROM auth.users WHERE email = 'user@example.com';

-- ------------------------------------------------------------------------

-- OPTION 3: Delete dummy / test accounts by email pattern
-- DELETE FROM auth.users WHERE email ILIKE '%test%' OR email ILIKE '%demo%' OR email ILIKE '%dummy%';
