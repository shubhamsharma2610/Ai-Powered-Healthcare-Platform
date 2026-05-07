import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* ─────────────────────────────────────────────────────────
   SVG ICON LIBRARY  (zero extra deps)
───────────────────────────────────────────────────────── */
const Ico = {
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  ),
  Overview: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2.5" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  Wallet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-3" />
      <path d="M16 12h5v4h-5a2 2 0 010-4z" />
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Help: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" className="w-6 h-6">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="16" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────
   MOCK DATA  (replace with your shared/data import)
───────────────────────────────────────────────────────── */
const patientProfile = { name: "Rahul Verma", avatar: "RV", role: "Patient" };

const navItems = [
  { id: "home",         label: "Home",         Icon: Ico.Home,     path: "/" },
  { id: "overview",     label: "Overview",     Icon: Ico.Overview },
  { id: "appointments", label: "Appointments", Icon: Ico.Calendar, badge: 2 },
  { id: "transactions", label: "Transactions", Icon: Ico.Wallet },
  { id: "profile",      label: "Profile",      Icon: Ico.Profile },
];

/* ─────────────────────────────────────────────────────────
   SIDEBAR CONTENT
   • All colors reference your Tailwind theme classes
   • font-display = Outfit, font-sans = Inter
   • rounded-medical = 12px, shadow-soft, spacing-md/lg etc.
───────────────────────────────────────────────────────── */
function SidebarContent({ active, setActive, onClose }) {
  const navigate = useNavigate?.() ?? (() => {});
  const location = useLocation?.() ?? { pathname: "/" };
  const { name, avatar, role } = patientProfile;

  return (
    <aside className="w-64 h-full flex flex-col bg-background-card border-r border-ternary shadow-soft font-sans">

      {/* ── Logo ── */}
      <div className="flex items-center justify-between px-md pt-lg pb-md border-b border-ternary shrink-0">
        <div className="flex items-center gap-sm">
          <div className="w-10 h-10 rounded-medical flex items-center justify-center
                          bg-primary text-white shadow-soft">
            <Ico.Logo />
          </div>
          <div>
            <h1 className="font-display text-lg font-black text-gray-800 leading-none">
              Medi<span className="text-primary">AI</span>
            </h1>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">
              Smart Healthcare
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-xs rounded-medical text-gray-400
                       hover:bg-ternary hover:text-gray-700 transition-colors duration-150"
          >
            <Ico.Close />
          </button>
        )}
      </div>

      {/* ── Profile card ── */}
      <div className="px-sm py-md border-b border-ternary shrink-0">
        <div className="flex items-center gap-sm p-sm rounded-medical bg-primary-light">
          <div className="w-10 h-10 rounded-full flex items-center justify-center
                          bg-primary text-white text-xs font-black shrink-0 shadow-soft">
            {avatar}
          </div>
          <div className="min-w-0">
            <div className="font-display text-sm font-bold text-gray-800 truncate">{name}</div>
            <div className="flex items-center gap-xs mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-secondary">{role} · Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section label ── */}
      <p className="px-md mt-md mb-xs text-[10px] font-bold tracking-widest text-gray-400 uppercase shrink-0">
        Navigation
      </p>

      {/* ── Nav items ── */}
      <nav className="flex-1 overflow-y-auto px-xs space-y-[2px] pb-sm min-h-0">
        {navItems.map(({ id, label, Icon, path, badge }) => {
          const isActive = active === id || location.pathname === path;
          return (
            <button
              key={id}
              onClick={() => { path ? navigate(path) : setActive(id); onClose?.(); }}
              className={[
                "group w-full flex items-center gap-sm px-sm py-[10px] rounded-medical",
                "text-sm font-semibold transition-all duration-200 relative",
                isActive
                  ? "bg-primary-light text-primary"
                  : "text-gray-500 hover:bg-background-soft",
              ].join(" ")}
            >
              {/* Active accent bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2
                                 w-[3px] h-5 rounded-r-full bg-primary" />
              )}

              {/* Icon container */}
              <span className={[
                "w-8 h-8 rounded-medical flex items-center justify-center shrink-0 transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "bg-primary-light text-primary",
              ].join(" ")}>
                <Icon />
              </span>

              <span className="flex-1 text-left">{label}</span>

              {/* Notification badge — uses accent color */}
              {badge && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full
                                 bg-accent text-white min-w-[20px] text-center">
                  {badge}
                </span>
              )}

              {/* Hover chevron */}
              {!isActive && (
                <span className="opacity-0 group-hover:opacity-40 -translate-x-1
                                 group-hover:translate-x-0 transition-all duration-200 text-gray-400">
                  <Ico.Arrow />
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Help card ── */}
      <div className="px-sm pb-sm shrink-0">
        <div className="rounded-medical p-sm flex items-center gap-sm
                        bg-primary-light border border-ternary">
          <div className="w-8 h-8 rounded-medical flex items-center justify-center
                          bg-secondary text-white shrink-0">
            <Ico.Help />
          </div>
          <div className="min-w-0">
            <div className="font-display text-xs font-bold text-gray-700">Need Help?</div>
            <div className="text-[10px] text-gray-400 truncate">Support available 24/7</div>
          </div>
        </div>
      </div>

      {/* ── Logout ── */}
      <div className="px-xs pb-lg pt-sm border-t border-ternary shrink-0">
        <button
          onClick={() => navigate("/login")}
          className="group w-full flex items-center gap-sm px-sm py-[10px]
                     rounded-medical text-sm font-semibold text-accent
                     hover:bg-red-50 transition-colors duration-200"
        >
          <span className="w-8 h-8 rounded-medical flex items-center justify-center
                           bg-red-50 text-accent group-hover:bg-red-100 transition-colors shrink-0">
            <Ico.Logout />
          </span>
          Logout
        </button>
      </div>

    </aside>
  );
}

/* ─────────────────────────────────────────────────────────
   EXPORTED WRAPPER — handles responsive mobile drawer
───────────────────────────────────────────────────────── */
export default function Sidebar({ active, setActive, onClose }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const close = () => { setMobileOpen(false); onClose?.(); };

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40
                      flex items-center justify-between px-md py-sm
                      bg-background-card/90 backdrop-blur-md
                      border-b border-ternary shadow-soft font-sans">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-medical bg-primary text-white
                          flex items-center justify-center">
            <Ico.Logo />
          </div>
          <span className="font-display text-base font-black text-gray-800">
            Medi<span className="text-primary">AI</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-xs rounded-medical text-gray-500
                     hover:bg-ternary transition-colors duration-150"
        >
          <Ico.Menu />
        </button>
      </div>

      {/* ── Desktop sidebar (always visible) ── */}
      <div className="hidden lg:block h-full">
        <SidebarContent active={active} setActive={setActive} />
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" onClick={close}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" />
          {/* Panel */}
          <div
            className="relative h-full"
            onClick={e => e.stopPropagation()}
            style={{ animation: "slideIn .22s cubic-bezier(.32,0,.15,1)" }}
          >
            <SidebarContent active={active} setActive={setActive} onClose={close} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>
    </>
  );
}