import React, { useState, useEffect } from "react";
import { Menu, User, LogOut, UserCircle, ChevronDown, CheckCircle, XCircle, Clock, AlertCircle, Send } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutAPI } from "../../../redux/slices/authSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

export default function DoctorTopbar({ setActive, active, onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isApproved, setIsApproved] = useState(null);
  const [submittedForApproval, setSubmittedForApproval] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  
  const doctorName = user?.fullName || 'Dr. Sarah Wilson';
  const doctorSpecialty = user?.specialization || 'Cardiologist';
  const doctorInitial = doctorName.split(' ').map(n => n[0]).join('') || 'DW';

  useEffect(() => {
    fetchDoctorStatus();
  }, []);

  const fetchDoctorStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/doctors/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      const data = response.data?.data;
      setIsApproved(data?.isApproved || false);
      setSubmittedForApproval(data?.submittedForApproval || false);
      setIsRejected(data?.isRejected || false);
      
      // Show reminder if not approved and not submitted
      if (!data?.isApproved && !data?.submittedForApproval && !data?.isRejected) {
        setShowReminder(true);
      } else {
        setShowReminder(false);
      }
    } catch (error) {
      console.error('Error fetching doctor status:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleGoToProfile = () => {
    setActive("profile");
    setShowReminder(false);
    setShowDropdown(false);
  };

  // Get approval status badge
  const getApprovalBadge = () => {
    if (loading) {
      return { text: 'Checking...', color: 'text-gray-500', bg: 'bg-gray-100', icon: Clock };
    }
    if (isApproved) {
      return { text: 'Approved', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    }
    if (submittedForApproval) {
      return { text: 'Pending Review', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock };
    }
    if (isRejected) {
      return { text: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
    }
    return { text: 'Not Submitted', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle };
  };

  const approvalStatus = getApprovalBadge();
  const StatusIcon = approvalStatus.icon;

  return (
    <>
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
          <div className="flex items-center gap-3">
            {/* Approval Status Badge */}
            {!loading && (
              <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${approvalStatus.bg} ${approvalStatus.color}`}>
                <StatusIcon size={12} />
                {approvalStatus.text}
              </div>
            )}
            
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-medical hover:bg-gray-50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {doctorInitial}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{doctorName}</p>
                    <div className={`sm:hidden flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs ${approvalStatus.bg} ${approvalStatus.color}`}>
                      <StatusIcon size={10} />
                    </div>
                  </div>
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-medical shadow-lg border border-gray-100 z-50 overflow-hidden">
                    {/* Doctor Info in Dropdown */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-800">{doctorName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <div className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${approvalStatus.bg} ${approvalStatus.color}`}>
                        <StatusIcon size={10} />
                        {approvalStatus.text}
                      </div>
                    </div>
                    
                    {/* ✅ Show submit button in dropdown if not approved */}
                    {!isApproved && !submittedForApproval && !isRejected && (
                      <button 
                        onClick={handleGoToProfile} 
                        className="w-full px-4 py-2.5 text-left text-sm text-primary hover:bg-primary/5 transition-colors flex items-center gap-3 border-b border-gray-100"
                      >
                        <Send className="w-4 h-4" />
                        Complete Profile & Submit
                      </button>
                    )}
                    
                    {isRejected && (
                      <button 
                        onClick={handleGoToProfile} 
                        className="w-full px-4 py-2.5 text-left text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Update Rejected Profile
                      </button>
                    )}
                    
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
        </div>
      </header>

      {/* ✅ REMINDER BANNER - Show when profile is incomplete */}
      {showReminder && !loading && !isApproved && !submittedForApproval && !isRejected && (
        <div className="bg-orange-50 border-b border-orange-200 px-4 lg:px-6 py-2.5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-600" />
              <p className="text-sm text-orange-800">
                <span className="font-medium">Action Required:</span> Please complete your profile and submit for approval to start accepting appointments.
              </p>
            </div>
            <button
              onClick={handleGoToProfile}
              className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1"
            >
              <Send size={14} />
              Complete Profile
            </button>
          </div>
        </div>
      )}

      {/* ✅ PENDING BANNER - Show when waiting for admin review */}
      {!loading && !isApproved && submittedForApproval && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 lg:px-6 py-2.5">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-yellow-600" />
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Under Review:</span> Your profile has been submitted for approval. Admin will review it shortly.
            </p>
          </div>
        </div>
      )}

      {/* ✅ REJECTED BANNER - Show when rejected */}
      {!loading && !isApproved && isRejected && (
        <div className="bg-red-50 border-b border-red-200 px-4 lg:px-6 py-2.5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <XCircle size={18} className="text-red-600" />
              <p className="text-sm text-red-800">
                <span className="font-medium">Profile Rejected:</span> Your profile was not approved. Please update your information and resubmit.
              </p>
            </div>
            <button
              onClick={handleGoToProfile}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}