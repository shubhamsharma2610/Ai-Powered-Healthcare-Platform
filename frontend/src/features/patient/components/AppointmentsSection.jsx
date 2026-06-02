import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatientAppointments, fetchPatientProfile } from "../../../redux/slices/patientSlice";
import { cancelUserAppointment } from "../../../redux/slices/appointmentSlice";
import { Icon, icons } from "./shared/Icon";
import { toast } from "react-hot-toast";
import VideoCall from "../../../components/VideoCall";

const filters = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function AppointmentsSection() {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.auth);
  
  const [filter, setFilter] = useState("all");
  const [cancellingId, setCancellingId] = useState(null);
  
  // Video call state
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    dispatch(fetchPatientAppointments());
  }, [dispatch]);

  useEffect(() => {
    console.log('Appointments data:', appointments);
  }, [appointments]);

  // ✅ Check if appointment can be joined
  const canJoinAppointment = (appointment) => {
    if (appointment.status !== 'confirmed') return false;
    const appointmentTime = new Date(appointment.date);
    const now = new Date();
    const timeDiff = (now - appointmentTime) / (1000 * 60);
    // Allow from 5 minutes before to 30 minutes after
    return timeDiff >= -5 && timeDiff <= 30;
  };

  // ✅ Get status with live indicator
  const getStatusWithLive = (appointment) => {
    if (appointment.status === 'confirmed') {
      const appointmentTime = new Date(appointment.date);
      const now = new Date();
      if (now >= appointmentTime && (now - appointmentTime) / (1000 * 60) <= 30) {
        return { label: 'Live Now', color: 'bg-green-100 text-green-700 animate-pulse' };
      }
      if (now < appointmentTime) {
        return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
      }
    }
    return null;
  };

  // Get status color for badge
  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Get avatar initials from doctor name
  const getInitials = (name) => {
    if (!name) return 'Dr';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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

  // Filter appointments
  const filteredAppointments = filter === "all" 
    ? appointments 
    : appointments?.filter((a) => a.status === filter);

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
            {f}
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
            const doctorName = apt.doctorId?.fullName || 'N/A';
            const displayName = doctorName === 'N/A' ? 'Dr. N/A' : `${doctorName}`;
            const doctorSpecialty = apt.doctorId?.specialization || 'General Physician';
            const date = new Date(apt.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            
            const liveStatus = getStatusWithLive(apt);
            const isJoinable = canJoinAppointment(apt);
            const isUpcoming = apt.status === 'confirmed' && new Date(apt.date) > new Date();
            
            return (
              <div
                key={apt._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all duration-200"
              >
                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 bg-primary"
                >
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
                  {liveStatus ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${liveStatus.color}`}>
                      {liveStatus.label}
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(apt.status)}`}>
                      {getStatusLabel(apt.status)}
                    </span>
                  )}
                  
                  {apt.status === 'confirmed' && !isJoinable && !isUpcoming && (
                    <button
                      onClick={() => handleCancel(apt._id)}
                      disabled={cancellingId === apt._id}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {cancellingId === apt._id ? '...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Join Now Button Section - Separate from main card */}
      <div className="mt-6 space-y-4">
        {filteredAppointments?.map((apt) => {
          const isJoinable = canJoinAppointment(apt);
          
          if (!isJoinable) return null;
          
          return (
            <div key={`join-${apt._id}`} className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Live Consultation with Dr. {apt.doctorId?.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Your appointment is ready. Click Join Now to start video consultation.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedAppointment(apt);
                    setShowVideoCall(true);
                  }}
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-dark transition-all animate-pulse"
                >
                  <Icon d={icons.video} size={16} />
                  Join Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Appointments Message */}
      <div className="mt-4 space-y-2">
        {filteredAppointments?.map((apt) => {
          const isUpcoming = apt.status === 'confirmed' && new Date(apt.date) > new Date();
          if (!isUpcoming) return null;
          
          return (
            <div key={`upcoming-${apt._id}`} className="text-center">
              <p className="text-xs text-gray-400">
                ⏰ Upcoming appointment with Dr. {apt.doctorId?.fullName} on {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
              </p>
            </div>
          );
        })}
      </div>

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