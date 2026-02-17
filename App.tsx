import React, { useState, useEffect } from 'react';
import { CreatePost } from './components/CreatePost';
import { CalendarView } from './components/CalendarView';
import { Settings } from './components/Settings';
import { Dashboard } from './components/Dashboard';
import { HashtagManager } from './components/HashtagManager';
import { Post, HashtagGroup, SocialAccount, Platform, PostStatus, ViewState } from './types';

const INITIAL_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: Platform.Instagram, username: '@shop_local_123', isConnected: true, avatarUrl: '' },
  { id: '2', platform: Platform.Facebook, username: 'My Local Shop Page', isConnected: false, avatarUrl: '' },
  { id: '3', platform: Platform.TikTok, username: '@tiktok_seller', isConnected: false, avatarUrl: '' },
];

const INITIAL_HASHTAGS: HashtagGroup[] = [
  { id: '1', name: 'Standard Mix', tags: '#smallbiz #shoplocal #handmade' },
  { id: '2', name: 'New Arrival', tags: '#newinstock #fresh #springcollection #ootd' }
];

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ViewState['currentTab']>('home');
  
  // State Persistence
  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('postonce_posts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [hashtagGroups, setHashtagGroups] = useState<HashtagGroup[]>(() => {
    const saved = localStorage.getItem('postonce_hashtags');
    return saved ? JSON.parse(saved) : INITIAL_HASHTAGS;
  });

  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('postonce_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Save to LocalStorage
  useEffect(() => { localStorage.setItem('postonce_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('postonce_hashtags', JSON.stringify(hashtagGroups)); }, [hashtagGroups]);
  useEffect(() => { localStorage.setItem('postonce_accounts', JSON.stringify(accounts)); }, [accounts]);

  const handleSavePost = (newPostData: Omit<Post, 'id' | 'createdAt'>) => {
    const newPost: Post = {
      ...newPostData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    // Simulate API delay
    setTimeout(() => {
      setPosts(prev => [newPost, ...prev]);
      setToastMessage(newPost.status === PostStatus.Published ? 'Published successfully!' : 'Scheduled successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setCurrentTab('calendar');
    }, 800);
  };

  const handleConnectAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, isConnected: !acc.isConnected } : acc
    ));
  };

  const handleAddHashtagGroup = (group: HashtagGroup) => {
    setHashtagGroups(prev => [...prev, group]);
  };

  const handleDeleteHashtagGroup = (id: string) => {
    setHashtagGroups(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Mobile Device Frame for Desktop Viewers */}
      <div className="w-full max-w-md bg-white dark:bg-background-dark h-[100dvh] sm:h-[850px] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col sm:border-8 sm:border-slate-900 ring-1 ring-slate-900/5">
        
        {/* Dynamic Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-40 bg-black rounded-b-2xl z-50 hidden sm:block pointer-events-none"></div>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative bg-background-light dark:bg-background-dark">
          {currentTab === 'home' && (
            <Dashboard 
              posts={posts} 
              userName="Alex" 
              onCreateClick={() => setCurrentTab('create')} 
              onViewCalendar={() => setCurrentTab('calendar')}
            />
          )}
          {currentTab === 'calendar' && (
            <CalendarView posts={posts} onCreateClick={() => setCurrentTab('create')} />
          )}
          {currentTab === 'create' && (
            <CreatePost 
              onSave={handleSavePost} 
              hashtagGroups={hashtagGroups} 
              onBack={() => setCurrentTab('home')}
              onOpenHashtagManager={() => setCurrentTab('groups')}
            />
          )}
          {currentTab === 'groups' && (
            <HashtagManager 
              groups={hashtagGroups} 
              onAddGroup={handleAddHashtagGroup} 
              onDeleteGroup={handleDeleteHashtagGroup} 
              onBack={() => setCurrentTab('home')}
            />
          )}
          {currentTab === 'profile' && (
            <Settings accounts={accounts} onConnectAccount={handleConnectAccount} />
          )}

          {/* Toast Notification */}
          {showToast && (
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-fadeIn z-50 whitespace-nowrap flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              {toastMessage}
            </div>
          )}
        </main>

        {/* Bottom Navigation (Hidden on Create screen for full immersion, usually, but kept here for nav) */}
        {currentTab !== 'create' && (
          <nav className="bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 px-6 pb-6 pt-3 flex justify-between items-center z-40">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center justify-center w-14 transition-colors group ${currentTab === 'home' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${currentTab === 'home' ? 'font-variation-fill' : ''}`} style={{ fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
              <span className="text-[10px] font-bold mt-1">Home</span>
            </button>

            <button 
              onClick={() => setCurrentTab('groups')}
              className={`flex flex-col items-center justify-center w-14 transition-colors group ${currentTab === 'groups' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">tag</span>
              <span className="text-[10px] font-bold mt-1">Groups</span>
            </button>

            {/* Floating FAB Effect in Nav */}
            <div className="relative -top-8">
              <button 
                onClick={() => setCurrentTab('create')}
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform hover:scale-105 active:scale-95 text-black"
              >
                <span className="material-symbols-outlined text-3xl">add</span>
              </button>
            </div>

            <button 
              onClick={() => setCurrentTab('calendar')}
              className={`flex flex-col items-center justify-center w-14 transition-colors group ${currentTab === 'calendar' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${currentTab === 'calendar' ? 'font-variation-fill' : ''}`} style={{ fontVariationSettings: currentTab === 'calendar' ? "'FILL' 1" : "'FILL' 0" }}>calendar_month</span>
              <span className="text-[10px] font-bold mt-1">Calendar</span>
            </button>

            <button 
              onClick={() => setCurrentTab('profile')}
              className={`flex flex-col items-center justify-center w-14 transition-colors group ${currentTab === 'profile' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${currentTab === 'profile' ? 'font-variation-fill' : ''}`} style={{ fontVariationSettings: currentTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
              <span className="text-[10px] font-bold mt-1">Profile</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;