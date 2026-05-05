import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, User, LogOut,
  LayoutDashboard, Settings, Activity, Search
} from 'lucide-react';

const Navbar = ({ role = "patient", isAuthenticated = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#profile-dropdown')) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about-us', label: 'About Us' },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-12">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div
              className="p-2 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200"
              style={{ background: 'hsl(182,100%,37%)' }}
            >
              <Activity className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Health<span style={{ color: 'hsl(182,100%,37%)' }}>Hub</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors duration-200 relative group ${
                  location.pathname === link.to
                    ? 'text-[hsl(182,100%,37%)]'
                    : 'text-slate-600 hover:text-[hsl(182,100%,37%)]'
                }`}
              >
                {link.label}
                {/* Active underline */}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-200 ${
                    location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  style={{ background: 'hsl(182,100%,37%)' }}
                />
              </Link>
            ))}

            {(!role || role === 'patient') && (
              <Link
                to="/patient/find-doctor"
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[hsl(182,100%,37%)] transition-colors duration-200 relative group"
              >
                <Search size={15} />
                Find Doctor
                <span className="absolute -bottom-1 left-0 h-[2px] rounded-full w-0 group-hover:w-full transition-all duration-200" style={{ background: 'hsl(182,100%,37%)' }} />
              </Link>
            )}

            {/* ── Auth Section ── */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-700 hover:text-[hsl(182,100%,37%)] transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="text-sm font-bold text-white px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                  style={{
                    background: 'hsl(182,100%,37%)',
                    boxShadow: '0 4px 16px -2px hsl(182,100%,37%,0.4)',
                  }}
                >
                  Create Account
                </button>
              </div>
            ) : (
              /* Profile Dropdown */
              <div className="relative ml-2" id="profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-[hsl(182,100%,75%)] hover:bg-[hsl(182,100%,97%)] transition-all duration-200"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'hsl(182,100%,92%)', color: 'hsl(182,100%,37%)' }}
                  >
                    <User size={17} />
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden z-50">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest capitalize">
                        {role} Portal
                      </p>
                    </div>
                    <Link
                      to={`/${role}/dashboard`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors duration-150"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      to={`/${role}/edit-profile`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors duration-150"
                    >
                      <Settings size={16} /> Edit Profile
                    </Link>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile Menu Button ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors duration-150"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white border-t border-slate-100 shadow-xl px-4 py-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                location.pathname === link.to
                  ? 'bg-[hsl(182,100%,92%)] text-[hsl(182,100%,37%)]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {(!role || role === 'patient') && (
            <Link
              to="/patient/find-doctor"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors duration-150"
            >
              <Search size={16} /> Find Doctor
            </Link>
          )}

          <div className="h-px bg-slate-100 my-2" />

          {!isAuthenticated ? (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => { navigate('/login'); setIsOpen(false); }}
                className="py-2.5 text-sm font-bold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { navigate('/signup'); setIsOpen(false); }}
                className="py-2.5 text-sm font-bold text-white rounded-xl transition-all"
                style={{ background: 'hsl(182,100%,37%)' }}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="space-y-1 pt-1">
              <Link
                to={`/${role}/dashboard`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link
                to={`/${role}/edit-profile`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors"
              >
                <Settings size={16} /> Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;