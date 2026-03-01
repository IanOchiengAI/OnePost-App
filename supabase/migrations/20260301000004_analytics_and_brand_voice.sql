-- Analytics Snapshots table for Reach, Engagement, and Likes
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE
    SET NULL,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        platform TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        -- e.g., 'reach', 'engagement', 'likes'
        metric_value INTEGER NOT NULL DEFAULT 0,
        snapshot_at TIMESTAMPTZ DEFAULT NOW()
);
-- Add brand_voice_prompt to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS brand_voice_prompt TEXT;
-- Enable RLS for analytics
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
-- Analytics Policies
CREATE POLICY "Users can view their own analytics" ON analytics_snapshots FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analytics" ON analytics_snapshots FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can insert analytics" ON analytics_snapshots FOR ALL USING (auth.role() = 'service_role');