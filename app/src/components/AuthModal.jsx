import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { authService, ADMIN_EMAIL, ADMIN_PASSWORD } from '../services/authService.js';

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const [activeTab, setActiveTab] = useState('google'); // 'google' | 'admin'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await authService.loginWithGoogle();
      onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const admin = await authService.loginAsAdmin(adminEmail, adminPassword);
      onSuccess(admin);
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setAdminEmail(ADMIN_EMAIL);
    setAdminPassword(ADMIN_PASSWORD);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Welcome to CampusEvents</h3>
          <p className="text-xs text-slate-500 mt-1">Rajshahi University of Engineering & Technology</p>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl mt-5">
            <button
              onClick={() => { setActiveTab('google'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'google'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Student / Attendee
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Campus Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Google Sign-In */}
        {activeTab === 'google' ? (
          <div className="p-6 space-y-4">
            <div className="text-center text-xs text-slate-500 leading-relaxed">
              Sign in with your university Google account to reserve seats, track bookings, and download digital event passes.
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-2xl border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              {/* Google SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Sign in with Google'}</span>
            </button>

            <div className="pt-2 text-[11px] text-center text-slate-400">
              Authorized via Firebase Authentication Service
            </div>
          </div>
        ) : (
          /* Tab 2: Fixed Admin Credentials */
          <form onSubmit={handleAdminSignIn} className="p-6 space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@ruet.ac.bd"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Helper to fill credentials for evaluation demonstration */}
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="w-full text-left text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-dotted"
            >
              Fill Teacher / Evaluator Demo Credentials ({ADMIN_EMAIL})
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span>{loading ? 'Verifying...' : 'Sign In as Admin'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
