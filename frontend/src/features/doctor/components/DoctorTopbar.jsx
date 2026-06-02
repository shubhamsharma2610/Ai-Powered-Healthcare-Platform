import React, { useState } from "react";
import { Menu, User, LogOut, UserCircle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutAPI } from "../../../redux/slices/authSlice";

export default function DoctorTopbar({ setActive, active, onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get doctor data from Redux
  const { user } = useSelector((state) => state.auth);
  
  const doctorName = user?.fullName || 'Dr. Sarah Wilson';
  const doctorSpecialty = user?.specialization || 'Cardiologist';
  const doctorInitial = doctorName.split(' ').map(n => n[0]).join('') || 'DW';

  // Page titles
  const getPageTitle = () => {
    const titles = {
      overview: "Overview",
      appointments: "Appointments",
      patients: "Patients",
      schedule: "Schedule",
      profile: "Profile"
    };
    return titles[active] || "Dashboard";
  };

  const handleProfileClick = () => {
    setActive("profile");
    setShowDropdown(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutAPI());
    dispatch(logout());
    navigate("/login");
    setShowDropdown(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        
        {/* Left Section - Menu + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-medical bg-gray-50 text-gray-600 hover:bg-primary-light/20 hover:text-primary transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {getPageTitle()}
            </h1>
            <h3 className="text-xs text-gray-500">Doctor Dashboard</h3>
          </div>
        </div>

        {/* Right Section - Doctor Info + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-medical hover:bg-gray-50 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              {doctorInitial}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{doctorName}</p>
              <p className="text-xs text-gray-500 capitalize">{doctorSpecialty}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-medical shadow-lg border border-gray-100 z-50 overflow-hidden">
                <button 
                  onClick={handleProfileClick} 
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <UserCircle className="w-4 h-4" />
                  My Profile
                </button>
                <button 
                  onClick={handleLogout} 
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}