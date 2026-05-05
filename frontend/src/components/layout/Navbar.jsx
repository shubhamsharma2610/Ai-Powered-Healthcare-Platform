import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, User, LogOut, 
  LayoutDashboard, Settings, Activity, Search 
} from 'lucide-react';

const Navbar = ({ role="patient", isAuthenticated=true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll effect for styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout Logic (Placeholder)
  const handleLogout = () => {
    console.log("Logging out...");

    navigate('/login');
    
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* 1. LOGO SECTION */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-[hsl(182,100%,37%)] rounded-xl shadow-lg group-hover:scale-105 transition-transform">
              <Activity className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              Health<span className="text-[hsl(182,100%,37%)]">Hub</span>
            </span>
          </Link>

          {/* 2. DESKTOP NAVIGATION (Conditional) */}
          <div className="hidden md:flex items-center gap-8">
            
            {/* Public Links & Patient Specific Links */}
            <Link to="/" className={`font-medium hover:text-[hsl(182,100%,37%)] transition-colors ${location.pathname === '/' ? 'text-[hsl(182,100%,37%)]' : 'text-slate-600'}`}>
              Home
            </Link>
            
            <Link to="/services" className="font-medium text-slate-600 hover:text-[hsl(182,100%,37%)] transition-colors">
              Services
            </Link>

            {/* Role-Based Links (If Patient or Public) */}
            {(!role || role === 'patient') && (
              <Link to="/patient/find-doctor" className="flex items-center gap-1 font-medium text-slate-600 hover:text-[hsl(182,100%,37%)] transition-colors">
                <Search size={18} /> Find Doctor
              </Link>
            )}

            {/* AI Assistant Link (For everyone) */}
            <Link to="/about-us" className="font-bold animate-pulse">
              About us
            </Link>

            {/* 3. AUTH SECTION (Login/Signup vs Profile) */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/login')} className="text-slate-700 font-semibold hover:text-[hsl(182,100%,37%)]">
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-[hsl(182,100%,37%)] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-[hsl(182,100%,37%)]/30 transition-all active:scale-95"
                >
                  Create Account
                </button>
              </div>
            ) : (
              /* PROFILE DROPDOWN */
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-[hsl(182,100%,95%)] flex items-center justify-center text-[hsl(182,100%,37%)]">
                    <User size={20} />
                  </div>
                  <ChevronDown size={16} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role} Portal</p>
                    </div>
                    
                    <Link to={`/${role}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    
                    <Link to={`/${role}/profile-setup`} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-[hsl(182,100%,95%)] hover:text-[hsl(182,100%,37%)] transition-colors">
                      <Settings size={18} /> Edit Profile
                    </Link>

                    <div className="h-px bg-slate-100 my-1" />
                    
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute top-full left-0 w-full shadow-2xl py-6 px-4 space-y-4 animate-in slide-in-from-top">
          <Link to="/" className="block px-4 py-2 font-medium text-slate-700" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/services" className="block px-4 py-2 font-medium text-slate-700" onClick={() => setIsOpen(false)}>Services</Link>
          {(!role || role === 'patient') && (
            <Link to="/patient/find-doctor" className="block px-4 py-2 font-medium text-slate-700" onClick={() => setIsOpen(false)}>Find Doctor</Link>
          )}
          
          <div className="h-px bg-slate-100 my-2" />
          
          {!isAuthenticated ? (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button onClick={() => navigate('/login')} className="py-3 font-bold text-slate-700 border border-slate-200 rounded-xl">Login</button>
              <button onClick={() => navigate('/signup')} className="py-3 font-bold bg-[hsl(182,100%,37%)] text-white rounded-xl">Sign Up</button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full py-3 font-bold text-red-500 border border-red-100 rounded-xl flex items-center justify-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;