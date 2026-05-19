
import React from "react"
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Overview", icon: "📊" },
  { to: "/admin/doctors", label: "Doctors", icon: "👨‍⚕️" },
  { to: "/admin/requests", label: "Requests", icon: "📋" },
];

export default function AdminSidebar({ onClose }) {
  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">HealthAI</h1>
        <p className="text-xs text-gray-500">Admin Panel</p>
      </div>

      {/* Navigation - Text always visible */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/admin"}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => {
            localStorage.removeItem("admin_token");
            window.location.href = "/admin/login";
          }}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}