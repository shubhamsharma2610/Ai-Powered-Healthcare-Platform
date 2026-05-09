import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────
   SIMPLE ICONS
───────────────────────────────────────────────────────── */
const Icons = {
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Pill: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
      <path d="M4.5 9.5L14.5 19.5M19.5 14.5L9.5 4.5" />
      <circle cx="12" cy="12" r="7.5" />
    </svg>
  ),
  Document: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Video: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────
   MOCK DATA (Baad mein API se aayega)
───────────────────────────────────────────────────────── */
const mockData = {
  upcomingAppointments: [
    { id: 1, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "Today", time: "2:30 PM", type: "video" },
    { id: 2, doctor: "Dr. Arjun Mehta", specialty: "Neurologist", date: "Tomorrow", time: "10:00 AM", type: "in-person" },
  ],
  recentReports: [
    { id: 1, name: "Blood Test", date: "Mar 15, 2024", status: "Normal" },
    { id: 2, name: "Lipid Profile", date: "Feb 28, 2024", status: "Borderline" },
  ],
  activeMedications: [
    { id: 1, name: "Metformin", dosage: "500mg", timing: "Morning & Night" },
  ],
  lastVitals: {
    bp: "118/78",
    sugar: "92",
    takenOn: "May 8, 2024"
  }
};

/* ─────────────────────────────────────────────────────────
   MAIN SIMPLE OVERVIEW
───────────────────────────────────────────────────────── */
export default function OverviewSection() {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(false);

  // Baad mein API call karenge
  useEffect(() => {
    // Fetch data from backend
    // const fetchData = async () => {
    //   const response = await api.get('/overview');
    //   setData(response.data);
    // };
    // fetchData();
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6">
        
        {/* Header - Simple */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Hello, Rahul 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Appointments + Reports - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Appointments Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icons.Calendar />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                    <p className="text-xs text-gray-500">{data.upcomingAppointments.length} scheduled</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                  + New
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {data.upcomingAppointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No upcoming appointments
                  </div>
                ) : (
                  data.upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{apt.doctor}</div>
                          <div className="text-sm text-gray-500">{apt.specialty}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Icons.Calendar /> {apt.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icons.Clock /> {apt.time}
                            </span>
                            {apt.type === 'video' && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <Icons.Video /> Video Call
                              </span>
                            )}
                          </div>
                        </div>
                        <button className="px-3 py-1.5 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                          Join
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Reports Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Icons.Document />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Recent Reports</h3>
                    <p className="text-xs text-gray-500">Last 2 reports</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                  View All
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {data.recentReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{report.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{report.date}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Normal' ? 'bg-green-50 text-green-600' :
                        report.status === 'Borderline' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Quick Info - 1/3 width */}
          <div className="space-y-6">
            
            {/* Quick Vitals Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Icons.Heart />
                </div>
                <h3 className="font-semibold text-gray-900">Latest Vitals</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Blood Pressure</span>
                  <span className="font-semibold text-gray-900">{data.lastVitals.bp}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Blood Sugar</span>
                  <span className="font-semibold text-gray-900">{data.lastVitals.sugar} mg/dL</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Last checked: {data.lastVitals.takenOn}
                </div>
              </div>
              
              <button className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                Update Vitals →
              </button>
            </div>

            {/* Active Medications Card */}
            {data.activeMedications.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icons.Pill />
                  </div>
                  <h3 className="font-semibold text-gray-900">Current Meds</h3>
                </div>
                
                {data.activeMedications.map((med) => (
                  <div key={med.id} className="mb-3">
                    <div className="font-medium text-gray-900">{med.name}</div>
                    <div className="text-sm text-gray-500">{med.dosage}</div>
                    <div className="text-xs text-gray-400 mt-1">Take: {med.timing}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tip Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
              <div className="text-2xl mb-2">💡</div>
              <h4 className="font-semibold text-gray-800 text-sm">Health Tip</h4>
              <p className="text-sm text-gray-600 mt-1">
                Remember to drink 8 glasses of water today. Stay hydrated!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}