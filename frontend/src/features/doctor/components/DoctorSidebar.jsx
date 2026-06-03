import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutAPI } from "../../../redux/slices/authSlice";

export default function DoctorSidebar({ active, setActive, mobileOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  // Get doctor details from user object
  const doctorName = user?.fullName || 'Dr. Rahul Sharma';
  const doctorSpecialty = user?.specialization || 'Cardiologist';
  const doctorInitial = doctorName.split(' ').map(n => n[0]).join('') || 'DR';

  const menuItems = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "appointments", name: "Appointments", icon: "📅" },
    { id: "patients", name: "Patients", icon: "👥" },
    { id: "schedule", name: "Schedule", icon: "⏰" },
    { id: "profile", name: "Profile", icon: "👨‍⚕️" },
  ];

  const handleLogout = async () => {
    await dispatch(logoutAPI());
    dispatch(logout());
    navigate("/login");
    if (mobileOpen && onClose) onClose();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Logo - Clickable to go home */}
      <div className="p-6 border-b border-gray-100">
        <div
          // onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200"
            style={{ backgroundColor: 'hsl(182, 100%, 37%)' }}
          >
            <span className="text-white text-xl">🏥</span>
          </div>
          <div className="leading-tight">
            <h1
              className="text-xl font-bold tracking-tight text-slate-800"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Health
              <span style={{ color: 'hsl(182, 100%, 37%)' }}>
                Hub
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Doctor Portal
            </p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActive(item.id);
              if (mobileOpen && onClose) onClose();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200
              ${active === item.id
                ? "text-primary shadow-sm"
                : "text-gray-600 hover:bg-primary-light hover:text-primary"
              }
            `}
            style={active === item.id ? {
              backgroundColor: 'hsl(182, 100%, 95%)',
              color: 'hsl(182, 100%, 37%)'
            } : {}}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-sm">{item.name}</span>
            {active === item.id && (
              <div
                className="ml-auto w-1.5 h-6 rounded-full"
                style={{ backgroundColor: 'hsl(182, 100%, 37%)' }}
              ></div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer - Doctor Info + Logout */}
      <div className="p-4 border-t border-gray-100 space-y-3">
        {/* Doctor Profile Card */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'hsl(182, 100%, 95%)', color: 'hsl(182, 100%, 37%)' }}
            >
              {doctorInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{doctorName}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{doctorSpecialty}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-20">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-black/50 z-30" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-64 z-40 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </>
  );
}