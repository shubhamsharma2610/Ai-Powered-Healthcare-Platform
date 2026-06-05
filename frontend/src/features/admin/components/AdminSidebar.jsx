import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutAPI } from "../../../redux/slices/authSlice";
import { LayoutDashboard, Stethoscope, Users, FileText, LogOut, X } from "lucide-react";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/admin/patients", label: "Patients", icon: Users },
  { to: "/admin/requests", label: "Requests", icon: FileText },
];

export default function AdminSidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAPI());
    dispatch(logout());
    navigate("/login");
    if (onClose) onClose();
  };

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'A';
  };

  const adminName = user?.fullName || 'Admin';
  const adminEmail = user?.email || 'admin@healthai.com';

  const SidebarContent = () => (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">HealthAI</h1>
        <p className="text-xs text-gray-500">Admin Panel</p>
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {getInitials()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800 truncate">{adminName}</p>
            <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-20">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full animate-slide-in">
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white shadow-md"
              >
                <X size={18} />
              </button>
              <SidebarContent />
            </div>
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