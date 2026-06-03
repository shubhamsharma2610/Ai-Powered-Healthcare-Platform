import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Users, Clock, DollarSign, Activity, Video, AlertCircle } from 'lucide-react';
import { getDoctorStats } from '../services/doctorApi';
import { getDoctorAppointments } from '../services/doctorApi';

export default function DoctorOverviewSection() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    totalPatients: 0,
    totalEarnings: 0,
    liveAppointments: 0,
    missedAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchLiveAndMissedCount();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDoctorStats();
      setStats(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLiveAndMissedCount = async () => {
    try {
      const response = await getDoctorAppointments({ status: 'confirmed' });
      const appointments = response.data || [];
      const now = new Date();
      
      let live = 0;
      let missed = 0;
      
      appointments.forEach(apt => {
        const appointmentTime = new Date(apt.date);
        const timeDiffMinutes = (now - appointmentTime) / (1000 * 60);
        
        // Live: 30 minutes before to 30 minutes after
        if (timeDiffMinutes >= -30 && timeDiffMinutes <= 30) {
          live++;
        }
        // Missed: more than 30 minutes past
        else if (timeDiffMinutes > 30) {
          missed++;
        }
      });
      
      setStats(prev => ({ ...prev, liveAppointments: live, missedAppointments: missed }));
    } catch (error) {
      console.error('Error fetching live/missed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const cards = [
    { title: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
    { title: "Total Patients", value: stats.totalPatients, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Upcoming", value: stats.upcomingAppointments, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Total Earnings", value: `₹${stats.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
  ];

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {getGreeting()}, Dr. {user?.fullName?.split(' ')[1] || user?.fullName?.split(' ')[0] || 'Doctor'}! 👋
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Live & Missed Alerts */}
      {stats.liveAppointments > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-primary/5 rounded-xl p-4 border border-green-200 animate-pulse">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Video size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">You have {stats.liveAppointments} live appointment{stats.liveAppointments > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-500">Click "Join Now" in Appointments section to start consultation</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {stats.missedAppointments > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Missed Appointments</p>
              <p className="text-xs text-amber-600">
                You have {stats.missedAppointments} missed appointment{stats.missedAppointments > 1 ? 's' : ''}. Patients may have waited.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center`}>
                  <Icon size={20} className={card.color} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Live Appointments Card (if any) */}
      {stats.liveAppointments > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Video size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Live Consultations</p>
                <p className="text-xs text-gray-500">{stats.liveAppointments} patient{stats.liveAppointments > 1 ? 's are' : ' is'} waiting</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = '/doctor/appointments?filter=live'}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-all"
            >
              Go to Live
            </button>
          </div>
        </div>
      )}

      {/* Overview Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalAppointments}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-bold text-green-600">{stats.completedAppointments}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Live Now</p>
            <p className="text-xl font-bold text-primary">{stats.liveAppointments}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Missed</p>
            <p className="text-xl font-bold text-amber-600">{stats.missedAppointments}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Progress */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3">Appointment Completion Rate</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-medium">
              {stats.totalAppointments > 0 
                ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) 
                : 0}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ 
                width: stats.totalAppointments > 0 
                  ? `${(stats.completedAppointments / stats.totalAppointments) * 100}%` 
                  : '0%' 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}