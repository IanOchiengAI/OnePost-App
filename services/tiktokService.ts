import { supabase } from './supabaseClient';
import { Post } from '../types';

const TIKTOK_CLIENT_KEY = import.meta.env.VITE_TIKTOK_CLIENT_KEY;
const REDIRECT_URI = `${window.location.origin}/auth/callback/tiktok`;

/**
 * Service for TikTok integration.
 */
export const TikTokService = {
    /**
     * Initiates the TikTok OAuth flow.
     */
    initiateLogin: () => {
        if (!TIKTOK_CLIENT_KEY) {
            console.error('TikTok Client Key is missing.');
            return;
        }

        const scope = [
            'user.info.basic',
            'video.upload',
            'video.publish'
        ].join(',');

        const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=tiktok_auth`;

        window.location.href = authUrl;
    },

    /**
     * Handles the OAuth callback from TikTok.
     */
    handleCallback: async (code: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('tiktok-oauth-exchange', {
                body: { code, redirectUri: REDIRECT_URI }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in handleTikTokCallback:', error);
            throw error;
        }
    },

    /**
     * Publishes a post to TikTok.
     */
    publish: async (post: Post, accessToken: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('tiktok-publish', {
                body: {
                    postId: post.id,
                    caption: post.caption,
                    mediaUrls: [post.image],
                    accessToken
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error publishing to TikTok:', error);
            throw error;
        }
    }
};
