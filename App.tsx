import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CreatePost } from './components/CreatePost';
const Dashboard = React.lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const Analytics = React.lazy(() => import('./components/Analytics').then(m => ({ default: m.Analytics })));
const CalendarView = React.lazy(() => import('./components/CalendarView').then(m => ({ default: m.CalendarView })));
const Settings = React.lazy(() => import('./components/Settings').then(m => ({ default: m.Settings })));
import { Onboarding } from './components/Onboarding';
import { HashtagManager } from './components/HashtagManager';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { HashtagGroup, PostStatus, Post, Platform } from './types';
import { useStore } from './store/useStore';

import confetti from 'canvas-confetti';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    posts,
    addPost,
    updatePost,
    hashtagGroups,
    addHashtagGroup,
    deleteHashtagGroup,
    accounts,
    updateAccount,
    session,
    onboardingComplete,
    setOnboardingComplete,
    setBrandVoice
  } = useStore();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSavePost = (newPostData: Omit<Post, 'id' | 'createdAt'>) => {
    // Simulate API delay
    setTimeout(() => {
      addPost(newPostData);

      // Trigger success animation
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A7F3D0', '#34D399', '#059669', '#FFD700']
      });

      setToastMessage(newPostData.status === PostStatus.Published ? 'Published successfully!' : 'Scheduled successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      navigate('/calendar');
    }, 800);
  };

  const handleConnectAccount = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (account) {
      updateAccount(id, { isConnected: !account.isConnected });
    }
  };

  const handleAddHashtagGroup = (group: HashtagGroup) => {
    addHashtagGroup(group);
  };

  const handleDeleteHashtagGroup = (id: string) => {
    deleteHashtagGroup(id);
  };

  // Helper to determine active tab based on path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/analytics') return 'analytics';
    if (path === '/calendar') return 'calendar';
    if (path === '/create') return 'create';
    if (path === '/groups') return 'groups';
    if (path === '/profile') return 'profile';
    return '';
  };

  const currentTab = getActiveTab();

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-0 sm:p-4 font-sans">
      {/* Mobile Device Frame for Desktop Viewers */}
      <div className="w-full max-w-md bg-white dark:bg-background-dark h-[100dvh] sm:h-[850px] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col sm:border-8 sm:border-slate-900 ring-1 ring-slate-900/5">

        {/* Dynamic Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-40 bg-black rounded-b-2xl z-50 hidden sm:block pointer-events-none"></div>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative bg-background-light dark:bg-background-dark">
          {session && !onboardingComplete && (
            <Onboarding
              connectedAccounts={accounts.filter(a => a.isConnected).map(a => a.platform as Platform)}
              onConnectAccount={handleConnectAccount}
              onComplete={(data) => {
                setBrandVoice(data.brandVoice);
                setOnboardingComplete(true);
              }}
            />
          )}

          <React.Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login onSignup={() => navigate('/signup')} />} />
              <Route path="/signup" element={session ? <Navigate to="/" replace /> : <Signup onLogin={() => navigate('/login')} />} />

              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard
                    posts={posts}
                    userName={session?.user?.email?.split('@')[0] || "User"}
                    onCreateClick={() => navigate('/create')}
                    onViewCalendar={() => navigate('/calendar')}
                  />
                </ProtectedRoute>
              } />

              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics posts={posts} />
                </ProtectedRoute>
              } />

              <Route path="/calendar" element={
                <ProtectedRoute>
                  <CalendarView
                    posts={posts}
                    onCreateClick={() => navigate('/create')}
                    onUpdatePost={updatePost}
                  />
                </ProtectedRoute>
              } />

              <Route path="/create" element={
                <ProtectedRoute>
                  <CreatePost
                    onSave={handleSavePost}
                    hashtagGroups={hashtagGroups}
                    onBack={() => navigate('/')}
                    onOpenHashtagManager={() => navigate('/groups')}
                  />
                </ProtectedRoute>
              } />

              <Route path="/groups" element={
                <ProtectedRoute>
                  <HashtagManager
                    groups={hashtagGroups}
                    onAddGroup={handleAddHashtagGroup}
                    onDeleteGroup={handleDeleteHashtagGroup}
                    onBack={() => navigate('/')}
                  />
                </ProtectedRoute>
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Settings accounts={accounts} onConnectAccount={handleConnectAccount} />
                </ProtectedRoute>
              } />
            </Routes>
          </React.Suspense>

          {/* Toast Notification */}
          {showToast && (
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-fadeIn z-50 whitespace-nowrap flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              {toastMessage}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        {session && currentTab !== 'create' && (
          <nav className="bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 px-4 pb-6 pt-3 flex justify-between items-center z-40">
            <button
              onClick={() => navigate('/')}
              className={`flex flex-col items-center justify-center w-12 transition-colors group ${currentTab === 'home' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${currentTab === 'home' ? 'icon-fill' : 'icon-no-fill'}`}>home</span>
              <span className="text-[9px] font-bold mt-1">Home</span>
            </button>

            <button
              onClick={() => navigate('/analytics')}
              className={`flex flex-col items-center justify-center w-12 transition-colors group ${currentTab === 'analytics' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${currentTab === 'analytics' ? 'icon-fill' : 'icon-no-fill'}`}>insights</span>
              <span className="text-[9px] font-bold mt-1">Insights</span>
            </button>

            {/* Floating FAB Effect in Nav */}
            <div className="relative -top-8 px-2">
              <button
                onClick={() => navigate('/create')}
                className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transform transition-transform hover:scale-105 active:scale-95 text-black"
              >
                <span className="material-symbols-outlined text-3xl">add</span>
              </button>
            </div>

            <button
              onClick={() => navigate('/calendar')}
              className={`flex flex-col items-center justify-center w-12 transition-colors group ${currentTab === 'calendar' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${currentTab === 'calendar' ? 'icon-fill' : 'icon-no-fill'}`}>calendar_month</span>
              <span className="text-[9px] font-bold mt-1">Calendar</span>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className={`flex flex-col items-center justify-center w-12 transition-colors group ${currentTab === 'profile' ? 'text-primary' : 'text-slate-400'}`}
            >
              <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${currentTab === 'profile' ? 'icon-fill' : 'icon-no-fill'}`}>person</span>
              <span className="text-[9px] font-bold mt-1">Profile</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default App;