import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAdminData, ADMIN_CREDENTIALS } from '../../context/AdminDataContext';

export default function AdminLoginPage({ onLoginSuccess }) {
  const { loginAdmin } = useAdminData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = loginAdmin(email.trim(), password.trim());
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess();
      navigate('/admin');
    } else {
      setError(res.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  const handleQuickFill = () => {
    setEmail(ADMIN_CREDENTIALS.email);
    setPassword(ADMIN_CREDENTIALS.password);
  };

  return (
    <div className="min-h-screen bg-luxury-walnut text-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial Glow Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-md bg-luxury-card text-luxury-charcoal rounded-3xl p-6 sm:p-8 shadow-2xl border border-luxury-gold/40 relative z-10 space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-luxury-walnut text-luxury-gold flex items-center justify-center mx-auto shadow-md border border-luxury-gold/40">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-luxury-walnut">
            Admin <span className="text-gold-gradient">Control Panel</span>
          </h1>
          <p className="text-xs text-luxury-muted">
            Zameer Carpenter & Interior Design Management System
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-luxury-gold-dark" />
              <span>Admin Email ID</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="interiordesignerzameer@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-luxury-surface border border-luxury-border focus:border-luxury-gold focus:outline-none text-xs font-medium text-luxury-walnut shadow-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal block mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-luxury-gold-dark" />
              <span>Admin Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-luxury-surface border border-luxury-border focus:border-luxury-gold focus:outline-none text-xs font-medium text-luxury-walnut shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-luxury-walnut hover:bg-black text-luxury-gold font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Preset Helper Card */}
        <div className="pt-3 border-t border-luxury-border text-center">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-semibold text-luxury-gold-dark hover:underline inline-flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Auto-fill Admin Credentials</span>
          </button>
        </div>

      </div>
    </div>
  );
}
