import React from "react";

export default function OverviewSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
      <p className="text-sm text-gray-600">A quick summary of your clinic performance and patient activity.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">Total patients</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">Upcoming appointments</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">Today's schedule</div>
      </div>
    </section>
  );
}
