import React from "react"
import { Icon, icons } from "./shared/Icon";
import { patientProfile } from "./shared/data";

const navItems = [
  { id: "overview",     label: "Overview",     icon: "overview"     },
  { id: "appointments", label: "Appointments", icon: "appointments" },
  { id: "transactions", label: "Transactions", icon: "transactions" },
  { id: "profile",      label: "Profile",      icon: "profile"      },
];

export default function Sidebar({ active, setActive, onClose }) {
  const { name, avatar, role } = patientProfile;

  return (
    <aside className="w-60 bg-white border-r border-gray-100 flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-50">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "hsl(182,100%,37%)" }}
        >
          <Icon d={icons.pulse} size={16} stroke="white" strokeWidth={2.2} />
        </div>
        <span className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Outfit',sans-serif" }}>
          Medi<span style={{ color: "hsl(182,100%,37%)" }}>AI</span>
        </span>
      </div>

      {/* Patient Mini Profile */}
      <div className="px-4 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(182,100%,95%)]">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: "hsl(182,100%,37%)" }}
          >
            {avatar}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">{name}</div>
            <div className="text-xs text-gray-400">{role}</div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActive(item.id); onClose?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={
              active === item.id
                ? { background: "hsl(182,100%,92%)", color: "hsl(182,100%,30%)" }
                : { color: "#64748b" }
            }
          >
            <Icon
              d={icons[item.icon]}
              size={17}
              stroke={active === item.id ? "hsl(182,100%,37%)" : "#94a3b8"}
            />
            {item.label}
            {item.id === "appointments" && (
              <span
                className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-md"
                style={{ background: "hsl(182,100%,37%)", color: "white" }}
              >
                2
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 transition-colors duration-150">
          <Icon d={icons.logout} size={17} stroke="#f87171" />
          Logout
        </button>
      </div>
    </aside>
  );
}
