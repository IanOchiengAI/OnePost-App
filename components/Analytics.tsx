import React from 'react';
import { Post, PostStatus } from '../types';

interface AnalyticsProps {
    posts: Post[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ posts }) => {
    // Mock data for charts since we might not have many posts with real analytics yet
    const stats = [
        { label: 'Total Reach', value: '24.8K', change: '+12%', icon: 'visibility', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Engagement', value: '5.2%', change: '+0.8%', icon: 'Ads_Click', color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Likes', value: '1,284', change: '+156', icon: 'favorite', color: 'text-pink-600', bg: 'bg-pink-50' },
        { label: 'New Followers', value: '432', change: '+24', icon: 'person_add', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    // Simple line chart data (simulated)
    const chartPoints = [20, 45, 30, 60, 50, 85, 70];
    const maxPoint = Math.max(...chartPoints);

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            <header className="px-6 py-8">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">Analytics</h1>
                <p className="text-sm text-slate-500 font-medium">Performance overview for the last 7 days</p>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-24 no-scrollbar">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className={`size-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                                <span className="text-[10px] font-bold text-emerald-600 mb-1">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reach Chart */}
                <div className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 dark:text-white">Reach Over Time</h3>
                        <select
                            title="Select timeframe"
                            aria-label="Select timeframe"
                            className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-2 py-1 outline-none"
                        >
                            {/* The input element was syntactically incorrect inside the select.
                                If it was meant to be a separate element, it should be placed outside.
                                As per the instruction, only the select element was explicitly modified in the provided snippet. */}
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    <div className="h-40 w-full relative group">
                        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" />
                            <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" />
                            <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" />

                            {/* Area */}
                            <path
                                d={`M 0 40 ${chartPoints.map((p, i) => `L ${(i / (chartPoints.length - 1)) * 100} ${40 - (p / maxPoint) * 35}`).join(' ')} L 100 40 Z`}
                                fill="url(#chartGradient)"
                            />

                            {/* Line */}
                            <path
                                d={chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i / (chartPoints.length - 1)) * 100} ${40 - (p / maxPoint) * 35}`).join(' ')}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]"
                            />

                            {/* Points */}
                            {chartPoints.map((p, i) => (
                                <circle
                                    key={i}
                                    cx={(i / (chartPoints.length - 1)) * 100}
                                    cy={40 - (p / maxPoint) * 35}
                                    r="1.2"
                                    fill="white"
                                    stroke="#3B82F6"
                                    strokeWidth="1"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            ))}
                        </svg>
                    </div>

                    <div className="flex justify-between mt-4">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                            <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>
                        ))}
                    </div>
                </div>

                {/* Top Performing Posts */}
                <div className="mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Top Performing Posts</h3>
                    <div className="space-y-4">
                        {posts.filter(p => p.status === PostStatus.Published).slice(0, 3).map((post, i) => (
                            <div key={post.id} className="flex items-center p-3 bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                                <img src={post.image} className="size-14 rounded-xl object-cover" alt="" />
                                <div className="flex-1 ml-4 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{post.caption || 'No caption'}</h4>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">favorite</span> 124
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs">visibility</span> 2.4K
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-emerald-600">+8.2%</span>
                                </div>
                            </div>
                        ))}
                        {posts.filter(p => p.status === PostStatus.Published).length === 0 && (
                            <div className="text-center py-6 text-slate-400 italic text-sm">
                                No published posts to analyze yet.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
