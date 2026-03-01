import { supabase } from './supabaseClient';
import { Post, Platform } from '../types';

const FB_APP_ID = import.meta.env.VITE_FB_APP_ID;
const REDIRECT_URI = `${window.location.origin}/auth/callback/meta`;

/**
 * Service for Meta (Facebook/Instagram) integration.
 */
export const MetaService = {
    /**
     * Initiates the Meta OAuth flow for Business.
     */
    initiateLogin: () => {
        if (!FB_APP_ID) {
            console.error('Meta App ID is missing.');
            return;
        }

        const scope = [
            'public_profile',
            'instagram_basic',
            'instagram_content_publish',
            'pages_show_list',
            'pages_read_engagement',
            'pages_manage_posts'
        ].join(',');

        const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scope}&response_type=code`;

        window.location.href = authUrl;
    },

    /**
     * Handles the OAuth callback from Meta.
     * Sends the code to a Supabase Edge Function to exchange for tokens.
     */
    handleCallback: async (code: string) => {
        try {
            const { data, error } = await supabase.functions.invoke('meta-oauth-exchange', {
                body: { code, redirectUri: REDIRECT_URI }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in handleMetaCallback:', error);
            throw error;
        }
    },

    /**
     * Publishes a post to Meta (Facebook/Instagram).
     */
    publish: async (post: Post, accessToken: string, platform: Platform) => {
        // This logic would normally hit the Meta Graph API.
        // Since we're in a browser environment, we'll likely proxy this through an Edge Function 
        // to handle the actual API request and avoid CORS/security issues with tokens.

        try {
            const { data, error } = await supabase.functions.invoke('meta-publish', {
                body: {
                    postId: post.id,
                    caption: post.caption,
                    mediaUrls: [post.image], // Simplification for now
                    accessToken,
                    targetPlatform: platform // 'Facebook' or 'Instagram'
                }
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error(`Error publishing to ${platform}:`, error);
            throw error;
        }
    }
};
