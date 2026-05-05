import React from "react"
import { useState } from "react";
import { Icon, icons } from "./shared/Icon";
import StatusBadge from "./shared/StatusBadge";
import { appointments } from "./shared/data";

const filters = ["all", "upcoming", "completed", "cancelled"];

export default function AppointmentsSection() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Outfit',sans-serif" }}>
        My Appointments
      </h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200"
            style={
              filter === f
                ? { background: "hsl(182,100%,37%)", color: "white" }
                : { background: "#f1f5f9", color: "#64748b" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all duration-200"
          >
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
              style={{ background: a.color }}
            >
              {a.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-base">{a.doctor}</div>
              <div className="text-sm text-gray-400">{a.specialty}</div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Icon d={icons.calendar} size={13} />
                  {a.date}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Icon d={icons.clock} size={13} />
                  {a.time}
                </span>
              </div>
            </div>

            {/* Status + Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <StatusBadge status={a.status} />
              {a.status === "upcoming" && (
                <button className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors duration-150">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
