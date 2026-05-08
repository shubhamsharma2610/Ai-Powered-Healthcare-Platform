import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Activity, Home, HelpCircle, ShieldCheck,
  Heart, Zap, Lock, Users, TrendingUp, Award,
} from 'lucide-react';

const features = [
  { icon: <Activity size={15} />, title: 'Live Health Monitoring',  desc: 'Real-time vitals tracked around the clock' },
  { icon: <Zap      size={15} />, title: 'AI-Powered Diagnostics',  desc: 'Smart analysis for clinical decisions' },
  { icon: <Lock     size={15} />, title: 'HIPAA Compliant',         desc: 'Bank-grade encryption on all records' },
  { icon: <Heart    size={15} />, title: 'Personalised Care',       desc: 'Tailored health plans built around you' },
];

const stats = [
  { icon: <Users      size={14} />, value: '2.4M+', label: 'Active Patients' },
  { icon: <TrendingUp size={14} />, value: '18K+',  label: 'Verified Doctors' },
  { icon: <Award      size={14} />, value: '99.9%', label: 'Uptime SLA' },
];

const footerLinks = ['Terms', 'Privacy', 'Cookies', 'Accessibility'];

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isLogin = pathname === '/login' || pathname === '/';

  return (
    // Fixed full-viewport container — no scroll ever
    <div className="h-screen w-screen overflow-hidden flex flex-col font-sans bg-background-soft">

      {/* ══════════════════════════════════════════════
          HEADER  — fixed height, never grows
      ══════════════════════════════════════════════ */}
      <header className="flex-none h-14 flex items-center justify-between px-8 bg-background-card border-b border-ternary z-50 shadow-soft">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-medical bg-primary flex items-center justify-center shadow-soft">
            <Activity size={17} className="text-white" />
          </div>
          <span className="text-[19px] font-extrabold font-display tracking-tight text-gray-900">
            Health<span className="text-primary">Sync</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-primary transition-colors no-underline"
          >
            <Home size={14} /> Home
          </Link>
          <Link
            to="/help"
            className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-primary transition-colors no-underline"
          >
            <HelpCircle size={14} /> Support
          </Link>
          <Link
            to={isLogin ? '/signup' : '/login'}
            className="px-4 py-1.5 rounded-medical text-[13px] font-semibold text-white bg-primary hover:bg-primary-dark transition-colors no-underline shadow-soft"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </Link>
        </nav>
      </header>

      {/* ══════════════════════════════════════════════
          BODY  — fills remaining height exactly
      ══════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* ──────────────────────────────────────────
            LEFT PANEL  — exactly 50 % wide, no scroll
        ────────────────────────────────────────── */}
        <div className="hidden lg:flex w-1/2 flex-none flex-col justify-between p-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(155deg, hsl(182,100%,12%) 0%, hsl(182,100%,20%) 45%, hsl(182,100%,30%) 100%)',
          }}
        >
          {/* Blob top-right */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, hsl(182,100%,60%) 0%, transparent 70%)', opacity: 0.08 }}
          />
          {/* Blob bottom-left */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, hsl(182,100%,50%) 0%, transparent 70%)', opacity: 0.07 }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* ── TOP CONTENT ── */}
          <div className="relative z-10 flex flex-col gap-7">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                AI-Powered Health Platform
              </span>
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-[36px] font-extrabold font-display leading-[1.12] text-white mb-3">
                Your health,<br />
                <span className="text-primary-light" style={{ color: 'hsl(182,100%,75%)' }}>
                  intelligently
                </span><br />
                managed.
              </h1>
              <p className="text-[13px] leading-relaxed text-white/55 max-w-xs">
                Join millions who trust HealthSync for real-time diagnostics,
                seamless care coordination, and AI-driven health insights.
              </p>
            </div>

            {/* Feature cards 2×2 */}
            <div className="grid grid-cols-2 gap-2.5">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="w-7 h-7 min-w-[28px] rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'hsl(182,100%,37%,0.25)', color: 'hsl(182,100%,75%)' }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-white mb-0.5 leading-tight">{f.title}</p>
                    <span className="text-[10px] text-white/45 leading-snug">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-7 pt-1">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center gap-1.5 mb-0.5" style={{ color: 'hsl(182,100%,65%)' }}>
                    {s.icon}
                    <span className="text-[20px] font-extrabold font-display text-white leading-none">{s.value}</span>
                  </div>
                  <span className="text-[10px] font-medium text-white/40">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── AI CHIP (bottom) ── */}
          <div
            className="relative z-10 flex items-center gap-3 p-3.5 rounded-2xl border border-white/10"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(182,100%,55%), hsl(182,100%,30%))' }}
              >
                <Activity size={18} className="text-white" />
              </div>
              <span
                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{ background: '#4ade80', borderColor: 'hsl(182,100%,12%)' }}
              />
            </div>
            <div>
              <p className="text-[12px] font-bold text-white">AI Health Assistant</p>
              <span className="text-[10px] text-white/45">
                Online · Responding instantly · Trusted by 2.4M+ users
              </span>
            </div>
          </div>
        </div>

        {/* ──────────────────────────────────────────
            RIGHT PANEL  — exactly 50 %, no scroll
        ────────────────────────────────────────── */}
        <div className="w-full lg:w-1/2 flex-none flex flex-col overflow-hidden bg-background-soft">

          {/* Form — centered, fills all space between header & footer */}
          <div className="flex-1 flex items-center justify-center px-8 min-h-0 overflow-hidden">
            <div className="w-full max-w-[400px]">
              <Outlet />
            </div>
          </div>

          {/* ── FOOTER ── fixed at bottom of right panel */}
          <footer className="flex-none bg-background-card border-t border-ternary">

            {/* Upper row */}
            <div className="px-6 py-3 flex items-center justify-between gap-4 border-b border-ternary">
              <Link to="/" className="flex items-center gap-2 no-underline">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                  <Activity size={13} className="text-white" />
                </div>
                <span className="text-[14px] font-extrabold font-display tracking-tight text-gray-900">
                  Health<span className="text-primary">Sync</span>
                </span>
              </Link>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border"
                style={{ background: 'hsl(182,100%,97%)', borderColor: 'hsl(182,100%,85%)' }}>
                <ShieldCheck size={12} className="text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-wide text-secondary">
                  HIPAA · SOC 2 · ISO 27001
                </span>
              </div>
            </div>

            {/* Lower row */}
            <div className="px-6 py-2.5 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[10px] text-gray-400">
                © {new Date().getFullYear()} HealthSync Inc. All rights reserved.
              </span>
              <div className="flex items-center gap-4">
                {footerLinks.map(item => (
                  <Link
                    key={item}
                    to="#"
                    className="text-[10px] font-medium text-gray-400 hover:text-primary transition-colors no-underline"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
}