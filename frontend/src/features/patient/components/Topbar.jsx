import React from "react"
import { Icon, icons } from "./shared/Icon";

export default function Topbar({ active, onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={onMenuClick}
        >
          <Icon d={icons.menu} size={18} stroke="#64748b" strokeWidth={2} />
        </button>

        <div>
          <h1
            className="text-base font-semibold text-gray-800 capitalize"
            style={{ fontFamily: "'Outfit',sans-serif" }}
          >
            {active}
          </h1>
          <p className="text-xs text-gray-400">Tuesday, 6 May 2026</p>
        </div>
      </div>

      {/* Notification Bell */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Icon d={icons.bell} size={18} stroke="#64748b" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "hsl(182,100%,37%)" }}
          />
        </button>
      </div>
    </header>
  );
}
