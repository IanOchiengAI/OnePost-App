import React from 'react';
import { SocialAccount, Platform } from '../types';

interface SettingsProps {
  accounts: SocialAccount[];
  onConnectAccount: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ accounts, onConnectAccount }) => {
  const [connectingId, setConnectingId] = React.useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectingId(id);
    // Simulate OAuth redirect/popup delay
    setTimeout(() => {
      onConnectAccount(id);
      setConnectingId(null);
    }, 2000);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center px-6 pt-12 pb-4 justify-between shrink-0">
        <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-tight flex-1">Social Accounts</h2>
      </div>

      {/* Connection Progress */}
      <div className="flex flex-col gap-3 px-6 py-2 shrink-0">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-slate-900 dark:text-white text-sm font-semibold leading-normal">Setup Status</p>
          <span className="text-xs text-primary font-bold">
            {accounts.filter(a => a.isConnected).length} of {accounts.length} connected
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${(accounts.filter(a => a.isConnected).length / accounts.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Explanatory Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-slate-900 shadow-xl border border-white/10 aspect-[16/9] flex items-end p-6">
          <img
            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 group-hover:scale-110 transition-transform duration-700"
            alt="Social background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10"></div>
          <div className="relative z-20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified</span>
              <p className="text-white font-bold">Business Ready</p>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              OnePost requires Business or Creator accounts to enable automated publishing and insights.
            </p>
          </div>
        </div>

        {/* Connection List */}
        <div className="flex flex-col gap-4 pb-24">
          {accounts.map(account => {
            let icon = 'public';
            let colorClass = 'bg-blue-500';
            let brandColor = 'text-[#1877F2]';
            if (account.platform === Platform.Instagram) { icon = 'photo_camera'; colorClass = 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'; brandColor = 'text-pink-600'; }
            if (account.platform === Platform.TikTok) { icon = 'music_note'; colorClass = 'bg-black dark:bg-slate-700'; brandColor = 'text-slate-900 dark:text-white'; }

            const isConnecting = connectingId === account.id;

            return (
              <div key={account.id} className={`flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border ${account.isConnected ? 'border-primary/20 bg-primary/[0.02]' : 'border-slate-100 dark:border-slate-700'} transition-all`}>
                <div className="relative shrink-0">
                  <div className={`flex items-center justify-center size-12 rounded-full overflow-hidden ${account.isConnected ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-800' : ''}`}>
                    {account.isConnected ? (
                      <img src={account.avatarUrl} alt={account.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center text-white ${colorClass}`}>
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                      </div>
                    )}
                  </div>
                  {account.isConnected && (
                    <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary border-2 border-white dark:border-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px] text-black font-bold">check</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-tight ${brandColor}`}>{account.platform}</p>
                  {account.isConnected ? (
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate mt-0.5">
                      {account.username}
                    </p>
                  ) : (
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-0.5">Tap to link account</p>
                  )}
                </div>

                <div className="shrink-0">
                  {account.isConnected ? (
                    <button
                      onClick={() => onConnectAccount(account.id)}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(account.id)}
                      disabled={isConnecting}
                      className={`px-5 py-2 ${isConnecting ? 'bg-slate-100 dark:bg-slate-700' : 'bg-primary shadow-lg shadow-primary/20 active:scale-95'} text-black text-xs font-bold rounded-xl transition-all flex items-center gap-2`}
                    >
                      {isConnecting ? (
                        <>
                          <div className="size-3 border-2 border-slate-300 border-t-slate-600 animate-spin rounded-full" />
                          <span>Linking...</span>
                        </>
                      ) : 'Connect'}
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
