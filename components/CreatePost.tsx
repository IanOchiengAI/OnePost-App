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
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.Instagram]);
  const [format, setFormat] = useState<PostFormat>(PostFormat.Post);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHashtagModal, setShowHashtagModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
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
    if (!image) return;
    setIsGenerating(true);
    try {
      const generated = await generateCaptionFromImage(image);
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

  const handlePost = (schedule: boolean) => {
    if (!image) return;
    
    // For demo, just mock a schedule date if scheduling
    const scheduledDate = schedule ? new Date(Date.now() + 86400000).toISOString() : null; // Tomorrow

    onSave({
      image,
      caption,
      platforms: selectedPlatforms,
      format,
      scheduledDate,
      status: schedule ? PostStatus.Scheduled : PostStatus.Published
    });
  };

  const handleSaveDraft = () => {
    if (!image) return;
    
    onSave({
      image,
      caption,
      platforms: selectedPlatforms,
      format,
      scheduledDate: null, // Drafts don't have a schedule date yet
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
    <div className="w-full h-full bg-background-light dark:bg-background-dark relative flex flex