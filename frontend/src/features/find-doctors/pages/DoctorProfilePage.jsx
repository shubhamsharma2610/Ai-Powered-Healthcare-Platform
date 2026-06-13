import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById, clearSelectedDoctor } from '../../../redux/slices/doctorSlice';
import { MapPin, Clock, DollarSign, Star, Briefcase, Award, ChevronLeft, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedDoctor, loading, error } = useSelector((state) => state.doctors);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  // Validation states
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [isDateValid, setIsDateValid] = useState(false);
  const [isTimeValid, setIsTimeValid] = useState(false);
  const [isCheckingSlot, setIsCheckingSlot] = useState(false);
  const [daySchedule, setDaySchedule] = useState(null);

  useEffect(() => {
    dispatch(fetchDoctorById(id));
    return () => {
      dispatch(clearSelectedDoctor());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedDoctor?.id) {
      fetchDoctorSchedule();
    }
  }, [selectedDoctor]);

  const fetchDoctorSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const response = await axios.get(`${API_URL}/doctors/${selectedDoctor.id}/schedule`, {
        withCredentials: true
      });
      setDoctorSchedule(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // Check date availability
  const checkDateAvailability = (date) => {
    if (!doctorSchedule.length) return { valid: true, error: '', schedule: null };
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const schedule = doctorSchedule.find(slot => slot.day === dayName);
    
    if (!schedule || !schedule.isAvailable) {
      return { valid: false, error: `Doctor is not available on ${dayName}`, schedule: null };
    }
    
    return { valid: true, error: '', schedule };
  };

  // ✅ FIXED: Generate time slots based on doctor's schedule (excludes end time)
  const generateTimeSlots = (schedule) => {
    const slots = [];
    
    // Parse start and end times
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    // Convert to minutes for easier comparison
    const endTotalMinutes = endHour * 60 + endMinute;
    
    while (true) {
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      
      // ✅ Stop if current time is >= end time
      // For 9:00 to 11:00:
      // 9:00 ✅, 9:30 ✅, 10:00 ✅, 10:30 ✅, 11:00 ❌ (stop)
      if (currentTotalMinutes >= endTotalMinutes) {
        break;
      }
      
      // Add current slot
      const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeSlot);
      
      // Add 30 minutes
      currentMinute += 30;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
    
    return slots;
  };

  // Handle date change
  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(e.target.value);
    setSelectedTime('');
    setIsTimeValid(false);
    setTimeError('');
    
    const { valid, error, schedule } = checkDateAvailability(date);
    
    if (valid) {
      setIsDateValid(true);
      setDateError('');
      setDaySchedule(schedule);
      const slots = generateTimeSlots(schedule);
      setAvailableTimeSlots(slots);
    } else {
      setIsDateValid(false);
      setDateError(error);
      setDaySchedule(null);
      setAvailableTimeSlots([]);
    }
  };

  // Check if time slot is already booked
  const checkSlotAvailability = async (date, timeSlot) => {
    setIsCheckingSlot(true);
    setTimeError('');
    
    try {
      const response = await axios.get(`${API_URL}/appointments/check-slot`, {
        params: {
          doctorId: selectedDoctor.id,
          date: date,
          timeSlot: timeSlot
        },
        withCredentials: true
      });
      
      if (response.data.success && response.data.available) {
        setIsTimeValid(true);
        setTimeError('');
        return true;
      } else {
        setIsTimeValid(false);
        setTimeError(response.data.reason || 'This time slot is already booked');
        return false;
      }
    } catch (error) {
      console.error('Error checking slot:', error);
      // If API fails, still allow booking based on basic validation
      setIsTimeValid(true);
      setTimeError('');
      return true;
    } finally {
      setIsCheckingSlot(false);
    }
  };

  // Handle time slot selection
  const handleTimeSelect = async (timeSlot) => {
    setSelectedTime(timeSlot);
    setIsTimeValid(false);
    setTimeError('');
    
    if (selectedDate && timeSlot) {
      await checkSlotAvailability(selectedDate, timeSlot);
    }
  };

  const handleBookNow = async () => {
    // Validate date
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    
    if (!isDateValid) {
      toast.error(dateError || 'Please select a valid date');
      return;
    }
    
    // Validate time
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    
    if (!isTimeValid) {
      toast.error(timeError || 'Please select a valid time slot');
      return;
    }
    
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', `/doctor/${id}`);
      navigate('/login');
      return;
    }
    
    // Double check slot availability before proceeding
    setIsCheckingSlot(true);
    const isAvailable = await checkSlotAvailability(selectedDate, selectedTime);
    setIsCheckingSlot(false);
    
    if (!isAvailable) {
      toast.error('This time slot is no longer available. Please select another time.');
      return;
    }
    
    navigate(`/doctor/${id}/book`, {
      state: { 
        doctor: selectedDoctor, 
        selectedDate, 
        selectedTime 
      }
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getProfilePicture = () => {
    return selectedDoctor?.documents?.profilePhoto || 
           selectedDoctor?.profilePicture || 
           null;
  };

  const getInitials = (name) => {
    if (!name) return 'D';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Check if book button should be enabled
  const isBookEnabled = selectedDate && 
                        isDateValid && 
                        selectedTime && 
                        isTimeValid && 
                        !isCheckingSlot;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!selectedDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Doctor not found</p>
      </div>
    );
  }

  const profilePhoto = getProfilePicture();
  const doctorFullName = selectedDoctor?.fullName || selectedDoctor?._id?.fullName || selectedDoctor?.name || 'Doctor Name';
  const doctorSpecialization = selectedDoctor?.specialization || 'Specialist';
  const doctorRating = selectedDoctor?.rating || 4.5;
  const doctorExperience = selectedDoctor?.experience || 0;
  const doctorFee = selectedDoctor?.consultationFee || 500;
  const doctorBio = selectedDoctor?.bio || 'Experienced doctor dedicated to providing quality healthcare.';
  const doctorQualifications = selectedDoctor?.qualifications || [];
  const doctorClinicAddress = selectedDoctor?.clinicAddress || {};
  const isApproved = selectedDoctor?.isApproved || false;

  return (
    <div className="min-h-screen bg-surface-soft py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => navigate('/find-doctors')}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Doctors
        </button>

        <div className="bg-white rounded-medical shadow-card overflow-hidden">
          {/* Header */}
          <div className="bg-primary-50 px-6 py-5">
            <div className="flex flex-col md:flex-row gap-5">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt={doctorFullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">${getInitials(doctorFullName)}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                  {getInitials(doctorFullName)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900 font-display">{doctorFullName}</h1>
                  {isApproved && (
                    <CheckCircle size={18} className="text-green-500" />
                  )}
                </div>
                <p className="text-sm text-primary capitalize">{doctorSpecialization}</p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span>{doctorRating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Briefcase size={14} />
                    <span>{doctorExperience} years</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="inline-block bg-primary-50 rounded-medical px-4 py-2">
                  <p className="text-xs text-gray-500">Consultation Fee</p>
                  <p className="text-xl font-bold text-primary">₹{doctorFee}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* About */}
            <div>
              <h2 className="text-md font-semibold text-gray-800 mb-1">About</h2>
              <p className="text-sm text-gray-500">{doctorBio}</p>
            </div>

            {/* Qualifications */}
            {doctorQualifications.length > 0 && (
              <div>
                <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Award size={16} /> Qualifications
                </h2>
                <div className="space-y-1">
                  {doctorQualifications.map((qual, idx) => (
                    <p key={idx} className="text-sm text-gray-500">• {qual.degree} from {qual.institution} ({qual.year})</p>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {doctorClinicAddress?.city && (
              <div>
                <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Location
                </h2>
                <p className="text-sm text-gray-500">
                  {doctorClinicAddress.street && `${doctorClinicAddress.street}, `}
                  {doctorClinicAddress.city && `${doctorClinicAddress.city}, `}
                  {doctorClinicAddress.state && `${doctorClinicAddress.state} - `}
                  {doctorClinicAddress.zipCode}
                </p>
              </div>
            )}

            {/* Booking Section */}
            <div className="border-t border-gray-100 pt-5">
              <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={16} /> Book Appointment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Date *</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={getMinDate()}
                    className={`w-full px-3 py-2 text-sm border rounded-medical focus:outline-none focus:border-primary ${
                      dateError ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  
                  {/* Date validation message */}
                  {dateError && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-500">
                      <XCircle size={12} />
                      <span>{dateError}</span>
                    </div>
                  )}
                  
                  {isDateValid && daySchedule && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                      <CheckCircle size={12} />
                      <span>Available {daySchedule.day} ({daySchedule.startTime} - {daySchedule.endTime})</span>
                    </div>
                  )}
                </div>
                
                {/* Time Slot Selection */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Time Slot *</label>
                  
                  {loadingSchedule ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary"></div>
                    </div>
                  ) : !selectedDate ? (
                    <p className="text-sm text-gray-400 py-2">Please select a date first</p>
                  ) : availableTimeSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 py-2">No available slots for selected date</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {availableTimeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => handleTimeSelect(slot)}
                            disabled={isCheckingSlot}
                            className={`px-2 py-1.5 text-xs rounded-medical border transition-all ${
                              selectedTime === slot && isTimeValid
                                ? 'bg-primary text-white border-primary'
                                : selectedTime === slot && !isTimeValid
                                ? 'bg-red-50 text-red-500 border-red-300'
                                : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                            }`}
                          >
                            {slot}
                            {selectedTime === slot && !isTimeValid && (
                              <span className="ml-1 text-[10px]">❌</span>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {/* Time validation message */}
                      {timeError && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
                          <AlertCircle size={12} />
                          <span>{timeError}</span>
                        </div>
                      )}
                      
                      {isCheckingSlot && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <div className="animate-spin rounded-full h-3 w-3 border border-primary border-t-transparent"></div>
                          <span>Checking availability...</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Book Button with validation */}
              <button
                onClick={handleBookNow}
                disabled={!isBookEnabled}
                className={`w-full py-2.5 rounded-medical text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  isBookEnabled
                    ? 'bg-primary text-white hover:bg-primary-600 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isCheckingSlot ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Verifying Slot...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </button>

              {/* Doctor's Availability Summary */}
              {doctorSchedule.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">Doctor's Weekly Schedule:</p>
                  <div className="flex flex-wrap gap-2">
                    {doctorSchedule.filter(s => s.isAvailable).map(slot => (
                      <span key={slot.day} className="text-xs bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full">
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}