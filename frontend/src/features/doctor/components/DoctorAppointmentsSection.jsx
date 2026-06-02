import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, DollarSign, CheckCircle, XCircle, Video, Clock as ClockIcon } from 'lucide-react';
import { getDoctorAppointments, updateAppointmentStatus } from '../services/doctorApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import VideoCall from '../../../components/VideoCall';

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
      const params = filter === 'all' ? {} : { status: filter };
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
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setProcessingId(null);
    }
  };

  // ✅ Check if appointment can be joined
  const canJoinAppointment = (appointment) => {
    if (appointment.status !== 'confirmed') return false;
    const appointmentTime = new Date(appointment.date);
    const now = new Date();
    const timeDiff = (now - appointmentTime) / (1000 * 60);
    // Allow from 5 minutes before to 30 minutes after
    return timeDiff >= -5 && timeDiff <= 30;
  };

  // ✅ Get status badge with live indicator
  const getStatusBadge = (appointment) => {
    if (appointment.status === 'cancelled') {
      return { text: 'Cancelled', className: 'bg-red-100 text-red-700', icon: XCircle };
    }
    if (appointment.status === 'completed') {
      return { text: 'Completed', className: 'bg-green-100 text-green-700', icon: CheckCircle };
    }
    if (appointment.status === 'pending') {
      return { text: 'Pending', className: 'bg-yellow-100 text-yellow-700', icon: ClockIcon };
    }
    if (appointment.status === 'confirmed') {
      const appointmentTime = new Date(appointment.date);
      const now = new Date();
      if (now < appointmentTime) {
        return { text: 'Upcoming', className: 'bg-blue-100 text-blue-700', icon: Clock };
      } else {
        return { text: 'Live Now', className: 'bg-green-100 text-green-700 animate-pulse', icon: Video };
      }
    }
    return { text: appointment.status, className: 'bg-gray-100 text-gray-700', icon: null };
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

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
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const statusBadge = getStatusBadge(apt);
            const StatusIcon = statusBadge.icon;
            const isJoinable = canJoinAppointment(apt);
            
            return (
              <div key={apt._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Patient Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
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
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusBadge.className} capitalize`}>
                      {StatusIcon && <StatusIcon size={12} />}
                      {statusBadge.text}
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
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                      disabled={processingId === apt._id}
                      className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100"
                    >
                      Confirm
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'completed')}
                        disabled={processingId === apt._id}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                        disabled={processingId === apt._id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {apt.status === 'completed' && (
                    <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                      View Details
                    </button>
                  )}
                  
                  {/* ✅ JOIN NOW BUTTON - Shows only when appointment is live */}
                  {isJoinable && (
                    <button
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setShowVideoCall(true);
                      }}
                      className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary-dark transition-all"
                    >
                      <Video size={14} /> Join Now
                    </button>
                  )}
                </div>

                {/* Upcoming message */}
                {apt.status === 'confirmed' && !canJoinAppointment(apt) && new Date(apt.date) > new Date() && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-400">
                      ⏰ Appointment scheduled for {new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ Video Call Modal */}
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