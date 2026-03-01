-- Create post-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-media', 'post-media', true) ON CONFLICT (id) DO NOTHING;
-- Storage Policies
CREATE POLICY "Post media is publicly accessible" ON storage.objects FOR
SELECT USING (bucket_id = 'post-media');
CREATE POLICY "Users can upload post media" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'post-media'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Users can update their own post media" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'post-media'
        AND auth.uid() = (storage.foldername(name)) [1]::uuid
    );
CREATE POLICY "Users can delete their own post media" ON storage.objects FOR DELETE USING (
    bucket_id = 'post-media'
    AND auth.uid() = (storage.foldername(name)) [1]::uuid
);