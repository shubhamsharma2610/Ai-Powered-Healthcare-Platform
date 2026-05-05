import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import OverviewSection from "../components/OverviewSection";
import AppointmentsSection from "../components/AppointmentsSection";
import TransactionsSection from "../components/TransactionsSection";
import ProfileSection from "../components/ProfileSection";

function PatientDashboard() {
  const [active, setActive] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (active) {
      case "overview":
        return <OverviewSection />;
      case "appointments":
        return <AppointmentsSection />;
      case "transactions":
        return <TransactionsSection />;
      case "profile":
        return <ProfileSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div
      className="flex h-screen bg-[#f8fafc] overflow-hidden"
      style={{ fontFamily: "'Inter',sans-serif" }}
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          active={active}
          setActive={setActive}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          active={active}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* ONLY ONE SCROLL CONTAINER */}
        <main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default PatientDashboard;