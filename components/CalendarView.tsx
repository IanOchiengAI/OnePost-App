import React from 'react';
import { Post, PostStatus } from '../types';

interface CalendarViewProps {
  posts: Post[];
  onCreateClick: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ posts, onCreateClick }) => {
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.scheduledDate ? new Date(a.scheduledDate).getTime() : new Date(a.createdAt).getTime();
    const dateB = b.scheduledDate ? new Date(b.scheduledDate).getTime() : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-5 py-4 bg-background-light dark:bg-background-dark z-10 sticky top-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calendar</h1>
        <button onClick={onCreateClick} className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-slate-900 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined" style={{fontSize: '24px'}}>add</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* View Toggle */}
        <div className="px-5 mb-6">
          <div className="flex p-1 bg-slate-200/50 dark:bg-surface-dark rounded-xl">
            <button className="flex-1 py-1.5 text-sm font-semibold rounded-lg bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white transition-all">Month</button>
            <button className="flex-1 py-1.5 text-sm font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">Week</button>
          </div>
        </div>

        {/* Visual Calendar Grid (Static representation for MVP look) */}
        <div className="flex items-center justify-between px-5 mb-4">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">October 2023</h2>
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-surface-dark text-slate-600 dark:text-slate-300">
             <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 px-4 mb-2 text-center">
            {['S','M','T','W','T','F','S'].map(d => (
                <div key={d} className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{d}</div>
            ))}
        </div>
        
        {/* Simplified grid logic for demo visual */}
        <div className="grid grid-cols-7 gap-y-3 px-4 mb-8">
            {Array.from({length: 4}).map((_, i) => <div key={`e-${i}`} className="h-10"></div>)}
            {Array.from({length: 31}).map((_, i) => {
                const day = i + 1;
                const hasPost = sortedPosts.some(p => {
                    const d = p.scheduledDate ? new Date(p.scheduledDate) : new Date(p.createdAt);
                    return d.getDate() === day;
                });
                const isToday = day === 24; // Mock today

                return (
                    <button key={day} className="flex flex-col items-center justify-center h-10 w-full relative group">
                        {isToday ? (
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-slate-900 shadow-md shadow-primary/30">
                                <span className="text-sm font-bold">{day}</span>
                            </div>
                        ) : (
                             <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{day}</span>
                        )}
                        {hasPost && <span className={`w-1 h-1 rounded-full mt-1 ${isToday ? 'bg-black' : 'bg-primary'}`}></span>}
                    </button>
                )
            })}
        </div>

        {/* Agenda Section */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.02)] min-h-[400px]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Agenda</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{posts.length} posts total</p>
            </div>
          </div>

          <div className="px-5 space-y-4 pb-10">
            {sortedPosts.map(post => (
               <div key={post.id} className="group flex items-center p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99]">
                 <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                    <img src={post.image} className="h-full w-full object-cover" alt="Post" />
                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm rounded-md p-1">
                        <span className="material-symbols-outlined text-white text-[12px]">
                            {post.format === 'Story' ? 'smartphone' : 'layers'}
                        </span>
                    </div>
                 </div>
                 <div className="flex-1 ml-4 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${post.status === PostStatus.Published ? 'text-green-600' : 'text-primary'}`}>
                            {post.status}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {post.scheduledDate ? new Date(post.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}
                        </span>
                    </div>
                    <h4 className="text-base font-semibold text-slate-800 dark:text-slate-100 truncate">{post.caption || 'Untitled'}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {post.platforms.join(', ')}
                    </p>
                 </div>
               </div>
            ))}
            {sortedPosts.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                    <p>No posts scheduled for this day.</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};