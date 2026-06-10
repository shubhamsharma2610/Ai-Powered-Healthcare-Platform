import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, DollarSign, User, Activity, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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

  const now = new Date();
  
  // ✅ Calculate appointment stats based on real-time status
  const getAppointmentStats = () => {
    let upcoming = 0;  // Only CONFIRMED future appointments
    let live = 0;
    let completed = 0;
    let cancelled = 0;
    let missed = 0;
    let pending = 0;   // Payment pending appointments
    
    appointments?.forEach(apt => {
      const appointmentTime = new Date(apt.date);
      const timeDiffMinutes = (now - appointmentTime) / (1000 * 60);
      
      if (apt.status === 'cancelled') {
        cancelled++;
      } else if (apt.status === 'completed') {
        completed++;
      } else if (apt.status === 'no-show') {
        missed++;
      } else if (apt.status === 'pending') {
        pending++;
      } else if (apt.status === 'confirmed') {
        // Live: 30 minutes before to 30 minutes after
        if (timeDiffMinutes >= -30 && timeDiffMinutes <= 30) {
          live++;
        }
        // ✅ Upcoming: ONLY confirmed and more than 30 minutes in future
        else if (timeDiffMinutes < -30) {
          upcoming++;
        }
        // Missed: more than 30 minutes past
        else if (timeDiffMinutes > 30) {
          missed++;
        }
      }
    });
    
    return { upcoming, live, completed, cancelled, missed, pending, total: appointments?.length || 0 };
  };
  
  const stats = getAppointmentStats();
  
  // ✅ Total spent from successful transactions only
  const totalSpent = summary?.totalSpent || 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getHealthStatus = () => {
    const recentCompleted = appointments?.filter(apt => apt.status === 'completed').length || 0;
    const hasUpcoming = stats.upcoming > 0 || stats.live > 0;
    
    if (hasUpcoming) return { status: 'Active Care', color: 'text-blue-600', bg: 'bg-blue-50', icon: Activity };
    if (recentCompleted > 0) return { status: 'Regular Checkups', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
    return { status: 'Due for Checkup', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle };
  };
  
  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.fullName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-500 text-sm mt-1">Here's your health summary at a glance</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${healthStatus.bg} w-fit`}>
          <HealthIcon size={16} className={healthStatus.color} />
          <span className={`text-sm font-medium ${healthStatus.color}`}>{healthStatus.status}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Upcoming Appointments - ONLY confirmed future appointments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
            {stats.live > 0 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 animate-pulse">
                Live Now
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{stats.upcoming + stats.live}</p>
            <p className="text-sm text-gray-500">
              {stats.live > 0 ? `${stats.live} Live, ${stats.upcoming} Upcoming` : 'Upcoming Appointments'}
            </p>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <DollarSign size={20} className="text-green-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Spent</p>
          </div>
        </div>

        {/* Age */}
        <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{profile?.age || '—'}</p>
            <p className="text-sm text-gray-500 capitalize">Age • {profile?.gender || 'Not set'}</p>
          </div>
        </div>

        {/* Total Visits */}
        <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Activity size={20} className="text-purple-600" />
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-500">
              {stats.completed} Completed • {stats.cancelled} Cancelled
            </p>
          </div>
        </div>
      </div>

      {/* Pending Payment Alert */}
      {stats.pending > 0 && (
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-xl">⏳</span>
            <div>
              <p className="text-sm font-medium text-yellow-800">Payment Pending</p>
              <p className="text-xs text-yellow-600">
                You have {stats.pending} appointment{stats.pending > 1 ? 's' : ''} pending payment. 
                Complete payment to confirm your appointment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Appointment Alert */}
      {stats.live > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20 animate-pulse">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">You have {stats.live} live appointment{stats.live > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-500">Click "Join Now" in Appointments section to start consultation</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            Appointment Breakdown
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 flex items-center gap-1"><CheckCircle size={14} className="text-green-500" /> Completed</span>
                <span className="font-medium text-gray-800">{stats.completed}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: stats.total ? (stats.completed / stats.total) * 100 : 0 }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 flex items-center gap-1"><Clock size={14} className="text-primary" /> Upcoming + Live</span>
                <span className="font-medium text-gray-800">{stats.upcoming + stats.live}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: stats.total ? ((stats.upcoming + stats.live) / stats.total) * 100 : 0 }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 flex items-center gap-1"><XCircle size={14} className="text-red-500" /> Cancelled + Missed + No-Show</span>
                <span className="font-medium text-gray-800">{stats.cancelled + stats.missed}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: stats.total ? ((stats.cancelled + stats.missed) / stats.total) * 100 : 0 }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <User size={18} className="text-primary" />
            Quick Health Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400">Blood Group</p>
              <p className="font-semibold text-gray-800 mt-1">{profile?.bloodType || 'Not recorded'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last Visit</p>
              <p className="font-semibold text-gray-800 mt-1">
                {profile?.lastConsultationDate 
                  ? new Date(profile.lastConsultationDate).toLocaleDateString() 
                  : 'No visits yet'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Pending Payment</p>
              <p className="font-semibold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Completed Visits</p>
              <p className="font-semibold text-green-600 mt-1">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Recent Appointments</h3>
          <span className="text-xs text-gray-400">Last {Math.min(3, appointments?.length || 0)} records</span>
        </div>
        {appointments?.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No appointments yet</p>
            <button className="mt-2 text-sm text-primary hover:underline">Book your first appointment →</button>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments?.slice(0, 3).map((apt) => {
              const appointmentTime = new Date(apt.date);
              const timeDiffMinutes = (now - appointmentTime) / (1000 * 60);
              let statusDisplay = apt.status;
              let statusColor = 'bg-gray-100 text-gray-600';
              
              if (apt.status === 'confirmed') {
                if (timeDiffMinutes >= -30 && timeDiffMinutes <= 30) {
                  statusDisplay = 'Live';
                  statusColor = 'bg-green-100 text-green-700 animate-pulse';
                } else if (timeDiffMinutes < -30) {
                  statusDisplay = 'Upcoming';
                  statusColor = 'bg-blue-100 text-blue-700';
                } else if (timeDiffMinutes > 30) {
                  statusDisplay = 'Missed';
                  statusColor = 'bg-gray-100 text-gray-500';
                }
              } else if (apt.status === 'completed') {
                statusColor = 'bg-green-100 text-green-700';
              } else if (apt.status === 'cancelled') {
                statusColor = 'bg-red-100 text-red-700';
              } else if (apt.status === 'pending') {
                statusDisplay = 'Payment Pending';
                statusColor = 'bg-yellow-100 text-yellow-700';
              } else if (apt.status === 'no-show') {
                statusDisplay = 'No-Show';
                statusColor = 'bg-gray-100 text-gray-500';
              }
              
              return (
                <div key={apt._id} className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium text-gray-800">{apt.doctorId?.fullName}</p>
                    <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor} capitalize`}>
                    {statusDisplay}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Missed Appointments Warning */}
      {stats.missed > 0 && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Missed Appointments</p>
              <p className="text-xs text-amber-600">
                You have {stats.missed} missed appointment{stats.missed > 1 ? 's' : ''}. Please reschedule to avoid charges.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}