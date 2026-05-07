import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import OverviewSection from "../components/OverviewSection";
import AppointmentsSection from "../components/AppointmentsSection";
import TransactionsSection from "../components/TransactionsSection";
import ProfileSection from "../components/ProfileSection";

export default function PatientDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "overview":      return <OverviewSection />;
      case "appointments":  return <AppointmentsSection />;
      case "transactions":  return <TransactionsSection />;
      case "profile":       return <ProfileSection />;
      default:              return <OverviewSection />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── SIDEBAR (Handle both Desktop & Mobile) ── */}
      {/* Humne Sidebar file mein pehle hi logic likh di hai, bas props pass karne hain */}
      <Sidebar 
        active={active} 
        setActive={setActive} 
        mobileOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* ── TOPBAR (Isi mein Mobile Header aur Hamburger built-in hai) ── */}
        <Topbar 
          active={active} 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* ── SCROLLABLE CONTENT ── */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 custom-scrollbar">
          {/* Dashboard Content */}
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