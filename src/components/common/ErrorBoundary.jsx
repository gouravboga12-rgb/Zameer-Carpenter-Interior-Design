import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetCache = () => {
    try {
      localStorage.removeItem('zameer_services_cache');
      localStorage.removeItem('zameer_projects_cache');
    } catch (e) {}
    window.location.href = '/admin';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-luxury-bg text-luxury-charcoal flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-luxury-card rounded-3xl p-8 border-2 border-luxury-gold/40 shadow-2xl text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-luxury-walnut">
                Temporary Loading Notice
              </h2>
              <p className="text-xs text-luxury-muted leading-relaxed">
                The application encountered a temporary display issue. Click below to reload and sync the latest data.
              </p>
              {this.state.error?.message && (
                <div className="p-2.5 rounded-xl bg-black/5 text-[11px] font-mono text-red-600 truncate max-w-full text-left">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleResetCache}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-luxury-surface hover:bg-luxury-border text-luxury-charcoal font-bold text-xs transition-colors cursor-pointer border border-luxury-border"
              >
                <span>Reset Cache & Reopen</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
