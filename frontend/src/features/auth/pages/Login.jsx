import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Activity } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw]     = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1200);
  };

  const inputCls =
    'w-full pl-10 pr-4 py-2.5 text-[13px] text-gray-900 bg-background-card border border-ternary rounded-medical outline-none placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans';

  return (
    <div className="w-full">

      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-medical bg-primary flex items-center justify-center shadow-soft">
            <Activity size={15} className="text-white" />
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-sans">
            Welcome back
          </span>
        </div>
        <h2 className="text-[24px] font-extrabold font-display text-gray-900 leading-tight mb-1.5">
          Sign in to your account
        </h2>
        <p className="text-[13px] text-gray-500 font-sans">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:text-primary-dark transition-colors no-underline">
            Create new Account →
          </Link>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-3.5 py-2.5 rounded-medical bg-red-50 border border-red-100 text-[12px] text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">
            Email address
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className={inputCls}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest font-sans">
              Password
            </label>
            <Link to="/forgot-password" className="text-[11px] font-semibold text-primary hover:text-primary-dark transition-colors no-underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className={inputCls + ' pr-10'}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
          />
          <label htmlFor="remember" className="text-[12px] text-gray-500 cursor-pointer select-none font-sans">
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-medical text-[13px] font-bold text-white bg-primary hover:bg-primary-dark active:scale-[0.99] transition-all shadow-soft disabled:opacity-70 disabled:cursor-not-allowed font-sans"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Signing in…
            </>
          ) : (
            <> Sign In <ArrowRight size={15} /> </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-ternary" />
        <span className="text-[10px] font-medium text-gray-400 font-sans">or continue with</span>
        <div className="flex-1 h-px bg-ternary" />
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          {
            label: 'Google',
            svg: (
              <svg width="15" height="15" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.5 1.2 8.9 3.2l6.6-6.6C35.5 2.4 30.1 0 24 0 14.6 0 6.6 5.5 2.7 13.5l7.7 6C12.4 13.1 17.8 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.9 37.5 46.5 31.4 46.5 24.5z"/>
                <path fill="#FBBC05" d="M10.4 28.5A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.9-4.5l-7.7-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.8l7.7-6.3z"/>
                <path fill="#34A853" d="M24 48c6.1 0 11.2-2 14.9-5.4l-7.5-5.8c-2 1.4-4.6 2.2-7.4 2.2-5.7 0-10.6-3.8-12.3-9l-7.7 6C6.5 43.2 14.6 48 24 48z"/>
              </svg>
            ),
          },
          {
            label: 'Microsoft',
            svg: (
              <svg width="15" height="15" viewBox="0 0 21 21">
                <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
                <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
            ),
          },
        ].map(({ label, svg }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-medical border border-ternary bg-background-card text-[12px] font-semibold text-gray-700 hover:border-primary/40 hover:bg-primary-light transition-all cursor-pointer font-sans"
          >
            {svg} {label}
          </button>
        ))}
      </div>
    </div>
  );
}