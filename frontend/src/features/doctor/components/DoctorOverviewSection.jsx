import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Users, Clock, DollarSign, Activity } from 'lucide-react';
import { getDoctorStats } from '../services/doctorApi';

export default function DoctorOverviewSection() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    totalPatients: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getDoctorStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
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
          Welcome back, Dr. {user?.fullName?.split(' ')[1] || 'Doctor'}! 👋
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
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

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          Overview
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-xl font-bold text-gray-900">{stats.totalAppointments}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-xl font-bold text-green-600">{stats.completedAppointments}</p>
          </div>
        </div>
      </div>
    </div>
  );
}