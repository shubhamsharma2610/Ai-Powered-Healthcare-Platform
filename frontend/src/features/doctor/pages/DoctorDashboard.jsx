import React, { useState } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import DoctorTopbar from "../components/DoctorTopbar";
import DoctorOverviewSection from "../components/DoctorOverviewSection";
import DoctorAppointmentsSection from "../components/DoctorAppointmentsSection";
import DoctorPatientsSection from "../components/DoctorPatientsSection";
import DoctorScheduleSection from "../components/DoctorScheduleSection";
import DoctorProfileSection from "../components/DoctorProfileSection";

export default function DoctorDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "overview":      return <DoctorOverviewSection />;
      case "appointments":  return <DoctorAppointmentsSection />;
      case "patients":      return <DoctorPatientsSection />;
      case "schedule":      return <DoctorScheduleSection />;
      case "profile":       return <DoctorProfileSection />;
      default:              return <DoctorOverviewSection />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* SIDEBAR */}
      <DoctorSidebar 
        active={active} 
        setActive={setActive} 
        mobileOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:pl-64">
        
        {/* TOPBAR */}
        <DoctorTopbar 
          active={active} 
          setActive={setActive}
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