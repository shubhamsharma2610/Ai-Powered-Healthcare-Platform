import React from "react";
import { Icon, icons } from "./shared/Icon";
import { patientProfile } from "./shared/data";

export default function ProfileSection() {
  const { name, id, avatar, fields, health } = patientProfile;

  return (
    <div className="w-full max-w-5xl mx-auto">

      {/* Heading */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 font-[Outfit]">
        My Profile
      </h2>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-7 mb-6">

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 pb-6 border-b border-gray-100">

          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(182,100%,37%), hsl(182,100%,50%))"
            }}
          >
            {avatar}
          </div>

          {/* Name + ID */}
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-900 font-[Outfit]">
              {name}
            </div>
            <div className="text-sm text-gray-400">
              Patient ID: {id}
            </div>
          </div>

          {/* Edit Button */}
          <button
            className="flex items-center gap-2 text-sm font-medium text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition"
            style={{ background: "hsl(182,100%,37%)" }}
          >
            <Icon d={icons.edit} size={14} stroke="white" />
            Edit
          </button>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
                {f.label}
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Summary */}
      <div
        className="rounded-3xl p-6 shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, hsl(182,100%,95%), hsl(182,100%,90%))",
          border: "1px solid hsl(182,100%,82%)"
        }}
      >
        <div
          className="text-sm font-semibold mb-4"
          style={{ color: "hsl(182,100%,25%)" }}
        >
          Health Summary
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {health.map((h, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <div
                className="text-lg sm:text-xl font-bold mb-1"
                style={{
                  color: "hsl(182,100%,37%)",
                  fontFamily: "'Outfit',sans-serif"
                }}
              >
                {h.value}
              </div>
              <div className="text-xs text-gray-400">
                {h.label}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}