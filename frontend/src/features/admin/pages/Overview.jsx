import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

export default function Overview() {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all doctors
      const doctorsRes = await axios.get(`${API_URL}/admin/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      // Fetch pending doctors
      const pendingRes = await axios.get(`${API_URL}/admin/pending-doctors`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      // Fetch all patients
      const patientsRes = await axios.get(`${API_URL}/admin/patients`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      const allDoctors = doctorsRes.data?.data || [];
      const pendingDoctors = pendingRes.data?.data || [];
      const approvedDoctors = allDoctors.filter(d => d.isApproved === true);
      const allPatients = patientsRes.data?.data || [];
      
      setStats({
        totalPatients: allPatients.length,
        totalDoctors: allDoctors.length,
        activeDoctors: approvedDoctors.length,
        totalAppointments: 0, // TODO: Add appointments API
        completedAppointments: 0,
        pendingAppointments: 0,
        pendingRequests: pendingDoctors.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Patients", value: stats.totalPatients, icon: "👥", color: "bg-purple-50", textColor: "text-purple-600", change: "Registered users" },
    { title: "Total Doctors", value: stats.totalDoctors, icon: "👨‍⚕️", color: "bg-blue-50", textColor: "text-blue-600", change: `${stats.activeDoctors} approved` },
    { title: "Total Appointments", value: stats.totalAppointments, icon: "📅", color: "bg-green-50", textColor: "text-green-600", change: "All time" },
    { title: "Pending Requests", value: stats.pendingRequests, icon: "⏳", color: "bg-orange-50", textColor: "text-orange-600", change: "Awaiting approval" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Overview</h1>
      <p className="text-gray-500 text-sm mb-6">Welcome back, Admin</p>

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

      {/* Pending Requests Alert */}
      {stats.pendingRequests > 0 && (
        <div className="bg-orange-50 rounded-lg p-4 mb-8 border border-orange-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-orange-600">⏳</span>
              <span className="text-sm text-orange-700">
                You have {stats.pendingRequests} pending doctor {stats.pendingRequests === 1 ? 'request' : 'requests'}
              </span>
            </div>
            <button 
              onClick={() => navigate('/admin/requests')}
              className="text-sm text-orange-700 hover:underline font-medium"
            >
              Review Now →
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/admin/doctors')}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark"
          >
            View All Doctors
          </button>
          <button 
            onClick={() => navigate('/admin/requests')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Review Pending Requests
          </button>
        </div>
      </div>
    </div>
  );
}