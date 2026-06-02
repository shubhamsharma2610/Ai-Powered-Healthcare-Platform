import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, DollarSign, User, Activity } from 'lucide-react';
import { fetchPatientProfile, fetchPatientAppointments, fetchTransactionHistory } from '../../../redux/slices/patientSlice';

export default function OverviewSection() {
  const dispatch = useDispatch();
  const { profile, appointments, summary, loading } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPatientProfile());
    dispatch(fetchPatientAppointments());
    dispatch(fetchTransactionHistory());
  }, [dispatch]);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div></div>;
  }

  // Only appointments that are pending or confirmed should count as upcoming
  const upcomingAppointments = appointments?.filter(apt => apt.status === 'pending' || apt.status === 'confirmed') || [];
  const totalSpent = summary?.totalSpent || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your health</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              <p className="text-sm text-gray-500">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{totalSpent}</p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{profile?.age || '—'}</p>
              <p className="text-sm text-gray-500">Age</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Activity size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{appointments?.length || 0}</p>
              <p className="text-sm text-gray-500">Total Visits</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <h3 className="font-semibold text-gray-800 mb-3">Recent Appointments</h3>
        {appointments?.length === 0 ? (
          <p className="text-gray-500 text-sm">No appointments yet</p>
        ) : (
          <div className="space-y-3">
            {appointments?.slice(0, 3).map((apt) => (
              <div key={apt._id} className="flex justify-between items-center pb-2 border-b">
                <div>
                  <p className="font-medium">{apt.doctorId?.fullName}</p>
                  <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 capitalize">{apt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}