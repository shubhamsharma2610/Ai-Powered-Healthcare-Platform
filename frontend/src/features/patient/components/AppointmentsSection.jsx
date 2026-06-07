import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPatientAppointments, fetchPatientProfile } from "../../../redux/slices/patientSlice";
import { cancelUserAppointment } from "../../../redux/slices/appointmentSlice";
import { Icon, icons } from "./shared/Icon";
import { toast } from "react-hot-toast";
import VideoCall from "../../../components/VideoCall";

const filters = ["all", "pending", "upcoming", "live", "completed", "cancelled", "missed", "no-show"];

export default function AppointmentsSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments, loading } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.auth);
  
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchPatientAppointments());
  }, [dispatch]);

  // ✅ Get appointment state with full logic (including no-show)
  const getAppointmentState = (appointment) => {
    const now = new Date();
    const appointmentTime = new Date(appointment.date);
    const timeDiffMinutes = (now - appointmentTime) / (1000 * 60);
    
    // Cancelled
    if (appointment.status === 'cancelled') {
      return { 
        state: 'cancelled', 
        label: 'Cancelled', 
        color: 'bg-red-100 text-red-700', 
        icon: '❌', 
        canJoin: false, 
        canCancel: false,
        canRetry: false,
        badge: 'Cancelled',
        refundAmount: appointment.refundAmount || 0,
        refundPercentage: appointment.refundPercentage || 0,
        refundId: appointment.refundId || null
      };
    }
    
    // Completed
    if (appointment.status === 'completed') {
      return { 
        state: 'completed', 
        label: 'Completed', 
        color: 'bg-green-100 text-green-700', 
        icon: '✅', 
        canJoin: false, 
        canCancel: false,
        canRetry: false,
        badge: 'Completed',
        refundAmount: 0
      };
    }
    
    // No-Show
    if (appointment.status === 'no-show') {
      return { 
        state: 'no-show', 
        label: 'No-Show', 
        color: 'bg-gray-100 text-gray-500', 
        icon: '🚫', 
        canJoin: false, 
        canCancel: false,
        canRetry: false,
        badge: 'No-Show',
        refundAmount: 0
      };
    }
    
    // Pending - Payment not completed
    if (appointment.status === 'pending') {
      return { 
        state: 'pending', 
        label: 'Payment Pending', 
        color: 'bg-yellow-100 text-yellow-700', 
        icon: '⏳', 
        canJoin: false, 
        canCancel: true,
        canRetry: true,
        badge: 'Pending',
        refundAmount: 0
      };
    }
    
    // Confirmed appointments
    if (appointment.status === 'confirmed') {
      // Live: 30 minutes before to 30 minutes after
      if (timeDiffMinutes >= -30 && timeDiffMinutes <= 30) {
        return { 
          state: 'live', 
          label: 'Live Now', 
          color: 'bg-green-100 text-green-700 animate-pulse', 
          icon: '🔴', 
          canJoin: true, 
          canCancel: false,
          canRetry: false,
          badge: 'Live Now',
          refundAmount: 0
        };
      }
      // Upcoming: more than 30 minutes in future
      if (timeDiffMinutes < -30) {
        return { 
          state: 'upcoming', 
          label: 'Upcoming', 
          color: 'bg-blue-100 text-blue-700', 
          icon: '⏰', 
          canJoin: false, 
          canCancel: true,
          canRetry: false,
          badge: 'Upcoming',
          refundAmount: 0
        };
      }
      // Missed/Expired: more than 30 minutes past
      if (timeDiffMinutes > 30) {
        return { 
          state: 'missed', 
          label: 'Missed', 
          color: 'bg-gray-100 text-gray-500', 
          icon: '⚠️', 
          canJoin: false, 
          canCancel: false,
          canRetry: false,
          badge: 'Missed',
          refundAmount: 0
        };
      }
    }
    
    return { 
      state: 'unknown', 
      label: appointment.status, 
      color: 'bg-gray-100 text-gray-600', 
      icon: '📋', 
      canJoin: false, 
      canCancel: false,
      canRetry: false,
      badge: appointment.status,
      refundAmount: 0
    };
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setCancellingId(appointmentId);
    try {
      await dispatch(cancelUserAppointment(appointmentId)).unwrap();
      toast.success('Appointment cancelled successfully');
      dispatch(fetchPatientAppointments());
      dispatch(fetchPatientProfile());
    } catch (error) {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  // Retry payment for pending appointments
  const handleRetryPayment = (appointment) => {
    navigate(`/doctor/${appointment.doctorId?._id || appointment.doctorId}/book`, {
      state: { 
        doctor: appointment.doctorId,
        selectedDate: new Date(appointment.date).toISOString().split('T')[0],
        selectedTime: appointment.timeSlot
      }
    });
  };

  // Filter appointments based on state
  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    
    return appointments?.filter((apt) => {
      if (apt.status === 'cancelled' && filter === 'cancelled') return true;
      if (apt.status === 'completed' && filter === 'completed') return true;
      if (apt.status === 'pending' && filter === 'pending') return true;
      if (apt.status === 'no-show' && filter === 'no-show') return true;
      
      const state = getAppointmentState(apt).state;
      if (filter === 'upcoming') return state === 'upcoming';
      if (filter === 'live') return state === 'live';
      if (filter === 'missed') return state === 'missed';
      return false;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'Dr';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading && appointments?.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Outfit',sans-serif" }}>
        My Appointments
      </h2>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
              filter === f
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f === 'no-show' ? 'No-Show' : f}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      {filteredAppointments?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500 text-sm">No {filter !== 'all' ? filter : ''} appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments?.map((apt) => {
            const appointmentState = getAppointmentState(apt);
            const doctorName = apt.doctorId?.fullName || 'Doctor';
            const displayName = `${doctorName}`;
            const doctorSpecialty = apt.doctorId?.specialization || 'General Physician';
            const date = new Date(apt.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            
            return (
              <div
                key={apt._id}
                className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all duration-200 ${
                  appointmentState.state === 'live' ? 'border-primary/30 shadow-md ring-1 ring-primary/20' : 'border-gray-100'
                }`}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 bg-primary">
                  {getInitials(doctorName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-base">{displayName}</div>
                  <div className="text-sm text-gray-400">{doctorSpecialty}</div>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Icon d={icons.calendar} size={13} />
                      {date}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Icon d={icons.clock} size={13} />
                      {apt.timeSlot}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Icon d={icons.dollar} size={13} />
                      ₹{apt.amount}
                    </span>
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointmentState.color}`}>
                    {appointmentState.icon} {appointmentState.label}
                  </span>
                  
                  {appointmentState.canCancel && (
                    <button
                      onClick={() => handleCancel(apt._id)}
                      disabled={cancellingId === apt._id}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === apt._id ? '...' : 'Cancel'}
                    </button>
                  )}
                  
                  {/* Retry Payment Button for Pending Appointments */}
                  {appointmentState.canRetry && (
                    <button
                      onClick={() => handleRetryPayment(apt)}
                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-dark transition-all"
                    >
                      Retry Payment
                    </button>
                  )}
                  
                  {appointmentState.canJoin && (
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowVideoCall(true);
                      }}
                      className="px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 animate-pulse hover:bg-primary-dark transition-all"
                    >
                      🎥 Join Now
                    </button>
                  )}
                </div>

                {/* ✅ REFUND BADGE - Show refund info for cancelled appointments */}
                {appointmentState.state === 'cancelled' && appointmentState.refundAmount > 0 && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700">
                      💰 Refund of ₹{appointmentState.refundAmount} ({appointmentState.refundPercentage}%) processed
                    </p>
                    {appointmentState.refundId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Refund ID: {appointmentState.refundId.substring(0, 15)}...
                      </p>
                    )}
                  </div>
                )}

                {/* ✅ No Refund Message */}
                {appointmentState.state === 'cancelled' && appointmentState.refundAmount === 0 && apt.paymentStatus === 'paid' && (
                  <div className="mt-3 p-2 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-xs text-red-700">
                      ⚠️ No refund applicable (cancelled less than 12 hours before appointment)
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Live Appointments Summary Banner */}
      {filteredAppointments?.some(apt => getAppointmentState(apt).state === 'live') && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-primary/5 rounded-2xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl">
              🎥
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">You have live consultations</p>
              <p className="text-xs text-gray-500">Click "Join Now" to start your video consultation</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && selectedAppointment && (
        <VideoCall
          roomName={`appointment-${selectedAppointment._id}`}
          displayName={user?.fullName || 'Patient'}
          onClose={() => {
            setShowVideoCall(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
}