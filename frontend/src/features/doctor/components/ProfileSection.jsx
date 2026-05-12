import React from "react";

export default function ProfileSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
      <p className="text-sm text-gray-600">Manage your profile and clinic availability.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">Dr. Name: Dr. Rahul Sharma</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">Specialty: Cardiology</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">Clinic hours: 09:00 AM - 05:00 PM</div>
      </div>
    </section>
  );
}
