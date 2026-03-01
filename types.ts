export enum Platform {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  TikTok = 'TikTok'
}

export enum PostFormat {
  Post = 'Post',
  Story = 'Story'
}

export enum PostStatus {
  Draft = 'Draft',
  Scheduled = 'Scheduled',
  Publishing = 'Publishing',
  Published = 'Published',
  Failed = 'Failed'
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  avatarUrl: string;
  isConnected: boolean;
}

export interface HashtagGroup {
  id: string;
  name: string;
  tags: string; // stored as string for simple editing, e.g. "#sale #fashion"
}

export type BrandVoice = 'Professional' | 'Playful' | 'Sales' | 'Helpful';

export interface PostAnalytics {
  reach: number;
  engagement: number;
  likes: number;
  shares: number;
  comments: number;
}

export interface Post {
  id: string;
  image: string; // Base64 data URI or URL
  caption: string;
  platforms: Platform[];
  mediaType: 'image' | 'video'; // New field for video support
  platformPostIds?: Record<string, string>; // Store platform-specific IDs for analytics
  format: PostFormat;
  scheduledDate: string | null;
  scheduled_at: string | null;
  status: PostStatus;
  createdAt: string;
  analytics?: PostAnalytics;
}

export interface ViewState {
  currentTab: 'home' | 'calendar' | 'create' | 'groups' | 'profile';
}