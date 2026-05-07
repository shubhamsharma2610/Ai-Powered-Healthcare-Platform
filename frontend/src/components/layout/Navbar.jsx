import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Activity,
  Search,
} from 'lucide-react';

const Navbar = ({ role = "patient", isAuthenticated = true }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Theme Colors
  const PRIMARY = "hsl(182,100%,37%)";
  const PRIMARY_LIGHT = "hsl(182,100%,95%)";
  const PRIMARY_BORDER = "hsl(182,100%,85%)";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown outside click
  useEffect(() => {

    const handler = (e) => {
      if (!e.target.closest('#profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);

    return () => document.removeEventListener('mousedown', handler);

  }, []);

  const handleLogout = () => {
    console.log("Logout");
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about-us', label: 'About Us' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b
      ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-100'
          : 'bg-white border-transparent'
      }`}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Navbar Height */}
        <div className="flex items-center justify-between h-[74px]">

          {/* ───────── Logo ───────── */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group"
          >

            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200"
              style={{
                background: PRIMARY,
              }}
            >
              <Activity className="text-white" size={22} />
            </div>

            <div className="leading-tight">
              <h1
                className="text-xl font-bold tracking-tight text-slate-800"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Health
                <span style={{ color: PRIMARY }}>
                  Hub
                </span>
              </h1>

              <p className="text-[11px] text-slate-400 font-medium">
                Smart Healthcare
              </p>
            </div>

          </Link>

          {/* ───────── Desktop Navigation ───────── */}
          <div className="hidden md:flex items-center gap-7">

            {navLinks.map((link) => {

              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? 'text-[hsl(182,100%,37%)]'
                      : 'text-slate-600 hover:text-[hsl(182,100%,37%)]'
                  }`}
                >

                  {link.label}

                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300
                    ${
                      isActive
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                    style={{ background: PRIMARY }}
                  />

                </Link>
              );
            })}

            {/* Find Doctor */}
            {(!role || role === 'patient') && (
              <Link
                to="/patient/find-doctor"
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[hsl(182,100%,37%)] transition-colors duration-200"
              >
                <Search size={16} />
                Find Doctor
              </Link>
            )}

            {/* ───────── Auth Section ───────── */}
            {!isAuthenticated ? (

              <div className="flex items-center gap-3">

                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-slate-700 hover:text-[hsl(182,100%,37%)] transition-colors"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
                  style={{
                    background: PRIMARY,
                  }}
                >
                  Create Account
                </button>

              </div>

            ) : (

              /* Profile Dropdown */
              <div
                className="relative"
                id="profile-dropdown"
              >

                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all duration-200"
                  style={{
                    borderColor: PRIMARY_BORDER,
                  }}
                >

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: PRIMARY_LIGHT,
                      color: PRIMARY,
                    }}
                  >
                    <User size={17} />
                  </div>

                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform duration-200
                    ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`}
                  />

                </button>

                {/* Dropdown */}
                {isProfileOpen && (

                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">

                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
                        {role} Portal
                      </p>
                    </div>

                    <Link
                      to={`/${role}/dashboard`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <Link
                      to={`/${role}/edit-profile`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors"
                    >
                      <Settings size={17} />
                      Edit Profile
                    </Link>

                    <div className="h-px bg-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* ───────── Mobile Menu Button ───────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

      </div>

      {/* ───────── Mobile Menu ───────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300
        ${
          isOpen
            ? 'max-h-[600px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >

        <div className="bg-white border-t border-slate-100 px-4 py-5 space-y-1 shadow-xl">

          {navLinks.map((link) => (

            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors
              ${
                location.pathname === link.to
                  ? 'bg-[hsl(182,100%,95%)] text-[hsl(182,100%,37%)]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>

          ))}

        </div>

      </div>

    </nav>
  );
};

export default Navbar;