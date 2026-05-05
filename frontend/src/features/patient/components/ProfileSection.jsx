import { Icon, icons } from "./shared/Icon";
import { patientProfile } from "./shared/data";

export default function ProfileSection() {
  const { name, id, avatar, fields, health } = patientProfile;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Outfit',sans-serif" }}>
        My Profile
      </h2>

      {/* Main Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        {/* Avatar Row */}
        <div className="flex items-center gap-5 mb-7 pb-6 border-b border-gray-50">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: "hsl(182,100%,37%)" }}
          >
            {avatar}
          </div>
          <div>
            <div className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Outfit',sans-serif" }}>
              {name}
            </div>
            <div className="text-sm text-gray-400">Patient ID: {id}</div>
          </div>
          <button className="ml-auto flex items-center gap-1.5 text-sm font-medium text-[hsl(182,100%,37%)] border border-[hsl(182,100%,75%)] px-4 py-2 rounded-xl hover:bg-[hsl(182,100%,95%)] transition-colors duration-150">
            <Icon d={icons.edit} size={14} stroke="hsl(182,100%,37%)" />
            Edit
          </button>
        </div>

        {/* Info Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {fields.map((f, i) => (
            <div key={i}>
              <div className="text-xs text-gray-400 font-medium mb-1">{f.label}</div>
              <div className="text-sm font-semibold text-gray-800">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Summary Card */}
      <div
        className="border rounded-2xl p-5"
        style={{ background: "hsl(182,100%,95%)", borderColor: "hsl(182,100%,82%)" }}
      >
        <div className="text-sm font-semibold mb-3" style={{ color: "hsl(182,100%,25%)" }}>
          Health Summary
        </div>
        <div className="grid grid-cols-3 gap-4">
          {health.map((h, i) => (
            <div key={i} className="text-center bg-white rounded-xl p-3">
              <div
                className="text-lg font-bold"
                style={{ color: "hsl(182,100%,37%)", fontFamily: "'Outfit',sans-serif" }}
              >
                {h.value}
              </div>
              <div className="text-xs text-gray-400">{h.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
