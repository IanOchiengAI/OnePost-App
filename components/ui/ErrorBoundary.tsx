import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6 text-center">
                    <div className="max-w-md p-8 bg-white dark:bg-surface-dark rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30">
                        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                        <h1 className="text-2xl font-bold mb-2 dark:text-white">Something went wrong</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                            We encountered an unexpected error. Don't worry, your data is likely safe.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-primary text-black font-bold py-3 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            Refresh Application
                        </button>
                        <button
                            onClick={() => { localStorage.clear(); window.location.reload(); }}
                            className="w-full mt-3 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Reset App Data
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
