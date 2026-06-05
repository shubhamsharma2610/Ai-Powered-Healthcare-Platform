import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutAPI } from "../../../redux/slices/authSlice";

// ──────────────────────────────────────────────
// 🔁 Navigation Items (Static for Patient)
// ──────────────────────────────────────────────
const navItems = [
  { id: "overview", label: "Overview", Icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ) },
  { id: "appointments", label: "Appointments", Icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ) },
  { id: "transactions", label: "Transactions", Icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ) },
  { id: "profile", label: "Profile", Icon: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ) },
];

const Ico = {
  Logo: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Logout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

// ──────────────────────────────────────────────
// SidebarContent (Inner logic - No navigation)
// ──────────────────────────────────────────────
function SidebarContent({ active, setActive, onClose }) {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  
  const avatar = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const name = user?.fullName || 'User';
  const userRole = role || 'patient';

  const handleNavClick = (id) => {
    setActive(id);  // ✅ Only update active state, no navigation
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    await dispatch(logoutAPI());
    dispatch(logout());
    if (onClose) onClose();
  };

  return (
    <aside className="w-[280px] lg:w-64 h-full flex flex-col bg-white border-r border-gray-100 font-sans overflow-hidden shadow-2xl lg:shadow-none">
      
      {/* Logo Section */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 shrink-0">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-white shadow-lg shadow-primary/20">
            <Ico.Logo />
          </div>
          <div>
            <h1 className="font-display text-lg font-black text-gray-800 leading-none">
              Health<span className="text-primary">Hub</span>
            </h1>
            <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase mt-1">Smart Health</p>
          </div>
        </Link>
        
        {/* Mobile Close Button */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <Ico.Close />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="px-4 py-6 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white text-xs font-bold shadow-sm">
            {avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-gray-800 truncate">{name}</div>
            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter capitalize">{userRole}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        <p className="px-4 py-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">Main Menu</p>
        {navItems.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20 translate-x-1" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-primary"}`}
            >
              <span className={`shrink-0 ${isActive ? "text-white" : "text-primary"}`}>
                <Icon />
              </span>
              <span className="flex-1 text-left">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all active:scale-95"
        >
          <Ico.Logout /> Logout
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </aside>
  );
}

// ──────────────────────────────────────────────
// Main Sidebar Export (Responsive Logic)
// ──────────────────────────────────────────────
export default function Sidebar({ active, setActive, onClose, mobileOpen }) {
  return (
    <>
      {/* 1. Desktop Sidebar (Always visible on large screens) */}
      <div className="hidden lg:flex h-full fixed left-0 top-0 z-40">
        <SidebarContent active={active} setActive={setActive} />
      </div>

      {/* 2. Mobile Drawer (Controlled by mobileOpen) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          {/* Backdrop Blur Overlay */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300" 
            onClick={onClose} 
          />
          
          {/* Animated Menu Panel */}
          <div className="relative h-full shadow-2xl animate-slide-in">
            <SidebarContent active={active} setActive={setActive} onClose={onClose} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </>
  );
}