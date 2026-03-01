import React, { useState } from 'react';
import { BrandVoice, Platform } from '../types';

interface OnboardingProps {
    onComplete: (data: { brandVoice: BrandVoice }) => void;
    onConnectAccount: (platform: Platform) => void;
    connectedAccounts: Platform[];
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onConnectAccount, connectedAccounts }) => {
    const [step, setStep] = useState(1);
    const [selectedVoice, setSelectedVoice] = useState<BrandVoice>('Professional');

    const voices: { type: BrandVoice, icon: string, desc: string }[] = [
        { type: 'Professional', icon: 'business_center', desc: 'Trustworthy & refined' },
        { type: 'Playful', icon: 'sentiment_very_satisfied', desc: 'Fun, witty & energetic' },
        { type: 'Sales', icon: 'payments', desc: 'Direct & persuasive' },
        { type: 'Helpful', icon: 'support_agent', desc: 'Educational & supportive' },
    ];

    const handleFinish = () => {
        onComplete({ brandVoice: selectedVoice });
    };

    return (
        <div className="absolute inset-0 z-[100] bg-white dark:bg-background-dark flex flex-col p-8 animate-fadeIn">
            {/* Progress bar */}
            <div className="flex gap-2 mb-12">
                {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${step >= s ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                ))}
            </div>

            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                {step === 1 && (
                    <div className="animate-slideIn">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Connect your worlds</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Link your social accounts to start creating. You can add more later.</p>

                        <div className="space-y-4">
                            {[Platform.Instagram, Platform.Facebook, Platform.TikTok].map(p => {
                                const isConnected = connectedAccounts.includes(p);
                                return (
                                    <button
                                        key={p}
                                        onClick={() => onConnectAccount(p)}
                                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${isConnected ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`size-10 rounded-xl flex items-center justify-center ${isConnected ? 'bg-primary text-black' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                <span className="material-symbols-outlined">{p === Platform.Instagram ? 'photo_camera' : p === Platform.Facebook ? 'public' : 'music_note'}</span>
                                            </div>
                                            <span className={`font-bold ${isConnected ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{p}</span>
                                        </div>
                                        {isConnected ? (
                                            <span className="material-symbols-outlined text-primary">check_circle</span>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400">Connect</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-slideIn">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Choose your voice</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Our AI will use this style to generate your captions and hashtags.</p>

                        <div className="grid grid-cols-2 gap-4">
                            {voices.map(voice => (
                                <button
                                    key={voice.type}
                                    onClick={() => setSelectedVoice(voice.type)}
                                    className={`p-5 rounded-3xl border text-left transition-all ${selectedVoice === voice.type ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-dark'}`}
                                >
                                    <span className={`material-symbols-outlined text-2xl mb-3 block ${selectedVoice === voice.type ? 'text-primary' : 'text-slate-400'}`}>{voice.icon}</span>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{voice.type}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{voice.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-slideIn text-center">
                        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="material-symbols-outlined text-5xl text-primary animate-bounce">rocket_launch</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">You're all set!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">Ready to post your first masterpiece? Let's take OnePost for a spin.</p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">PRO TIP</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Try the "Magic AI" button in the creator to see your <b>{selectedVoice}</b> voice in action!</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="mt-12 flex gap-4">
                {step > 1 && (
                    <button
                        onClick={() => setStep(s => s - 1)}
                        className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={() => step < 3 ? setStep(s => s + 1) : handleFinish()}
                    className={`flex-[2] py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xl active:scale-95 transition-all ${step === 1 && connectedAccounts.length === 0 ? 'opacity-50' : ''}`}
                >
                    {step === 3 ? 'Get Started' : 'Next Step'}
                </button>
            </div>
        </div>
    );
};
