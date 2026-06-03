import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, DollarSign, CheckCircle, XCircle, Video, Clock as ClockIcon } from 'lucide-react';
import { getDoctorAppointments, updateAppointmentStatus } from '../services/doctorApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import VideoCall from '../../../components/VideoCall';

// Appointment state filters
const filters = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No-Show' }
];

export default function DoctorAppointmentsSection() {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  
  // Video call state
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'].includes(filter) 
        ? { status: filter === 'confirmed' ? 'confirmed' : filter }
        : {};
      const response = await getDoctorAppointments(params);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id);
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status === 'no-show' ? 'marked as no-show' : status} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

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
        className: 'bg-red-100 text-red-700', 
        icon: XCircle,
        canJoin: false,
        canConfirm: false,
        canComplete: false,
        canCancel: false,
        canMarkNoShow: false
      };
    }
    
    // Completed
    if (appointment.status === 'completed') {
      return { 
        state: 'completed', 
        label: 'Completed', 
        className: 'bg-green-100 text-green-700', 
        icon: CheckCircle,
        canJoin: false,
        canConfirm: false,
        canComplete: false,
        canCancel: false,
        canMarkNoShow: false
      };
    }
    
    // No-Show
    if (appointment.status === 'no-show') {
      return { 
        state: 'no-show', 
        label: 'No-Show', 
        className: 'bg-gray-100 text-gray-500', 
        icon: XCircle,
        canJoin: false,
        canConfirm: false,
        canComplete: false,
        canCancel: false,
        canMarkNoShow: false
      };
    }
    
    // Confirmed appointments
    if (appointment.status === 'confirmed') {
      // Live: 30 minutes before to 30 minutes after
      if (timeDiffMinutes >= -30 && timeDiffMinutes <= 30) {
        return { 
          state: 'live', 
          label: 'Live Now', 
          className: 'bg-green-100 text-green-700 animate-pulse', 
          icon: Video,
          canJoin: true,
          canConfirm: false,
          canComplete: true,
          canCancel: true,
          canMarkNoShow: false
        };
      }
      // Upcoming: more than 30 minutes in future
      if (timeDiffMinutes < -30) {
        return { 
          state: 'upcoming', 
          label: 'Upcoming', 
          className: 'bg-blue-100 text-blue-700', 
          icon: Clock,
          canJoin: false,
          canConfirm: false,
          canComplete: true,
          canCancel: true,
          canMarkNoShow: false
        };
      }
      // Missed: more than 30 minutes past
      if (timeDiffMinutes > 30) {
        return { 
          state: 'missed', 
          label: 'Missed', 
          className: 'bg-gray-100 text-gray-500', 
          icon: ClockIcon,
          canJoin: false,
          canConfirm: false,
          canComplete: false,
          canCancel: false,
          canMarkNoShow: true
        };
      }
    }
    
    // Pending
    if (appointment.status === 'pending') {
      return { 
        state: 'pending', 
        label: 'Payment Pending', 
        className: 'bg-yellow-100 text-yellow-700', 
        icon: ClockIcon,
        canJoin: false,
        canConfirm: true,
        canComplete: false,
        canCancel: true,
        canMarkNoShow: false
      };
    }
    
    return { 
      state: 'unknown', 
      label: appointment.status, 
      className: 'bg-gray-100 text-gray-600', 
      icon: null,
      canJoin: false,
      canConfirm: false,
      canComplete: false,
      canCancel: false,
      canMarkNoShow: false
    };
  };

  // Filter appointments based on state
  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    
    return appointments?.filter((apt) => {
      if (apt.status === 'cancelled' && filter === 'cancelled') return true;
      if (apt.status === 'completed' && filter === 'completed') return true;
      if (apt.status === 'pending' && filter === 'pending') return true;
      if (apt.status === 'no-show' && filter === 'no-show') return true;
      if (apt.status === 'confirmed' && filter === 'confirmed') return apt.status === 'confirmed';
      
      const state = getAppointmentState(apt).state;
      if (filter === 'upcoming') return state === 'upcoming';
      if (filter === 'live') return state === 'live';
      if (filter === 'missed') return state === 'missed';
      return false;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Appointments</h2>
        <p className="text-sm text-gray-500">Manage your patient appointments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => {
            const appointmentState = getAppointmentState(apt);
            const StatusIcon = appointmentState.icon;
            
            return (
              <div 
                key={apt._id} 
                className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
                  appointmentState.state === 'live' 
                    ? 'border-primary/30 shadow-md ring-1 ring-primary/20' 
                    : 'border-gray-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                      {apt.patientId?.fullName?.[0] || 'P'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{apt.patientId?.fullName || 'Patient'}</h3>
                      <p className="text-sm text-gray-500">{apt.patientId?.email}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(apt.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {apt.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-primary">₹{apt.amount}</span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${appointmentState.className} capitalize`}>
                      {StatusIcon && <StatusIcon size={12} />}
                      {appointmentState.label}
                    </span>
                  </div>
                </div>

                {/* Symptoms */}
                {apt.symptoms && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <span className="font-medium">Symptoms:</span> {apt.symptoms}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                  {appointmentState.canConfirm && (
                    <button
                      onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                      disabled={processingId === apt._id}
                      className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-all disabled:opacity-50"
                    >
                      Confirm
                    </button>
                  )}
                  
                  {appointmentState.canComplete && (
                    <button
                      onClick={() => handleStatusUpdate(apt._id, 'completed')}
                      disabled={processingId === apt._id}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all disabled:opacity-50"
                    >
                      ✅ Mark Completed
                    </button>
                  )}
                  
                  {/* No-Show Button for missed appointments */}
                  {appointmentState.canMarkNoShow && (
                    <button
                      onClick={() => handleStatusUpdate(apt._id, 'no-show')}
                      disabled={processingId === apt._id}
                      className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all disabled:opacity-50"
                    >
                      🚫 Mark No-Show
                    </button>
                  )}
                  
                  {/* ✅ Cancel Button with Full Refund Warning */}
                  {appointmentState.canCancel && (
                    <button
                      onClick={() => {
                        if (window.confirm('⚠️ Cancel this appointment? Patient will get 100% refund.')) {
                          handleStatusUpdate(apt._id, 'cancelled');
                        }
                      }}
                      disabled={processingId === apt._id}
                      className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      Cancel (Full Refund)
                    </button>
                  )}
                  
                  {appointmentState.canJoin && (
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowVideoCall(true);
                      }}
                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-dark transition-all animate-pulse"
                    >
                      <Video size={14} /> Join Now
                    </button>
                  )}
                </div>

                {/* Upcoming message */}
                {appointmentState.state === 'upcoming' && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-400">
                      ⏰ Appointment scheduled for {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
                    </p>
                  </div>
                )}
                
                {/* Missed message with No-Show suggestion */}
                {appointmentState.state === 'missed' && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-orange-500">
                      ⚠️ Patient missed this appointment. Click "Mark No-Show" to record.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Live Appointments Banner */}
      {filteredAppointments.some(apt => getAppointmentState(apt).state === 'live') && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-primary/5 rounded-2xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              🎥
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Live Consultations Available</p>
              <p className="text-xs text-gray-500">Click "Join Now" to start video consultation</p>
            </div>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {showVideoCall && selectedAppointment && (
        <VideoCall
          roomName={`appointment-${selectedAppointment._id}`}
          displayName={`Dr. ${user?.fullName || 'Doctor'}`}
          onClose={() => {
            setShowVideoCall(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
}