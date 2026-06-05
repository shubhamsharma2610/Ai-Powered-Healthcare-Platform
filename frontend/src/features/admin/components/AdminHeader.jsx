import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, logoutAPI } from "../../../redux/slices/authSlice";
import { Menu, User, ChevronDown, LogOut } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutAPI());
    dispatch(logout());
    navigate("/login");
    setShowDropdown(false);
  };

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'A';
  };

  const adminName = user?.fullName || 'Admin';
  const adminEmail = user?.email || 'admin@healthai.com';

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section - Menu Button (Mobile) + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">Admin Dashboard</h2>
          <p className="text-xs text-gray-500 hidden sm:block">Manage doctors & requests</p>
        </div>
      </div>

      {/* Right Section - Profile */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            {getInitials()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {adminName.split(' ')[0]}
          </span>
          <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
        </button>

        {showDropdown && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-800">{adminName}</p>
                <p className="text-xs text-gray-500">{adminEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
                  Admin
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}