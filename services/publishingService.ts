import { supabase } from './supabaseClient';
import { Post, Platform, PostStatus } from '../types';
import { MetaService } from './metaService';
import { TikTokService } from './tiktokService';

/**
 * Unified service for publishing posts across multiple platforms.
 */
export const PublishingService = {
    /**
     * Publishes a post to all selected platforms by invoking the unified 'publisher' Edge Function.
     */
    publishPost: async (post: Post) => {
        try {
            const { data, error } = await supabase.functions.invoke('publisher', {
                body: { postId: post.id }
            });

            if (error) throw error;

            return {
                status: data.results?.[0]?.status || PostStatus.Failed,
                results: data.results
            };
        } catch (error) {
            console.error('Error triggering publish:', error);
            throw error;
        }
    }
};
