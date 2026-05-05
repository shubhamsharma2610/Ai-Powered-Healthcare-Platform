import React from "react"
import { Icon, icons } from "./shared/Icon";
import StatusBadge from "./shared/StatusBadge";
import { overviewCards, appointments } from "./shared/data";

export default function OverviewSection() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Outfit',sans-serif" }}>
        Good morning, Rahul 👋
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {overviewCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.bg, color: card.color }}
              >
                <Icon d={icons[card.icon]} size={18} />
              </div>
              <Icon d={icons.trend} size={14} stroke={card.color} />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-0.5" style={{ fontFamily: "'Outfit',sans-serif" }}>
              {card.value}
            </div>
            <div className="text-sm text-gray-500 mb-1">{card.label}</div>
            <div className="text-xs font-medium" style={{ color: card.color }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Upcoming Appointments
          </h3>
          <span className="text-xs text-[hsl(182,100%,37%)] font-medium cursor-pointer hover:underline">
            View all
          </span>
        </div>
        <div className="space-y-3">
          {appointments
            .filter((a) => a.status === "upcoming")
            .map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8fafc]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: a.color }}
                >
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{a.doctor}</div>
                  <div className="text-xs text-gray-400">
                    {a.specialty} · {a.date} at {a.time}
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
