import React from "react";

export default function Topbar({ active, onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-600"
        >
          ☰
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-900">{active === "overview" ? "Overview" : active === "appointments" ? "Appointments" : active === "patients" ? "Patients" : active === "schedule" ? "Schedule" : "Profile"}</h1>
          <p className="text-xs text-gray-500">Doctor dashboard</p>
        </div>
      </div>
      <div className="text-sm text-gray-500">Welcome back, Doctor</div>
    </header>
  );
}
