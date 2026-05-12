import React from "react";

export default function AppointmentsSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Appointments</h2>
      <p className="text-sm text-gray-600">View and manage your next consultations.</p>
      <div className="space-y-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">11:00 AM - Mr. Singh</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">12:30 PM - Ms. Verma</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">03:00 PM - Ms. Patel</div>
      </div>
    </section>
  );
}
