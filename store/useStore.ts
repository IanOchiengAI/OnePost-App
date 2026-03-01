import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Post, HashtagGroup, SocialAccount, Platform, BrandVoice } from '../types';

interface AuthSession {
    user: {
        id: string;
        email: string;
    } | null;
    expires_at?: number;
}

interface AppState {
    posts: Post[];
    hashtagGroups: HashtagGroup[];
    accounts: SocialAccount[];
    session: AuthSession | null;
    onboardingComplete: boolean;
    brandVoice: BrandVoice;

    // Actions
    setOnboardingComplete: (complete: boolean) => void;
    setBrandVoice: (voice: BrandVoice) => void;
    setPosts: (posts: Post[]) => void;
    addPost: (post: Omit<Post, 'id' | 'createdAt'>) => void;
    updatePost: (id: string, updates: Partial<Post>) => void;
    deletePost: (id: string) => void;
    setHashtagGroups: (groups: HashtagGroup[]) => void;
    addHashtagGroup: (group: HashtagGroup) => void;
    deleteHashtagGroup: (id: string) => void;
    setAccounts: (accounts: SocialAccount[]) => void;
    updateAccount: (id: string, updates: Partial<SocialAccount>) => void;
    setSession: (session: AuthSession | null) => void;
}

const INITIAL_ACCOUNTS: SocialAccount[] = [];

const INITIAL_HASHTAGS: HashtagGroup[] = [];

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            posts: [],
            hashtagGroups: INITIAL_HASHTAGS,
            accounts: INITIAL_ACCOUNTS,
            session: null,
            onboardingComplete: false,
            brandVoice: 'Professional',

            setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
            setBrandVoice: (brandVoice) => set({ brandVoice }),

            setPosts: (posts) => set({ posts }),
            addPost: (post) => set((state) => ({
                posts: [{
                    ...post,
                    id: Math.random().toString(36).substr(2, 9),
                    createdAt: new Date().toISOString(),
                    scheduled_at: post.scheduledDate // Mapping for Supabase consistency in store
                } as Post, ...state.posts]
            })),
            updatePost: (id, updates) => set((state) => ({
                posts: state.posts.map(p => p.id === id ? {
                    ...p,
                    ...updates,
                    scheduled_at: updates.scheduledDate !== undefined ? updates.scheduledDate : p.scheduled_at
                } : p)
            })),
            deletePost: (id) => set((state) => ({
                posts: state.posts.filter(p => p.id !== id)
            })),

            setHashtagGroups: (hashtagGroups) => set({ hashtagGroups }),
            addHashtagGroup: (group) => set((state) => ({
                hashtagGroups: [...state.hashtagGroups, group]
            })),
            deleteHashtagGroup: (id) => set((state) => ({
                hashtagGroups: state.hashtagGroups.filter(g => g.id !== id)
            })),

            setAccounts: (accounts) => set({ accounts }),
            updateAccount: (id, updates) => set((state) => ({
                accounts: state.accounts.map(acc => acc.id === id ? { ...acc, ...updates } : acc)
            })),

            setSession: (session) => set({ session }),
        }),
        {
            name: 'onepost-storage',
        }
    )
);
