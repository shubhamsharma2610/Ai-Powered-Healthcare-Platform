import React, { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────
   SIMPLE CLEAN ICONS (No external dependencies)
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
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
  Location: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  TrendingUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────── */
const mockData = {
  upcomingAppointments: [
    { id: 1, doctor: "Dr. Priya Sharma", specialty: "Cardiologist", date: "Today", time: "2:30 PM", type: "video", location: "Online" },
    { id: 2, doctor: "Dr. Arjun Mehta", specialty: "Neurologist", date: "Tomorrow", time: "10:00 AM", type: "in-person", location: "Clinic, Room 204" },
    { id: 3, doctor: "Dr. Sneha Reddy", specialty: "Dermatologist", date: "May 15", time: "11:30 AM", type: "video", location: "Online" },
  ],
  recentReports: [
    { id: 1, name: "Complete Blood Count", date: "Mar 15, 2024", status: "Normal", doctor: "Dr. Priya Sharma" },
    { id: 2, name: "Lipid Profile", date: "Feb 28, 2024", status: "Borderline", doctor: "Dr. Arjun Mehta" },
    { id: 3, name: "Thyroid Test", date: "Feb 10, 2024", status: "Normal", doctor: "Dr. Sneha Reddy" },
  ],
  activeMedications: [
    { id: 1, name: "Metformin", dosage: "500mg", timing: "Morning & Night", frequency: "Daily", duration: "30 days left" },
    { id: 2, name: "Lisinopril", dosage: "10mg", timing: "Morning", frequency: "Daily", duration: "15 days left" },
  ],
  lastVitals: {
    bp: "118/78",
    sugar: "92",
    heartRate: "72",
    weight: "72",
    takenOn: "May 8, 2024"
  },
  healthScore: 86,
  totalAppointments: 12,
  totalReports: 8,
};

/* ─────────────────────────────────────────────────────────
   LOADING SKELETON
───────────────────────────────────────────────────────── */
const LoadingSkeleton = () => (
  <div className="h-full overflow-y-auto bg-gray-50">
    <div className="p-6 md:p-8">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-5">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        
        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-5">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              {[1,2].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded mb-3"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
              {[1,2,3].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded mb-3"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   STAT CARD COMPONENT
───────────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <Icons.TrendingUp />
              <p className="text-xs text-green-600">{trend}</p>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN OVERVIEW COMPONENT
───────────────────────────────────────────────────────── */
export default function OverviewSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real app: const response = await axios.get('/api/overview');
        setData(mockData);
        setError(null);
      } catch (err) {
        setError("Failed to load overview data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
      <div className="p-6 md:p-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hello, Rahul 👋
              </h1>
              <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                <Icons.Calendar />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center gap-2">
                📅 Schedule
              </button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm">
                + Upload Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Health Score" 
            value={data.healthScore} 
            icon={Icons.Heart}
            color="blue"
            trend="+5 vs last month"
          />
          <StatCard 
            title="Total Appointments" 
 value={data.totalAppointments} 
            icon={Icons.Calendar}
            color="purple"
            trend="2 upcoming"
          />
          <StatCard 
            title="Medical Reports" 
            value={data.totalReports} 
            icon={Icons.Document}
            color="green"
            trend="+3 this year"
          />
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN - Appointments & Reports */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upcoming Appointments Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icons.Calendar />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                    <p className="text-xs text-gray-500">{data.upcomingAppointments.length} appointments scheduled</p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                  View All →
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {data.upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{apt.doctor}</div>
                        <div className="text-sm text-gray-500 mb-2">{apt.specialty}</div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Icons.Calendar /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.Clock /> {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icons.Location /> {apt.location}
                          </span>
                          {apt.type === 'video' && (
                            <span className="flex items-center gap-1 text-blue-600">
                              <Icons.Video /> Video Call
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm ml-4">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Icons.Document />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Recent Medical Reports</h3>
                    <p className="text-xs text-gray-500">Last 3 reports</p>
                  </div>
                </div>
                <button className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors">
                  View All →
                </button>
              </div>
              
              <div className="divide-y divide-gray-100">
                {data.recentReports.map((report) => (
                  <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                          📄
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{report.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{report.date} • {report.doctor}</div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Normal' ? 'bg-green-100 text-green-700' :
                        report.status === 'Borderline' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Vitals & Medications */}
          <div className="space-y-6">
            
            {/* Vitals Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Icons.Heart />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Latest Vitals</h3>
                  <p className="text-xs text-gray-500">Updated {data.lastVitals.takenOn}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Blood Pressure</span>
                  <span className="font-semibold text-gray-900">{data.lastVitals.bp} <span className="text-xs text-gray-400">mmHg</span></span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Blood Sugar</span>
                  <span className="font-semibold text-gray-900">{data.lastVitals.sugar} <span className="text-xs text-gray-400">mg/dL</span></span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">Heart Rate</span>
                  <span className="font-semibold text-gray-900">{data.lastVitals.heartRate} <span className="text-xs text-gray-400">bpm</span></span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Weight</span>
                  <span className="font-semibold text-gray-900">{data.lastVitals.weight} <span className="text-xs text-gray-400">kg</span></span>
                </div>
              </div>
              
              <button className="w-full mt-5 py-2.5 text-sm bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Update All Vitals →
              </button>
            </div>

            {/* Active Medications Card */}
            {data.activeMedications.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Icons.Pill />
                  </div>
                  <h3 className="font-semibold text-gray-900">Active Medications</h3>
                </div>
                
                {data.activeMedications.map((med) => (
                  <div key={med.id} className="mb-4 last:mb-0 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-gray-900">{med.name}</div>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        {med.duration}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{med.dosage} • {med.frequency}</div>
                    <div className="text-xs text-gray-400 mt-1">💊 Take: {med.timing}</div>
                  </div>
                ))}
                
                <button className="w-full mt-3 py-2 text-sm text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors">
                  + Add Reminder
                </button>
              </div>
            )}

            {/* Health Tip Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
              <div className="text-3xl mb-2">💡</div>
              <h4 className="font-semibold text-white">Health Tip of the Day</h4>
              <p className="text-sm text-blue-100 mt-2">
                Taking a 10-minute walk after meals can help improve digestion and regulate blood sugar levels.
              </p>
              <div className="mt-4 pt-3 border-t border-blue-400/30">
                <p className="text-xs text-blue-200">✨ Personalized for your health goals</p>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-lg">🚨</span>
                <span className="text-sm font-medium">Emergency Contact</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">John Doe • +91 98765 43210</p>
              <p className="text-xs text-gray-400 mt-1">Emergency Services: 102</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}