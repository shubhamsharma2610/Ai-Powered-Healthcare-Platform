import React from "react";
import { Icon, icons } from "./shared/Icon";

function getTodayString() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Topbar({ active, onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-3 flex items-center justify-between shrink-0 sticky top-0 z-30">
      
      <div className="flex items-center gap-3">
        {/* ☰ YEH BUTTON MISSING THA: Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100"
        >
          <Icon d={icons.menu} size={20} stroke="currentColor" />
        </button>

        <div>
          <h1 className="text-base lg:text-lg font-bold text-gray-800 capitalize" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {active || "Dashboard"}
          </h1>
          <p className="text-[10px] lg:text-xs text-gray-400">{getTodayString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Icon d={icons.bell} size={20} stroke="#64748b" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </button>
      </div>
    </header>
  );
}