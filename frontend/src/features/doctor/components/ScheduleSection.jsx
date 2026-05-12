import React from "react";

export default function ScheduleSection() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Schedule</h2>
      <p className="text-sm text-gray-600">Your daily timeline and consultation blocks.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">Morning rounds</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">Clinic slot</div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">Telehealth hours</div>
      </div>
    </section>
  );
}
