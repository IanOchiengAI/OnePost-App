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

export interface Post {
  id: string;
  image: string; // Base64 data URI
  caption: string;
  platforms: Platform[];
  format: PostFormat;
  scheduledDate: string | null; // ISO string if scheduled, null if "post now"
  status: PostStatus;
  createdAt: string;
}

export interface ViewState {
  currentTab: 'home' | 'calendar' | 'create' | 'groups' | 'profile';
}