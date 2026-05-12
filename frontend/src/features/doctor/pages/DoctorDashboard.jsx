// src/features/doctor/pages/DoctorDashboard.jsx
import React, { useState } from "react";
import Sidebar from "../components/DoctorSidebar";
import Topbar from "../components/Topbar";
import OverviewSection from "../components/OverviewSection";
import AppointmentsSection from "../components/AppointmentsSection";
import PatientsSection from "../components/PatientsSection";
import ScheduleSection from "../components/ScheduleSection";
import ProfileSection from "../components/ProfileSection";

export default function DoctorDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "overview":      return <OverviewSection />;
      case "appointments":  return <AppointmentsSection />;
      case "patients":      return <PatientsSection />;
      case "schedule":      return <ScheduleSection />;
      case "profile":       return <ProfileSection />;
      default:              return <OverviewSection />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* SIDEBAR */}
      <Sidebar 
        active={active} 
        setActive={setActive} 
        mobileOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:pl-64">
        
        {/* TOPBAR */}
        <Topbar 
          active={active} 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}