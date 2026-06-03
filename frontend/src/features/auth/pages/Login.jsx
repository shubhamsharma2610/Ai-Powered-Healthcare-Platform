import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Activity } from 'lucide-react';
import { login, clearError } from '../../../redux/slices/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  
  // Get state from Redux
  const { isLoading, isAuthenticated, error, role } = useSelector((state) => state.auth);

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'Doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      // Error will be shown from Redux
      return;
    }
    
    // Dispatch login action
    dispatch(login({ email, password }));
    
    // Handle remember me
    if (remember) {
      localStorage.setItem('rememberEmail', email);
    } else {
      localStorage.removeItem('rememberEmail');
    }
  };

  const handleClearError = () => {
    if (error) dispatch(clearError());
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRemember(true);
    }
  }, []);

  const inputCls = 'w-full pl-10 pr-4 py-2.5 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-xl outline-none placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Heading */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full mb-3">
          <Activity size={14} className="text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Welcome back</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h2>
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Create new Account →
          </Link>
        </p>
      </div>

      {/* Error Message from Redux */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Email address</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={inputCls}
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleClearError();
              }}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-600">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={inputCls + ' pr-10'}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleClearError();
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            onChange={(e) => setRemember(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="remember" className="text-xs text-gray-500 cursor-pointer">
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
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
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[10px] font-medium text-gray-400">or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: 'Google',
            svg: (
              <svg width="16" height="16" viewBox="0 0 48 48">
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
              <svg width="16" height="16" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
            ),
          },
        ].map(({ label, svg }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:border-primary/40 hover:bg-primary/5 transition-all"
          >
            {svg} {label}
          </button>
        ))}
      </div>
    </div>
  );
}