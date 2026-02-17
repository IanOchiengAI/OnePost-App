import React from 'react';
import { SocialAccount, Platform } from '../types';

interface SettingsProps {
  accounts: SocialAccount[];
  onConnectAccount: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ accounts, onConnectAccount }) => {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center px-4 pt-6 pb-2 justify-between shrink-0">
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1">Connect Your Socials</h2>
      </div>

      {/* Progress Bar (Mockup for vibe) */}
      <div className="flex flex-col gap-3 px-6 py-2 shrink-0">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">Setup Status</p>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
             {Math.round((accounts.filter(a => a.isConnected).length / accounts.length) * 100)}% Completed
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-border dark:bg-surface-dark overflow-hidden">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-500" 
            style={{ width: `${(accounts.filter(a => a.isConnected).length / accounts.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Explanatory Card */}
        <div className="relative overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-slate-900/60 z-10"></div>
           <img 
             src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop" 
             className="absolute inset-0 w-full h-full object-cover z-0 opacity-60" 
             alt="Social background" 
           />
          <div className="relative z-20 p-5 flex flex-col gap-3 h-full justify-end min-h-[160px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-2xl">verified</span>
              <p className="text-white text-lg font-bold leading-tight">Why Business Accounts?</p>
            </div>
            <p className="text-gray-200 text-sm font-medium leading-relaxed">
               To auto-publish your posts, platforms require a Business account. Don't worry, it's free and easy to switch in your social app settings!
            </p>
          </div>
        </div>

        {/* Connection List */}
        <div className="flex flex-col gap-4 pb-24">
            {accounts.map(account => {
                let icon = 'public';
                let colorClass = 'bg-[#1877F2]/10 text-[#1877F2]';
                if (account.platform === Platform.Instagram) { icon = 'photo_camera'; colorClass = 'bg-pink-100 text-pink-600'; }
                if (account.platform === Platform.TikTok) { icon = 'music_note'; colorClass = 'bg-black/5 text-black dark:bg-white/10 dark:text-white'; }

                return (
                  <div key={account.id} className={`flex items-center gap-4 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-sm border ${account.isConnected ? 'border-primary/30 ring-1 ring-primary/20' : 'border-gray-100 dark:border-gray-800'} transition-transform active:scale-[0.99]`}>
                    <div className={`shrink-0 flex items-center justify-center size-12 rounded-full ${colorClass}`}>
                      <span className="material-symbols-outlined text-3xl">{icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate">{account.platform}</p>
                      {account.isConnected ? (
                          <p className="text-primary text-xs font-medium mt-0.5 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                            Connected as {account.username}
                          </p>
                      ) : (
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-0.5">Not connected</p>
                      )}
                    </div>
                    <div className="shrink-0">
                        {account.isConnected ? (
                            <button onClick={() => onConnectAccount(account.id)} className="flex items-center justify-center rounded-lg h-9 px-4 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
                                Disconnect
                            </button>
                        ) : (
                            <button onClick={() => onConnectAccount(account.id)} className="flex items-center justify-center rounded-lg h-9 px-4 bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                Connect
                            </button>
                        )}
                    </div>
                  </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};