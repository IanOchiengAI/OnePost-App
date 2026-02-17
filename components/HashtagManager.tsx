import React, { useState } from 'react';
import { HashtagGroup } from '../types';

interface HashtagManagerProps {
  groups: HashtagGroup[];
  onAddGroup: (group: HashtagGroup) => void;
  onDeleteGroup: (id: string) => void;
  onBack: () => void;
}

export const HashtagManager: React.FC<HashtagManagerProps> = ({ groups, onAddGroup, onDeleteGroup, onBack }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTags, setNewTags] = useState('');

  const handleSave = () => {
    if (newName && newTags) {
      onAddGroup({
        id: Date.now().toString(),
        name: newName,
        tags: newTags
      });
      setNewName('');
      setNewTags('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">My Groups</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="flex items-center w-full h-12 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-center pl-4 text-slate-400 dark:text-slate-500">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input className="w-full h-full px-3 bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 focus:outline-none" placeholder="Search saved groups..." type="text"/>
        </div>
      </div>

      {/* Main Content List */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 space-y-3">
        {isAdding && (
             <div className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-md border border-primary animate-fadeIn mb-4">
                <h3 className="font-bold text-lg mb-2 dark:text-white">New Group</h3>
                <input 
                    className="w-full mb-2 p-2 rounded border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white"
                    placeholder="Group Name (e.g. Summer)"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                />
                <textarea 
                    className="w-full mb-3 p-2 rounded border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white"
                    placeholder="#tags #here..."
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                />
                <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 bg-primary text-black font-bold py-2 rounded-lg">Save</button>
                    <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-slate-900 dark:text-white font-bold py-2 rounded-lg">Cancel</button>
                </div>
             </div>
        )}

        {groups.map(group => (
            <div key={group.id} className="group relative flex flex-col gap-3 p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary-dark dark:text-primary shrink-0">
                            <span className="material-symbols-outlined">tag</span>
                        </div>
                        <div>
                            <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">{group.name}</h3>
                            <span className="text-xs font-medium text-slate-500">Auto-generated ID: {group.id.slice(-4)}</span>
                        </div>
                    </div>
                    <button onClick={() => onDeleteGroup(group.id)} className="text-slate-400 hover:text-red-500">
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
                <div className="bg-background-light dark:bg-background-dark/50 p-3 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2">
                        {group.tags}
                    </p>
                </div>
            </div>
        ))}
        {groups.length === 0 && !isAdding && (
            <div className="text-center py-10 text-slate-400">
                <p>No hashtag groups yet. Tap + to add one.</p>
            </div>
        )}

        <div className="h-20"></div>
      </main>

      {/* Floating Action Button */}
      <div className="absolute bottom-24 right-4 z-20">
        <button onClick={() => setIsAdding(true)} className="flex items-center justify-center w-14 h-14 bg-primary hover:bg-primary-dark text-background-dark rounded-full shadow-lg shadow-primary/40 transition-all transform hover:scale-105 active:scale-95">
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </button>
      </div>
    </div>
  );
};