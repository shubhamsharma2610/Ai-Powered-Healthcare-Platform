import React from "react";

/* ─────────────────────────────────────────────────────────
   SVG ICON LIBRARY
───────────────────────────────────────────────────────── */
const Ico = {
  Appointments: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect x="3" y="4" width="18" height="18" rx="2.5" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  Prescriptions: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  ),
  Reports: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  ),
  HeartRate: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Stethoscope: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
      <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6 6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 100 .3" />
      <path d="M8 15v1a6 6 0 006 6h0a6 6 0 006-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" width="14" height="14">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────
   MOCK DATA  (replace with import from shared/data)
───────────────────────────────────────────────────────── */
const overviewCards = [
  {
    key: "appointments",
    Icon: Ico.Appointments,
    label: "Total Appointments",
    value: "24",
    sub: "+3 this month",
    /* Tailwind classes — resolved by your config */
    iconBg: "bg-primary",
    iconText: "text-white",
    trendBg: "bg-primary-light",
    trendText: "text-primary",
    hoverBorder: "hover:border-primary",
  },
  {
    key: "prescriptions",
    Icon: Ico.Prescriptions,
    label: "Active Prescriptions",
    value: "6",
    sub: "2 need renewal",
    iconBg: "bg-secondary",
    iconText: "text-white",
    trendBg: "bg-ternary",
    trendText: "text-secondary",
    hoverBorder: "hover:border-secondary",
  },
  {
    key: "reports",
    Icon: Ico.Reports,
    label: "Lab Reports",
    value: "12",
    sub: "1 new result",
    iconBg: "bg-accent",
    iconText: "text-white",
    trendBg: "bg-red-50",
    trendText: "text-accent",
    hoverBorder: "hover:border-accent",
  },
  {
    key: "health",
    Icon: Ico.HeartRate,
    label: "Health Score",
    value: "87",
    sub: "↑ 4pts last visit",
    iconBg: "bg-primary-dark",
    iconText: "text-white",
    trendBg: "bg-primary-light",
    trendText: "text-primary-dark",
    hoverBorder: "hover:border-primary-dark",
  },
];

const appointments = [
  {
    id: 1, status: "upcoming",
    doctor: "Dr. Priya Sharma", specialty: "Cardiologist",
    date: "Today", time: "2:30 PM",
    avatar: "PS", avatarBg: "bg-primary", type: "video",
  },
  {
    id: 2, status: "upcoming",
    doctor: "Dr. Arjun Mehta", specialty: "Neurologist",
    date: "Tomorrow", time: "10:00 AM",
    avatar: "AM", avatarBg: "bg-secondary", type: "in-person",
  },
  {
    id: 3, status: "upcoming",
    doctor: "Dr. Neha Kapoor", specialty: "Dermatologist",
    date: "May 10", time: "4:00 PM",
    avatar: "NK", avatarBg: "bg-accent", type: "video",
  },
];

const vitals = [
  { label: "Blood Pressure", value: "118/78", unit: "mmHg" },
  { label: "Blood Sugar",    value: "92",     unit: "mg/dL" },
  { label: "BMI",            value: "22.4",   unit: "kg/m²" },
  { label: "Cholesterol",    value: "198",    unit: "mg/dL" },
];

/* ─────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    upcoming:  { label: "Upcoming",  cls: "bg-primary-light text-primary",   dot: "bg-primary" },
    completed: { label: "Completed", cls: "bg-ternary text-secondary",        dot: "bg-secondary" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-accent",            dot: "bg-accent" },
  };
  const s = map[status] ?? map.upcoming;
  return (
    <span className={`flex items-center gap-1 px-2.5 py-[3px] rounded-full
                      text-[10px] font-bold tracking-wide whitespace-nowrap ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────── */
function StatCard({ card }) {
  const { Icon, label, value, sub,
          iconBg, iconText, trendBg, trendText, hoverBorder } = card;
  return (
    <div className={[
      "group relative bg-background-card rounded-medical shadow-soft",
      "border border-ternary p-md",
      "hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer",
      hoverBorder,
    ].join(" ")}>

      {/* Top row: icon + trend badge */}
      <div className="flex items-start justify-between mb-md">
        <div className={`w-11 h-11 rounded-medical flex items-center justify-center
                         shadow-soft transition-transform duration-200
                         group-hover:scale-105 ${iconBg} ${iconText}`}>
          <Icon />
        </div>
        <span className={`flex items-center gap-1 px-2 py-1 rounded-medical
                          text-[10px] font-bold ${trendBg} ${trendText}`}>
          <Ico.TrendUp />
          +12%
        </span>
      </div>

      {/* Value */}
      <div className="font-display text-3xl font-black text-gray-900 leading-none mb-xs">
        {value}
      </div>

      {/* Label */}
      <div className="text-sm text-gray-500 font-medium mb-xs">{label}</div>

      {/* Sub-note */}
      <div className={`text-xs font-semibold ${trendText}`}>{sub}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   APPOINTMENT ROW
───────────────────────────────────────────────────────── */
function AppointmentRow({ appt }) {
  const TypeIcon = appt.type === "video" ? Ico.Video : Ico.MapPin;
  const typeBadgeCls = appt.type === "video"
    ? "bg-primary text-white"
    : "bg-secondary text-white";

  return (
    <div className="group flex items-center gap-md p-sm rounded-medical
                    hover:bg-background-soft border border-transparent
                    hover:border-ternary transition-all duration-200 cursor-pointer">

      {/* Avatar with type badge */}
      <div className="relative shrink-0">
        <div className={`w-11 h-11 rounded-medical flex items-center justify-center
                         text-white text-xs font-black shadow-soft ${appt.avatarBg}`}>
          {appt.avatar}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full
                         border-2 border-background-card flex items-center justify-center
                         ${typeBadgeCls}`}>
          <TypeIcon />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-display text-sm font-bold text-gray-800 truncate mb-0.5">
          {appt.doctor}
        </div>
        <div className="flex items-center gap-lg flex-wrap">
          <span className="flex items-center gap-xs text-xs text-gray-400">
            <Ico.Stethoscope />{appt.specialty}
          </span>
          <span className="flex items-center gap-xs text-xs text-gray-400">
            <Ico.Clock />{appt.date} · {appt.time}
          </span>
        </div>
      </div>

      {/* Status + chevron */}
      <div className="flex items-center gap-sm shrink-0">
        <StatusBadge status={appt.status} />
        <span className="text-gray-300 group-hover:text-gray-400 transition-colors">
          <Ico.ChevronRight />
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function OverviewSection() {
  const upcoming = appointments.filter(a => a.status === "upcoming");

  return (
    <div className="font-sans">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-lg">
        <div>
          <h2 className="font-display text-2xl font-black text-gray-900 leading-tight">
            Good morning, <span className="text-primary">Rahul</span> 👋
          </h2>
          <p className="text-sm text-gray-400 font-medium mt-xs">
            Here's a summary of your health today.
          </p>
        </div>

        {/* Notification bell */}
        <button className="relative w-10 h-10 rounded-medical bg-background-card
                           border border-ternary shadow-soft flex items-center justify-center
                           text-gray-500 hover:text-gray-800 hover:shadow-md transition-all duration-200 shrink-0">
          <Ico.Bell />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2
                           border-background-card bg-accent" />
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-md mb-lg">
        {overviewCards.map(card => <StatCard key={card.key} card={card} />)}
      </div>

      {/* ── Vitals strip ── */}
      <div className="mb-lg rounded-medical p-md flex items-center gap-md
                      overflow-x-auto bg-primary-light border border-ternary shadow-soft">
        {vitals.map((v, i) => (
          <div key={i}
            className="flex items-center gap-sm shrink-0 px-md py-sm
                       rounded-medical bg-background-card border border-ternary shadow-soft">
            <div className="w-1.5 h-8 rounded-full bg-primary" />
            <div>
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                {v.label}
              </div>
              <div className="font-display text-base font-black text-gray-800">
                {v.value}{" "}
                <span className="text-xs text-gray-400 font-medium">{v.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Upcoming appointments panel ── */}
      <div className="bg-background-card rounded-medical border border-ternary shadow-soft overflow-hidden">

        {/* Panel header */}
        <div className="flex items-center justify-between px-md py-sm border-b border-ternary">
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-medical bg-primary text-white
                            flex items-center justify-center shadow-soft">
              <Ico.Appointments />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-gray-800 leading-none">
                Upcoming Appointments
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {upcoming.length} scheduled
              </p>
            </div>
          </div>

          <div className="flex items-center gap-sm">
            <button className="flex items-center gap-xs px-sm py-xs rounded-medical
                               text-[11px] font-bold text-gray-500
                               border border-ternary hover:bg-background-soft transition-colors">
              <Ico.Filter />Filter
            </button>
            <button className="text-xs font-bold text-primary hover:underline px-xs">
              View all
            </button>
          </div>
        </div>

        {/* Appointment list */}
        <div className="divide-y divide-ternary px-sm py-xs">
          {upcoming.length === 0
            ? <p className="py-xl text-center text-sm text-gray-400">No upcoming appointments</p>
            : upcoming.map(a => <AppointmentRow key={a.id} appt={a} />)
          }
        </div>

        {/* Footer CTA */}
        <div className="px-md py-sm border-t border-ternary">
          <button className="w-full flex items-center justify-center gap-xs
                             py-[10px] rounded-medical text-sm font-bold
                             text-primary bg-primary-light hover:bg-ternary
                             transition-colors duration-200">
            <Ico.Plus />
            Schedule New Appointment
          </button>
        </div>
      </div>

    </div>
  );
}