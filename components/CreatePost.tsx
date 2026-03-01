import React, { useState, useRef } from 'react';
import { Platform, Post, PostStatus, HashtagGroup, PostFormat } from '../types';
import { generateCaptionFromImage } from '../services/geminiService';

interface CreatePostProps {
  onSave: (post: Omit<Post, 'id' | 'createdAt'>) => void;
  hashtagGroups: HashtagGroup[];
  onBack: () => void;
  onOpenHashtagManager: () => void;
}

const MAX_CHARS = 2200;

export const CreatePost: React.FC<CreatePostProps> = ({ onSave, hashtagGroups, onBack, onOpenHashtagManager }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.Instagram]);
  const [format, setFormat] = useState<PostFormat>(PostFormat.Post);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showHashtagModal, setShowHashtagModal] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIsVideo(file.type.startsWith('video/'));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleGenerateCaption = async () => {
    if (!imagePreview) return;
    setIsGenerating(true);
    try {
      const generated = await generateCaptionFromImage(imagePreview);
      setCaption(prev => {
        const newCaption = prev ? prev + '\n\n' + generated : generated;
        return newCaption.slice(0, MAX_CHARS);
      });
    } catch (err) {
      console.error(err);
      alert("Oops! Couldn't generate a caption right now. Please check your internet connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async (schedule: boolean) => {
    if (!imagePreview) return;

    setIsUploading(true);

    // Simulate real upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo, just mock a schedule date if scheduling
    const scheduledDate = schedule ? new Date(Date.now() + 86400000).toISOString() : null; // Tomorrow

    onSave({
      image: imagePreview, // Will eventually be the uploaded URL
      caption,
      platforms: selectedPlatforms,
      format,
      mediaType: isVideo ? 'video' : 'image',
      scheduledDate,
      scheduled_at: scheduledDate, // Aligning with Supabase field name
      status: schedule ? PostStatus.Scheduled : PostStatus.Published
    });

    setIsUploading(false);
  };

  const handleSaveDraft = () => {
    if (!imagePreview) return;

    onSave({
      image: imagePreview,
      caption,
      platforms: selectedPlatforms,
      format,
      mediaType: isVideo ? 'video' : 'image',
      scheduledDate: null,
      scheduled_at: null, // Drafts don't have a schedule date yet
      status: PostStatus.Draft
    });
  };

  const insertHashtags = (tags: string) => {
    setCaption(prev => {
      const newCaption = prev + (prev.length > 0 ? ' ' : '') + tags;
      return newCaption.slice(0, MAX_CHARS);
    });
    setShowHashtagModal(false);
  };

  return (
    <div className="w-full h-full bg-background-light dark:bg-background-dark relative flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-xl font-bold tracking-tight">Create Post</h2>
        </div>
        <button
          onClick={handleSaveDraft}
          disabled={!imagePreview || isUploading}
          className="text-sm font-semibold text-primary hover:opacity-80 disabled:opacity-30 transition-opacity"
        >
          Save Draft
        </button>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
        {/* Media Upload/Preview */}
        <div className="mb-6">
          {imagePreview ? (
            <div className="relative rounded-2xl overflow-hidden aspect-square group shadow-lg bg-black">
              {isVideo ? (
                <video
                  src={imagePreview}
                  controls
                  className="w-full h-full object-contain"
                  autoPlay
                  muted
                  loop
                />
              ) : (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-fadeIn z-10">
                  <div className="size-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-3"></div>
                  <p className="text-xs font-bold uppercase tracking-widest">Uploading Media...</p>
                </div>
              )}
              <button
                onClick={() => {
                  setImagePreview(null);
                  setSelectedFile(null);
                  setIsVideo(false);
                }}
                disabled={isUploading}
                className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden z-20"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1.5 z-10">
                <span className="material-symbols-outlined text-white text-[12px]">{isVideo ? 'movie' : 'aspect_ratio'}</span>
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">{isVideo ? 'Original Video' : '1:1 Square'}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square rounded-2xl border-2 border-dashed border-neutral-border dark:border-slate-800 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors group bg-neutral-surface/20 dark:bg-surface-dark/50"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Add Image or Video</p>
              <p className="text-[10px] text-slate-400">TikTok posts require video</p>
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="hidden"
          />
        </div>

        {/* Platform Selection */}
        <div className="mb-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Publish to</p>
          <div className="flex gap-3">
            {[Platform.Instagram, Platform.Facebook, Platform.TikTok].map(platform => (
              <button
                key={platform}
                onClick={() => togglePlatform(platform)}
                className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${selectedPlatforms.includes(platform)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-neutral-border dark:border-slate-800 text-slate-400'
                  }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {platform === Platform.Instagram ? 'photo_camera' : platform === Platform.Facebook ? 'public' : 'music_note'}
                </span>
                <span className="text-[10px] font-bold">{platform}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Caption Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Caption</p>
            <button
              onClick={handleGenerateCaption}
              disabled={!imagePreview || isGenerating || isUploading}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 disabled:opacity-30 transition-all bg-primary/10 px-3 py-1.5 rounded-full"
            >
              <span className={`material-symbols-outlined text-sm ${isGenerating ? 'animate-spin' : ''}`}>
                {isGenerating ? 'autorenew' : 'auto_awesome'}
              </span>
              {isGenerating ? 'Generating...' : 'Magic AI'}
            </button>
          </div>
          <div className="relative">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, MAX_CHARS))}
              placeholder="What's on your mind?"
              className="w-full h-32 p-4 rounded-2xl bg-white dark:bg-surface-dark border border-neutral-border dark:border-slate-800 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none transition-shadow"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400">
              {caption.length}/{MAX_CHARS}
            </div>
          </div>
        </div>

        {/* Hashtags Helper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saved Hashtags</p>
            <button onClick={onOpenHashtagManager} className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">Manage</button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {hashtagGroups.map(group => (
              <button
                key={group.id}
                onClick={() => insertHashtags(group.tags)}
                className="flex-shrink-0 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all border border-transparent hover:border-primary/30"
              >
                + {group.name}
              </button>
            ))}
            {hashtagGroups.length === 0 && (
              <p className="text-xs text-slate-400 italic">No groups saved yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95 z-20">
        <div className="flex gap-3">
          <button
            onClick={() => handlePost(true)}
            disabled={!imagePreview || isUploading}
            className="flex-1 py-4 px-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            {isUploading ? '...' : 'Schedule'}
          </button>
          <button
            onClick={() => {
              if (selectedPlatforms.includes(Platform.TikTok) && !isVideo) {
                alert("TikTok posts must be videos. Please upload a video file.");
                return;
              }
              handlePost(false);
            }}
            disabled={!imagePreview || isUploading}
            className="flex-[1.5] py-4 px-4 rounded-2xl bg-primary text-slate-900 font-bold text-sm shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg font-bold">{isUploading ? 'sync' : 'send'}</span>
            {isUploading ? 'Uploading...' : isVideo ? 'Post Video' : 'Post Now'}
          </button>
        </div>
      </footer>
    </div>
  );
};