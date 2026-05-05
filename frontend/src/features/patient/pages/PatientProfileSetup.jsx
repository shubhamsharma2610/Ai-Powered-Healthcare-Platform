import React from "react"
import { useState } from "react";

// ── Simple Input ───────────────────────────────────────────────────────────
function Field({ label, type = "text", placeholder, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[hsl(182,100%,37%)] focus:ring-2 focus:ring-[hsl(182,100%,37%)]/20 transition-all duration-200 bg-white"
      />
    </div>
  );
}

// ── Simple Select ──────────────────────────────────────────────────────────
function SelectField({ label, options, value, onChange, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[hsl(182,100%,37%)] focus:ring-2 focus:ring-[hsl(182,100%,37%)]/20 transition-all duration-200 bg-white"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

// ── Section Heading ────────────────────────────────────────────────────────
function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-base"
        style={{ background: "hsl(182,100%,37%)" }}
      >
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-800" style={{ fontFamily: "'Outfit',sans-serif" }}>
        {title}
      </h3>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function PatientProfileSetup() {
  const [form, setForm] = useState({
    firstName:        "",
    lastName:         "",
    dob:              "",
    gender:           "",
    phone:            "",
    city:             "",
    state:            "",
    bloodGroup:       "",
    height:           "",
    weight:           "",
    allergies:        "",
    emergencyName:    "",
    emergencyPhone:   "",
    emergencyRelation:"",
  });

  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    // Basic validation
    if (!form.firstName || !form.lastName || !form.dob || !form.gender || !form.phone) {
      alert("Please fill all required fields.");
      return;
    }
    setSubmitted(true);
    // TODO: send form data to backend / context
    console.log("Profile data:", form);
  };

  // ── Success Screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4" style={{ fontFamily: "'Inter',sans-serif" }}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-sm w-full">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-5"
            style={{ background: "hsl(182,100%,37%)" }}
          >
            ✓
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Profile Setup Complete!
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Welcome, {form.firstName}! Your profile has been saved successfully.
          </p>
          <button
            onClick={() => window.location.href = "/dashboard"}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95"
            style={{ background: "hsl(182,100%,37%)" }}
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-10" style={{ fontFamily: "'Inter',sans-serif" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(182,100%,37%)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Medi<span style={{ color: "hsl(182,100%,37%)" }}>AI</span>
            </span>
          </div>

          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
            style={{ background: "hsl(182,100%,92%)", color: "hsl(182,100%,25%)" }}
          >
            Patient Onboarding
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Outfit',sans-serif" }}>
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-500">
            Help us personalize your healthcare experience. Fields marked <span className="text-red-400 font-medium">*</span> are required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">

          {/* Section 1 — Personal Info */}
          <div>
            <SectionHeading icon="👤" title="Personal Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name"   placeholder="Rahul"      value={form.firstName}  onChange={set("firstName")}  required />
              <Field label="Last Name"    placeholder="Sharma"     value={form.lastName}   onChange={set("lastName")}   required />
              <Field label="Date of Birth" type="date"             value={form.dob}         onChange={set("dob")}        required />
              <SelectField
                label="Gender"
                options={["Male", "Female", "Other", "Prefer not to say"]}
                value={form.gender}
                onChange={set("gender")}
                required
              />
              <Field label="Phone Number" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} required />
              <Field label="City"         placeholder="Ludhiana"   value={form.city}        onChange={set("city")} />
              <SelectField
                label="State"
                options={["Punjab","Delhi","Maharashtra","Karnataka","Tamil Nadu","Uttar Pradesh","Gujarat","Rajasthan","West Bengal","Telangana","Other"]}
                value={form.state}
                onChange={set("state")}
              />
            </div>
          </div>

          <div className="border-t border-gray-50" />

          {/* Section 2 — Health Info */}
          <div>
            <SectionHeading icon="🩺" title="Health Information" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Blood Group"
                options={["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"]}
                value={form.bloodGroup}
                onChange={set("bloodGroup")}
              />
              <Field label="Height (cm)" type="number" placeholder="175" value={form.height} onChange={set("height")} />
              <Field label="Weight (kg)" type="number" placeholder="70"  value={form.weight} onChange={set("weight")} />
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Known Allergies</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Penicillin, Peanuts, Dust (leave blank if none)"
                  value={form.allergies}
                  onChange={(e) => set("allergies")(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[hsl(182,100%,37%)] focus:ring-2 focus:ring-[hsl(182,100%,37%)]/20 transition-all duration-200 bg-white resize-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-50" />

          {/* Section 3 — Emergency Contact */}
          <div>
            <SectionHeading icon="🚨" title="Emergency Contact" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Contact Name"     placeholder="Amit Sharma"   value={form.emergencyName}     onChange={set("emergencyName")} />
              <Field label="Contact Phone"    type="tel" placeholder="+91 91234 56789" value={form.emergencyPhone} onChange={set("emergencyPhone")} />
              <SelectField
                label="Relationship"
                options={["Parent","Spouse","Sibling","Child","Friend","Other"]}
                value={form.emergencyRelation}
                onChange={set("emergencyRelation")}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-95"
            style={{
              background: "hsl(182,100%,37%)",
              boxShadow: "0 4px 20px -2px hsl(182,100%,37%,0.35)",
            }}
          >
            Save Profile & Continue →
          </button>

          <p className="text-center text-xs text-gray-400">
            You can update this information anytime from your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
