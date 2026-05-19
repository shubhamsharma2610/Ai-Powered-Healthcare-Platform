
import React from "react"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    activeDoctors: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    setStats({
      totalPatients: 1250,
      totalDoctors: 24,
      activeDoctors: 19,
      totalAppointments: 284,
      completedAppointments: 245,
      pendingAppointments: 39,
      pendingRequests: 5,
    });
  }, []);

  const cards = [
    { title: "Total Patients", value: stats.totalPatients, icon: "👥", color: "bg-purple-50", textColor: "text-purple-600", change: "+12% this month" },
    { title: "Total Doctors", value: stats.totalDoctors, icon: "👨‍⚕️", color: "bg-blue-50", textColor: "text-blue-600", change: `${stats.activeDoctors} active` },
    { title: "Total Appointments", value: stats.totalAppointments, icon: "📅", color: "bg-green-50", textColor: "text-green-600", change: `${stats.completedAppointments} completed` },
    { title: "Pending Requests", value: stats.pendingRequests, icon: "⏳", color: "bg-orange-50", textColor: "text-orange-600", change: "Awaiting approval" },
  ];

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Overview</h1>
      <p className="text-gray-500 text-sm mb-6">Welcome back, Admin</p>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl sm:text-3xl">{card.icon}</span>
              <span className={`text-xl sm:text-2xl font-bold ${card.textColor}`}>{card.value}</span>
            </div>
            <h3 className="text-sm sm:text-base text-gray-600 font-medium">{card.title}</h3>
            <p className="text-xs text-gray-400 mt-2">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Responsive 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Appointment Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">📊 Appointment Breakdown</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium text-gray-800">{stats.completedAppointments}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${(stats.completedAppointments / stats.totalAppointments) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Pending</span>
                <span className="font-medium text-gray-800">{stats.pendingAppointments}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(stats.pendingAppointments / stats.totalAppointments) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">📈 Quick Stats</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-1">👨‍⚕️</div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{stats.activeDoctors}</div>
              <div className="text-xs text-gray-500">Active Doctors</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-1">👥</div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{stats.totalPatients}</div>
              <div className="text-xs text-gray-500">Total Patients</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-1">✅</div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{stats.completedAppointments}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-1">⏳</div>
              <div className="text-lg sm:text-xl font-bold text-gray-800">{stats.pendingRequests}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Responsive */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">📋 Recent Activity</h2>
        <div className="space-y-3">
          {[
            { text: "New patient registered", time: "5 min ago", color: "bg-green-500" },
            { text: "Dr. Sharma joined platform", time: "1 hour ago", color: "bg-blue-500" },
            { text: "New appointment scheduled", time: "3 hours ago", color: "bg-orange-500" },
          ].map((activity, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${activity.color}`}></span>
                <span className="text-gray-600">{activity.text}</span>
              </div>
              <span className="text-xs text-gray-400 sm:ml-auto">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}