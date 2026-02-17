import React from 'react';
import { Post, PostStatus } from '../types';

interface DashboardProps {
  posts: Post[];
  userName: string;
  onCreateClick: () => void;
  onViewCalendar: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ posts, userName, onCreateClick, onViewCalendar }) => {
  // Filter for today's posts (mock logic for demo, showing all/recent)
  const scheduledPosts = posts.filter(p => p.status === PostStatus.Scheduled || p.status === PostStatus.Published).slice(0, 3);

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 bg-surface-light dark:bg-surface-dark sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Good Morning,</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{userName}</h1>
        </div>
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <span className="material-symbols-outlined text-slate-900 dark:text-white" style={{ fontSize: '28px' }}>notifications</span>
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface-light dark:border-surface-dark"></span>
        </button>
      </header>

      {/* Main Content Scroll Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Hero Action Card */}
        <div className="px-6 py-6">
          <div 
            onClick={onCreateClick}
            className="relative overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer border border-gray-100 dark:border-gray-800"
          >
            {/* Decorative Background Blob */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all"></div>
            <div className="flex flex-col sm:flex-row items-stretch">
              <div className="w-full sm:w-1/3 h-40 sm:h-auto relative">
                <img 
                  alt="Abstract colorful gradient" 
                  className="h-full w-full object-cover" 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-black/10"></div>
              </div>
              <div className="flex flex-1 flex-col justify-center p-6 relative z-10">
                <h2 className="text-xl font-bold mb-2">Ready to grow?</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                  Create a new post and engage with your audience today.
                </p>
                <button className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-dark text-black font-bold py-3 px-4 rounded-lg transition-transform active:scale-95 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                  <span>Create Post</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-4 px-6 mb-8">
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined">schedule_send</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Scheduled</p>
              <p className="text-lg font-bold">{posts.filter(p => p.status === PostStatus.Scheduled).length}</p>
            </div>
          </div>
          <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Reach</p>
              <p className="text-lg font-bold">+24%</p>
            </div>
          </div>
        </div>

        {/* Today's Schedule Section */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <button onClick={onViewCalendar} className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">See All</button>
          </div>
          
          <div className="flex flex-col gap-0 relative">
            {scheduledPosts.length === 0 ? (
               <div className="text-center py-8 opacity-50">
                  <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                  <p>No posts yet.</p>
               </div>
            ) : (
              scheduledPosts.map((post, index) => {
                const isLast = index === scheduledPosts.length - 1;
                // Simple logic to pick an icon based on platform
                const platform = post.platforms[0]; 
                let iconColor = 'bg-gray-100 text-gray-600';
                let icon = 'public';
                if (platform === 'Instagram') { iconColor = 'bg-pink-50 text-pink-600'; icon = 'photo_camera'; }
                if (platform === 'Facebook') { iconColor = 'bg-blue-50 text-blue-600'; icon = 'public'; }
                if (platform === 'TikTok') { iconColor = 'bg-black/5 text-black'; icon = 'music_note'; }

                return (
                  <div key={post.id} className={`group flex gap-4 relative ${isLast ? 'last-item' : ''}`}>
                    {/* Connector */}
                    <div className="flex flex-col items-center timeline-connector w-10 flex-shrink-0 relative z-10">
                      <div className={`h-10 w-10 rounded-full ${iconColor} flex items-center justify-center border-2 border-white dark:border-background-dark shadow-sm`}>
                        <span className="material-symbols-outlined text-sm">{icon}</span>
                      </div>
                      {!isLast && <div className="absolute top-10 bottom-[-1rem] w-0.5 bg-gray-200 dark:bg-gray-800 -z-10"></div>}
                    </div>
                    
                    {/* Card */}
                    <div className="flex-1 pb-6">
                      <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === PostStatus.Published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {post.status}
                          </span>
                          <span className="text-sm font-semibold text-gray-500">
                             {post.scheduledDate ? new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{post.caption || 'Untitled Post'}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="material-symbols-outlined text-base">image</span>
                          <span>{post.format}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
};