/**
 * Shared utility for fetching post insights from social platforms.
 */

/**
 * Fetches metrics for a Meta (Facebook or Instagram) post.
 */
export async function fetchMetaInsights(
    platform: 'Facebook' | 'Instagram',
    postId: string,
    accessToken: string
) {

    // Real implementation: https://developers.facebook.com/docs/instagram-api/reference/ig-media/insights/
    // Example metrics: reach, impressions, engagement, saved

    const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error(`Meta Insights error: ${response.statusText}`);

    // MOCK DATA
    return {
        reach: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 1500),
        engagement: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 50)
    };
}

/**
 * Fetches metrics for a TikTok video.
 */
export async function fetchTikTokInsights(
    postId: string,
    accessToken: string
) {

    // Real implementation: https://developers.tiktok.com/doc/display-api-get-video-list/

    const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) throw new Error(`TikTok Insights error: ${response.statusText}`);

    // MOCK DATA
    return {
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 200),
        shares: Math.floor(Math.random() * 20),
        comments: Math.floor(Math.random() * 10)
    };
}
