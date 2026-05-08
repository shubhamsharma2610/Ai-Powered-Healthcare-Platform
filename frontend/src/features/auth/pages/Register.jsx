import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Stethoscope, UserCircle, Activity } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();

  const [role, setRole]         = useState('patient');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showCf, setShowCf]     = useState(false);
  const [agreed, setAgreed]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }
    if (password.length < 8)   { setError('Password must be at least 8 characters.'); return; }
    if (!agreed)               { setError('Please accept the Terms of Service.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 1400);
  };

  const pwStrength = password.length >= 10 ? 'Strong' : password.length >= 7 ? 'Fair' : 'Weak';
  const pwColor    = password.length >= 10 ? 'bg-primary' : password.length >= 7 ? 'bg-yellow-400' : 'bg-accent';

  const inputCls =
    'w-full pl-9 pr-3 py-2.5 text-[13px] text-gray-900 bg-background-card border border-ternary rounded-medical outline-none placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans';

  return (
    <div className="w-full">

      {/* Heading */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-medical bg-primary flex items-center justify-center shadow-soft">
            <Activity size={15} className="text-white" />
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest font-sans">
            Get started free
          </span>
        </div>
        <h2 className="text-[24px] font-extrabold font-display text-gray-900 leading-tight mb-1.5">
          Create your account
        </h2>
        <p className="text-[13px] text-gray-500 font-sans">
          Already a member?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-dark transition-colors no-underline">
            Sign in →
          </Link>
        </p>
      </div>

      {/* Role Toggle */}
      <div className="flex gap-2 mb-4 p-1 bg-ternary rounded-medical">
        {[
          { key: 'patient', label: 'Patient', Icon: UserCircle },
          { key: 'doctor',  label: 'Doctor',  Icon: Stethoscope },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRole(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] text-[12px] font-semibold transition-all cursor-pointer border-none font-sans ${
              role === key
                ? 'bg-background-card text-primary shadow-soft'
                : 'bg-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 px-3.5 py-2.5 rounded-medical bg-red-50 border border-red-100 text-[12px] text-red-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Name + Email */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Full name</label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className={inputCls} type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Email</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className={inputCls} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Password</label>
          <div className="relative">
            <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className={inputCls + ' pr-10'}
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0">
              {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          {/* Strength bar */}
          {password.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${password.length >= i * 2.5 ? pwColor : 'bg-ternary'}`} />
              ))}
              <span className="text-[10px] text-gray-400 ml-1 font-sans">{pwStrength}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 font-sans">Confirm password</label>
          <div className="relative">
            <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              className={
                inputCls + ' pr-10 ' +
                (confirm.length > 0 && confirm !== password ? 'border-accent focus:border-accent focus:ring-accent/10' : '')
              }
              type={showCf ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowCf(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer p-0">
              {showCf ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          {confirm.length > 0 && confirm !== password && (
            <p className="text-[10px] text-accent mt-1 font-medium font-sans">Passwords do not match</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="w-3.5 h-3.5 mt-0.5 rounded accent-primary cursor-pointer flex-shrink-0"
          />
          <label htmlFor="terms" className="text-[11px] text-gray-500 cursor-pointer leading-relaxed font-sans">
            I agree to the{' '}
            <Link to="/terms"   className="text-primary font-semibold hover:underline no-underline">Terms</Link>{' '}and{' '}
            <Link to="/privacy" className="text-primary font-semibold hover:underline no-underline">Privacy Policy</Link>
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
              Creating account…
            </>
          ) : (
            <> Create {role === 'doctor' ? 'Doctor' : 'Patient'} Account <ArrowRight size={15} /> </>
          )}
        </button>
      </form>
    </div>
  );
}