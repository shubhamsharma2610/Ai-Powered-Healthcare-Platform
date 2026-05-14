import React, { useState, useEffect } from "react";
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Activity,
  ArrowRight
} from "lucide-react";

export default function OverviewSection() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingAppointments: 0,
    todayAppointments: 0,
    monthlyIncome: 0
  });

  // Simulate data fetch (replace with actual API call)
  useEffect(() => {
    // Demo data - replace with your actual API call
    const fetchData = () => {
      setStats({
        totalPatients: 284,
        upcomingAppointments: 12,
        todayAppointments: 8,
        monthlyIncome: 24500
      });
    };
    fetchData();
  }, []);

  // Stats cards data
  const statsCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "primary",
      bgColor: "bg-primary-light/20",
      iconColor: "text-primary",
      trend: "+12 this month"
    },
    {
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      trend: "Next 7 days"
    },
    {
      title: "Today's Schedule",
      value: stats.todayAppointments,
      icon: Clock,
      color: "orange",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-500",
      trend: `${stats.todayAppointments} appointments left`
    },
    {
      title: "Monthly Income",
      value: `₹${stats.monthlyIncome.toLocaleString()}`,
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      trend: "+18% vs last month"
    }
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 font-display">Overview</h2>
        <p className="text-sm text-gray-500 mt-1">
          A quick summary of your clinic performance and patient activity
        </p>
      </div>

      {/* Stats Grid - 2x2 on mobile, 4x1 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-medical p-5 shadow-soft hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-50"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              {/* Icon */}
              <div className={`w-10 h-10 ${card.bgColor} rounded-medical flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              
              {/* Value */}
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              
              {/* Title */}
              <div className="text-sm text-gray-600 mt-1">
                {card.title}
              </div>
              
              {/* Trend */}
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <TrendingUp className="w-3 h-3" />
                <span>{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Patients */}
        <div className="bg-white rounded-medical p-5 shadow-soft border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-gray-900">Recent Patients</h3>
            </div>
            <button className="text-xs text-primary hover:text-primary-dark flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: "Mr. Singh", time: "Today, 11:00 AM", condition: "Follow-up" },
              { name: "Ms. Verma", time: "Today, 12:30 PM", condition: "Initial Consultation" },
              { name: "Ms. Patel", time: "Today, 3:00 PM", condition: "Test Results" },
            ].map((patient, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                  <p className="text-xs text-gray-500">{patient.time}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-primary-light/20 text-primary-dark rounded-medical">
                  {patient.condition}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule Summary */}
        <div className="bg-white rounded-medical p-5 shadow-soft border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
            </div>
            <span className="text-xs px-2 py-1 bg-primary text-white rounded-medical">
              {stats.todayAppointments} appointments
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">3</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Ongoing</span>
              </div>
              <span className="text-sm font-medium text-gray-900">1</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Upcoming</span>
              </div>
              <span className="text-sm font-medium text-gray-900">4</span>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Next appointment</span>
                <span className="font-medium text-gray-900">11:00 AM - Mr. Singh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}