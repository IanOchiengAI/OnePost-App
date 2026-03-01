-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    content TEXT,
    media_urls JSONB DEFAULT '[]'::jsonb,
    scheduled_at TIMESTAMPTZ,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Hashtag groups
CREATE TABLE IF NOT EXISTS hashtag_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    hashtags TEXT [] DEFAULT '{}'::text [],
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Social accounts
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    platform TEXT NOT NULL,
    platform_user_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    UNIQUE(user_id, platform)
);
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR
INSERT WITH CHECK (auth.uid() = id);
-- Posts Policies
CREATE POLICY "Users can view their own posts" ON posts FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own posts" ON posts FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = user_id);
-- Hashtag Groups Policies
CREATE POLICY "Users can view their own hashtag groups" ON hashtag_groups FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own hashtag groups" ON hashtag_groups FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hashtag groups" ON hashtag_groups FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hashtag groups" ON hashtag_groups FOR DELETE USING (auth.uid() = user_id);
-- Social Accounts Policies
CREATE POLICY "Users can view their own social accounts" ON social_accounts FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own social accounts" ON social_accounts FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own social accounts" ON social_accounts FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own social accounts" ON social_accounts FOR DELETE USING (auth.uid() = user_id);