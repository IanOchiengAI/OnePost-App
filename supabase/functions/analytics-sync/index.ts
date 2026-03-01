import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { fetchMetaInsights, fetchTikTokInsights } from '../_shared/insights-api.ts'

serve(async (req) => {
    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Fetch posts that have platform IDs and are published
        const { data: posts, error: fetchError } = await supabaseAdmin
            .from('posts')
            .select('*')
            .eq('status', 'published')
            .not('platform_post_ids', 'is', null)

        if (fetchError) throw fetchError


        for (const post of posts || []) {
            const platformIds = post.platform_post_ids as Record<string, string>
            const metrics: Record<string, any> = {}

            // 2. Fetch social accounts for tokens
            const { data: accounts } = await supabaseAdmin
                .from('social_accounts')
                .select('*')
                .eq('user_id', post.user_id)
                .eq('is_connected', true)

            for (const [platform, platformId] of Object.entries(platformIds)) {
                const account = accounts?.find(a => a.platform === platform)
                if (!account) continue

                try {
                    if (platform === 'Facebook' || platform === 'Instagram') {
                        metrics[platform] = await fetchMetaInsights(platform as any, platformId, account.access_token)
                    } else if (platform === 'TikTok') {
                        metrics[platform] = await fetchTikTokInsights(platformId, account.access_token)
                    }
                } catch (err) {
                    // Fail silently or log to a dedicated monitoring service
                }
            }

            // 3. Upsert into post_analytics table
            const { error: upsertError } = await supabaseAdmin
                .from('post_analytics')
                .upsert({
                    post_id: post.id,
                    user_id: post.user_id,
                    metrics,
                    last_updated: new Date().toISOString()
                }, { onConflict: 'post_id' })

        }

        return new Response(JSON.stringify({ message: 'Analytics sync completed' }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        })
    }
})
