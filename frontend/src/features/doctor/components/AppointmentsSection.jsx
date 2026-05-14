import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  Video, 
  MapPin, 
  ChevronRight, 
  MoreVertical, 
  Bell, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock as TimerIcon,
  Calendar as CalendarIcon,
  Ban
} from "lucide-react";

export default function AppointmentsSection() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedView, setSelectedView] = useState("upcoming"); // upcoming, past, cancelled
  const [timeRemaining, setTimeRemaining] = useState({});

  // Complete appointment data with all cases
  const allAppointments = [
    { 
      id: 1, 
      time: "11:00 AM", 
      patientName: "Mr. Singh", 
      type: "video", 
      status: "confirmed",
      viewStatus: "upcoming",
      date: "Today", 
      duration: 30,
      condition: "Follow-up",
      appointmentTime: new Date().setHours(11, 0, 0, 0),
      age: 45,
      gender: "Male",
      cancellationReason: null
    },
    { 
      id: 2, 
      time: "12:30 PM", 
      patientName: "Ms. Verma", 
      type: "in-person", 
      status: "confirmed",
      viewStatus: "upcoming",
      date: "Today", 
      duration: 45,
      condition: "Initial Consultation",
      appointmentTime: new Date().setHours(12, 30, 0, 0),
      age: 32,
      gender: "Female",
      cancellationReason: null
    },
    { 
      id: 3, 
      time: "03:00 PM", 
      patientName: "Ms. Patel", 
      type: "video", 
      status: "confirmed",
      viewStatus: "upcoming",
      date: "Today", 
      duration: 30,
      condition: "Test Results",
      appointmentTime: new Date().setHours(15, 0, 0, 0),
      age: 28,
      gender: "Female",
      cancellationReason: null
    },
    { 
      id: 4, 
      time: "09:00 AM", 
      patientName: "Mr. Kumar", 
      type: "video", 
      status: "completed",
      viewStatus: "past",
      date: "Yesterday", 
      duration: 30,
      condition: "Regular Checkup",
      appointmentTime: new Date().setDate(new Date().getDate() - 1) && new Date().setHours(9, 0, 0, 0),
      age: 52,
      gender: "Male",
      cancellationReason: null
    },
    { 
      id: 5, 
      time: "02:00 PM", 
      patientName: "Mrs. Sharma", 
      type: "in-person", 
      status: "cancelled",
      viewStatus: "cancelled",
      date: "Yesterday", 
      duration: 60,
      condition: "Specialist Consultation",
      appointmentTime: new Date().setDate(new Date().getDate() - 1) && new Date().setHours(14, 0, 0, 0),
      age: 41,
      gender: "Female",
      cancellationReason: "Patient requested cancellation"
    },
  ];

  // Calculate time remaining for each appointment
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const updates = {};
      
      allAppointments.forEach(app => {
        // Skip cancelled appointments
        if (app.status === 'cancelled') {
          updates[app.id] = { 
            status: "cancelled", 
            remainingTime: "Cancelled", 
            canJoin: false,
            diffMins: 0
          };
          return;
        }
        
        // Skip completed appointments
        if (app.status === 'completed') {
          updates[app.id] = { 
            status: "ended", 
            remainingTime: "Session Ended", 
            canJoin: false,
            diffMins: 0
          };
          return;
        }
        
        const appointmentDate = new Date(app.appointmentTime);
        const diffMs = appointmentDate - now;
        const diffMins = Math.floor(diffMs / 60000);
        
        let status = "upcoming";
        let remainingTime = "";
        let canJoin = false;
        
        if (diffMins > 30) {
          status = "upcoming";
          remainingTime = `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
          canJoin = false;
        } else if (diffMins > 0 && diffMins <= 30) {
          status = "soon";
          remainingTime = `${diffMins} minutes`;
          canJoin = true;
        } else if (diffMins <= 0 && Math.abs(diffMins) <= 15) {
          status = "live";
          remainingTime = "Live Now";
          canJoin = true;
        } else if (Math.abs(diffMins) > 15) {
          status = "ended";
          remainingTime = "Session Ended";
          canJoin = false;
        }
        
        updates[app.id] = { status, remainingTime, canJoin, diffMins };
      });
      
      setTimeRemaining(updates);
    };
    
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter appointments based on selected view
  const getFilteredAppointments = () => {
    switch(selectedView) {
      case 'upcoming':
        return allAppointments.filter(app => {
          const timer = timeRemaining[app.id];
          if (app.status === 'cancelled') return false;
          if (app.status === 'completed') return false;
          if (timer && (timer.status === 'upcoming' || timer.status === 'soon' || timer.status === 'live')) {
            return true;
          }
          return false;
        });
      case 'past':
        return allAppointments.filter(app => {
          if (app.status === 'cancelled') return false;
          if (app.status === 'completed') return true;
          const timer = timeRemaining[app.id];
          if (timer && timer.status === 'ended') return true;
          return false;
        });
      case 'cancelled':
        return allAppointments.filter(app => app.status === 'cancelled');
      default:
        return [];
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-primary-light text-primary-dark';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTimerColor = (status) => {
    switch(status) {
      case 'soon': return 'text-orange-500';
      case 'live': return 'text-red-500 animate-pulse';
      case 'upcoming': return 'text-primary';
      case 'ended': return 'text-gray-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getJoinButtonStyle = (canJoin, status, appointmentStatus) => {
    if (appointmentStatus === 'cancelled' || appointmentStatus === 'completed') {
      return "bg-gray-100 text-gray-400 cursor-not-allowed";
    }
    if (!canJoin) return "bg-gray-100 text-gray-400 cursor-not-allowed";
    if (status === 'live') return "bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg";
    return "bg-primary hover:bg-primary-dark text-white";
  };

  const getTypeIcon = (type) => {
    return type === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'live': return <AlertCircle className="w-4 h-4" />;
      case 'soon': return <Bell className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'ended': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <Ban className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <section className="relative space-y-6 p-6 bg-background-soft rounded-medical shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 font-display">
            Appointments
          </h2>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            View and manage your next consultations
          </p>
        </div>
        
        {/* View Toggle - Upcoming, Past, Cancelled */}
        <div className="flex gap-2 p-1 bg-white rounded-medical shadow-soft">
          {[
            { value: 'upcoming', label: 'Upcoming', icon: <CalendarIcon className="w-4 h-4" /> },
            { value: 'past', label: 'Past', icon: <Clock className="w-4 h-4" /> },
            { value: 'cancelled', label: 'Cancelled', icon: <Ban className="w-4 h-4" /> }
          ].map((view) => (
            <button
              key={view.value}
              onClick={() => setSelectedView(view.value)}
              className={`px-4 py-2 text-sm font-medium rounded-medical transition-all duration-300 flex items-center gap-2 ${
                selectedView === view.value 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-600 hover:bg-primary-light'
              }`}
            >
              {view.icon}
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-medical shadow-soft">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No {selectedView} appointments</h3>
          <p className="text-gray-500">You don't have any {selectedView} appointments at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => {
            const timer = timeRemaining[appointment.id] || { 
              status: appointment.status === 'cancelled' ? 'cancelled' : 
                      appointment.status === 'completed' ? 'ended' : 'upcoming',
              remainingTime: appointment.status === 'cancelled' ? 'Cancelled' : 
                            appointment.status === 'completed' ? 'Session Ended' : 'Calculating...',
              canJoin: false,
              diffMins: 0
            };
            
            const isCancelled = appointment.status === 'cancelled';
            const isCompleted = appointment.status === 'completed';
            const isUpcoming = timer.status === 'upcoming' || timer.status === 'soon' || timer.status === 'live';
            
            return (
              <div
                key={appointment.id}
                onMouseEnter={() => setHoveredId(appointment.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group transform transition-all duration-300 hover:scale-[1.01]"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Main Card */}
                <div className={`bg-background-card rounded-medical shadow-soft hover:shadow-lg transition-all duration-300 overflow-hidden border ${
                  isCancelled ? 'border-red-200' : isCompleted ? 'border-gray-200' : 'border-gray-100'
                }`}>
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      
                      {/* Left Section - Time & Patient Info */}
                      <div className="flex items-center gap-4 flex-1">
                        {/* Time Circle with Status Indicator */}
                        <div className="relative">
                          <div className={`w-20 h-20 rounded-medical flex flex-col items-center justify-center shadow-md transition-all duration-300 ${
                            isCancelled ? 'bg-gray-400' :
                            timer.status === 'live' ? 'bg-red-500' : 
                            timer.status === 'soon' ? 'bg-orange-500' : 
                            isCompleted ? 'bg-gray-500' : 'bg-primary'
                          }`}>
                            <span className="text-white text-xl font-bold">{appointment.time.split(' ')[0]}</span>
                            <span className="text-white/90 text-xs">{appointment.time.split(' ')[1]}</span>
                          </div>
                          {/* Timer Badge */}
                          {!isCancelled && !isCompleted && timer.status === 'soon' && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-bounce">
                              <Bell className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {!isCancelled && !isCompleted && timer.status === 'live' && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-ping" />
                          )}
                        </div>

                        {/* Patient Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-900 font-display">
                              {appointment.patientName}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <User className="w-3 h-3" />
                              <span>{appointment.age} yrs, {appointment.gender}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{appointment.duration} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getTypeIcon(appointment.type)}
                              <span className="capitalize">{appointment.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{appointment.date}</span>
                            </div>
                          </div>

                          {/* Condition/Hospital Tag */}
                          <div className="inline-block px-2 py-1 bg-primary-light/30 rounded-medical">
                            <span className="text-xs text-primary-dark">{appointment.condition}</span>
                          </div>

                          {/* Cancellation Reason */}
                          {isCancelled && appointment.cancellationReason && (
                            <div className="inline-block px-2 py-1 bg-red-50 rounded-medical">
                              <span className="text-xs text-red-600">Reason: {appointment.cancellationReason}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Timer & Actions */}
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Timer Display */}
                        <div className={`flex flex-col items-center px-4 py-2 rounded-medical bg-gray-50 min-w-[140px] ${
                          !isCancelled && !isCompleted && timer.status === 'soon' ? 'border-l-4 border-orange-500' : 
                          !isCancelled && !isCompleted && timer.status === 'live' ? 'border-l-4 border-red-500 animate-pulse' :
                          isCancelled ? 'border-l-4 border-red-500' :
                          isCompleted ? 'border-l-4 border-gray-500' : ''
                        }`}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(timer.status)}
                            <span className={`text-sm font-semibold ${getTimerColor(timer.status)}`}>
                              {isCancelled ? '❌ CANCELLED' : 
                               isCompleted ? '✅ SESSION ENDED' :
                               timer.status === 'live' ? '🔴 LIVE NOW' : 
                               timer.status === 'soon' ? '⏰ STARTING SOON' : 
                               timer.status === 'upcoming' ? '📅 UPCOMING' : 'SESSION ENDED'}
                            </span>
                          </div>
                          <div className="text-lg font-bold text-gray-800 font-mono">
                            {isCancelled ? 'Appointment Cancelled' :
                             isCompleted ? 'Session Completed' :
                             timer.remainingTime}
                          </div>
                          {!isCancelled && !isCompleted && timer.status === 'soon' && timer.diffMins > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {timer.diffMins} minutes remaining
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          {!isCancelled && !isCompleted && timer.canJoin ? (
                            <button className={`px-6 py-2 rounded-medical font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${getJoinButtonStyle(timer.canJoin, timer.status, appointment.status)}`}>
                              {timer.status === 'live' ? (
                                <>
                                  <Video className="w-4 h-4" />
                                  <span>Join Now</span>
                                </>
                              ) : (
                                <>
                                  <Bell className="w-4 h-4" />
                                  <span>Join Call</span>
                                </>
                              )}
                              <ChevronRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                            </button>
                          ) : (
                            <button disabled className="px-6 py-2 rounded-medical bg-gray-100 text-gray-400 cursor-not-allowed flex items-center gap-2">
                              <TimerIcon className="w-4 h-4" />
                              <span>
                                {isCancelled ? 'Cancelled' : 
                                 isCompleted ? 'Completed' : 
                                 'Join Disabled'}
                              </span>
                            </button>
                          )}
                          
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-medical hover:bg-gray-100 transition-all duration-300">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar - Only for upcoming/soon/live appointments */}
                    {!isCancelled && !isCompleted && timer.status !== 'upcoming' && timer.status !== 'ended' && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Time to appointment</span>
                          <span>{timer.remainingTime} left</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              timer.status === 'live' ? 'bg-red-500' : 'bg-primary'
                            }`}
                            style={{ 
                              width: timer.status === 'live' ? '100%' : 
                                     timer.status === 'soon' ? `${((30 - Math.abs(timer.diffMins)) / 30) * 100}%` : '0%'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
}