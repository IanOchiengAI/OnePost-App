import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { publishToMeta } from '../_shared/meta-api.ts'
import { publishToTikTok } from '../_shared/tiktok-api.ts'

serve(async (req) => {
    try {
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Get postId from request body if available (for immediate publish)
        const { postId } = await req.json().catch(() => ({}))

        // 2. Query for posts (either specific ID or scheduled and due)
        let query = supabaseAdmin.from('posts').select('*')

        if (postId) {
            query = query.eq('id', postId)
        } else {
            query = query.eq('status', 'scheduled').lte('scheduled_at', new Date().toISOString())
        }

        const { data: posts, error: fetchError } = await query

        if (fetchError) throw fetchError

        if (!posts || posts.length === 0) {
            return new Response(JSON.stringify({ message: 'No posts due for publishing' }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            })
        }


        const overallResults = []

        for (const post of posts) {
            // 2. Mark as publishing to prevent double-processing
            await supabaseAdmin
                .from('posts')
                .update({ status: 'publishing' })
                .eq('id', post.id)

            try {
                // 3. Get the social accounts for this user/post
                const platforms = post.platforms as string[]

                const { data: accounts, error: accountError } = await supabaseAdmin
                    .from('social_accounts')
                    .select('*')
                    .in('platform', platforms)
                    .eq('user_id', post.user_id)
                    .eq('is_connected', true)

                if (accountError) throw accountError

                const platformResults = await Promise.allSettled(
                    platforms.map(async (platform) => {
                        const account = accounts?.find(a => a.platform === platform)
                        if (!account) {
                            throw new Error(`No connected account found for ${platform}`)
                        }

                        const accessToken = account.access_token // Should handle decryption if needed
                        const mediaType = post.media_type || 'image'

                        if (platform === 'Facebook' || platform === 'Instagram') {
                            return await publishToMeta(platform, post.caption, post.media_urls, accessToken, mediaType)
                        } else if (platform === 'TikTok') {
                            return await publishToTikTok(post.caption, post.media_urls, accessToken, mediaType)
                        } else {
                            throw new Error(`Unsupported platform: ${platform}`)
                        }
                    })
                )

                const allSuccessful = platformResults.every(r => r.status === 'fulfilled')
                const someSuccessful = platformResults.some(r => r.status === 'fulfilled')

                const finalStatus = allSuccessful
                    ? 'published'
                    : (someSuccessful ? 'published' : 'failed') // Could be 'partially_published'

                // 4. Store platform post IDs for analytics tracking
                const platformPostIds: Record<string, string> = {}
                platformResults.forEach((res, index) => {
                    if (res.status === 'fulfilled') {
                        platformPostIds[platforms[index]] = (res.value as any).platform_post_id
                    }
                })

                await supabaseAdmin
                    .from('posts')
                    .update({
                        status: finalStatus,
                        published_at: new Date().toISOString(),
                        platform_post_ids: platformPostIds // JSONB field for tracking
                    })
                    .eq('id', post.id)

                overallResults.push({ id: post.id, status: finalStatus, platformPostIds })
            } catch (postError) {
                await supabaseAdmin
                    .from('posts')
                    .update({ status: 'failed' })
                    .eq('id', post.id)
                overallResults.push({ id: post.id, status: 'failed', error: postError.message })
            }
        }

        return new Response(JSON.stringify({ results: overallResults }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        })
    }
})
