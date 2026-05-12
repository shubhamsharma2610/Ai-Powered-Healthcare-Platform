import React from "react";

export default function PatientsSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Patients</h2>
      <p className="text-sm text-gray-600">List of active patients and recent consultations.</p>
      <ul className="space-y-2">
        <li className="rounded-2xl bg-white p-4 shadow-sm">Anita Joshi — Follow-up in 2 days</li>
        <li className="rounded-2xl bg-white p-4 shadow-sm">Rajesh Kumar — Lab report review</li>
        <li className="rounded-2xl bg-white p-4 shadow-sm">Nisha Mehta — Treatment plan update</li>
      </ul>
    </section>
  );
}
