import React from 'react';
import { Post, PostStatus } from '../types';

interface CalendarViewProps {
  posts: Post[];
  onCreateClick: () => void;
  onUpdatePost: (id: string, updates: Partial<Post>) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ posts, onCreateClick, onUpdatePost }) => {
  const [draggedPostId, setDraggedPostId] = React.useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = React.useState<{ id: string, newDate: Date } | null>(null);

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.scheduled_at ? new Date(a.scheduled_at).getTime() : new Date(a.createdAt).getTime();
    const dateB = b.scheduled_at ? new Date(b.scheduled_at).getTime() : new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  const handleDragStart = (e: React.DragEvent, postId: string) => {
    setDraggedPostId(postId);
    e.dataTransfer.setData('postId', postId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData('postId') || draggedPostId;
    if (postId) {
      const newDate = new Date();
      newDate.setDate(day);
      setRescheduleData({ id: postId, newDate });
    }
    setDraggedPostId(null);
  };

  const confirmReschedule = (time: string) => {
    if (rescheduleData) {
      const [hours, minutes] = time.split(':');
      const finalDate = new Date(rescheduleData.newDate);
      finalDate.setHours(parseInt(hours), parseInt(minutes));

      onUpdatePost(rescheduleData.id, {
        scheduled_at: finalDate.toISOString(),
        scheduledDate: finalDate.toISOString(),
        status: PostStatus.Scheduled
      });
      setRescheduleData(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark relative">
      {/* Top Navigation */}
      <header className="flex items-center justify-between px-5 py-4 bg-background-light dark:bg-background-dark z-10 sticky top-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calendar</h1>
        <button onClick={onCreateClick} className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-slate-900 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-[24px]">add</span>
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
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{d}</div>
          ))}
        </div>

        {/* Simplified grid logic for demo visual */}
        <div className="grid grid-cols-7 gap-y-3 px-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <div key={`e-${i}`} className="h-10"></div>)}
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;
            const hasPost = sortedPosts.some(p => {
              const d = p.scheduled_at ? new Date(p.scheduled_at) : new Date(p.createdAt);
              return d.getDate() === day;
            });
            const isToday = day === 24; // Mock today

            return (
              <button
                key={day}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
                className="flex flex-col items-center justify-center h-10 w-full relative group hover:bg-primary/5 rounded-lg transition-colors"
              >
                {isToday ? (
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-slate-900 shadow-md shadow-primary/30">
                    <span className="text-sm font-bold">{day}</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{day}</span>
                )}
                {hasPost && <span className={`w-1 h-1 rounded-full mt-1 ${isToday ? 'bg-slate-900' : 'bg-primary'}`}></span>}
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
              <div
                key={post.id}
                draggable
                onDragStart={(e) => handleDragStart(e, post.id)}
                className={`group flex items-center p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-grab active:cursor-grabbing ${draggedPostId === post.id ? 'opacity-30 border-primary border-dashed' : ''}`}
              >
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
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${post.status === PostStatus.Published ? 'bg-green-100 text-green-700' :
                        post.status === PostStatus.Failed ? 'bg-red-100 text-red-700' :
                          post.status === PostStatus.Publishing ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                      }`}>
                      {post.status === PostStatus.Publishing && <span className="size-1 rounded-full bg-blue-600 animate-pulse mr-1"></span>}
                      {post.status}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {post.scheduled_at ? new Date(post.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
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

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl animate-scaleIn">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reschedule Post</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Pick a new time for your post on {rescheduleData.newDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {['09:00', '12:00', '15:00', '18:00', '21:00'].map(time => (
                <button
                  key={time}
                  onClick={() => confirmReschedule(time)}
                  className="py-3 px-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95"
                >
                  {time}
                </button>
              ))}
              <input
                type="time"
                className="col-span-2 py-3 px-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                onChange={(e) => confirmReschedule(e.target.value)}
              />
            </div>

            <button
              onClick={() => setRescheduleData(null)}
              className="w-full py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};