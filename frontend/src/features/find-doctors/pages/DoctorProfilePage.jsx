import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById, clearSelectedDoctor } from '../../../redux/slices/doctorSlice'; // ✅ ADDED MISSING IMPORTS
import { MapPin, Clock, DollarSign, Star, Briefcase, Award, ChevronLeft, Calendar } from 'lucide-react';
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

  // ✅ Now fetchDoctorById is defined
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

  const isDateAvailable = (date) => {
    if (!doctorSchedule.length) return true;
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = doctorSchedule.find(slot => slot.day === dayName);
    return daySchedule && daySchedule.isAvailable;
  };

  const getAvailableTimeSlotsForDate = (date) => {
    if (!doctorSchedule.length) {
      return ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
    }
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = doctorSchedule.find(slot => slot.day === dayName);
    
    if (!daySchedule || !daySchedule.isAvailable) return [];
    
    const slots = [];
    const startHour = parseInt(daySchedule.startTime.split(':')[0]);
    const endHour = parseInt(daySchedule.endTime.split(':')[0]);
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    
    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      const slots = getAvailableTimeSlotsForDate(new Date(selectedDate));
      setAvailableTimeSlots(slots);
      setSelectedTime('');
    }
  }, [selectedDate, doctorSchedule]);

  const handleBookNow = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!selectedTime) {
      toast.error('Please select a time slot');
      return;
    }
    
    if (!isDateAvailable(new Date(selectedDate))) {
      toast.error('Doctor is not available on this day');
      return;
    }
    
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', `/doctor/${id}`);
      navigate('/login');
      return;
    }
    
    navigate(`/doctor/${id}/book`, {
      state: { doctor: selectedDoctor, selectedDate, selectedTime }
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

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

  const doctorFullName = selectedDoctor?.fullName || selectedDoctor?._id?.fullName || selectedDoctor?.name || 'Doctor Name';
  const doctorSpecialization = selectedDoctor?.specialization || 'Specialist';
  const doctorRating = selectedDoctor?.rating || 4.5;
  const doctorExperience = selectedDoctor?.experience || 0;
  const doctorFee = selectedDoctor?.consultationFee || 500;
  const doctorBio = selectedDoctor?.bio || 'Experienced doctor dedicated to providing quality healthcare.';
  const doctorQualifications = selectedDoctor?.qualifications || [];
  const doctorClinicAddress = selectedDoctor?.clinicAddress || {};

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
          <div className="bg-primary-50 px-6 py-5">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-4xl">
                👨‍⚕️
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 font-display">{doctorFullName}</h1>
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
            <div>
              <h2 className="text-md font-semibold text-gray-800 mb-1">About</h2>
              <p className="text-sm text-gray-500">{doctorBio}</p>
            </div>

            {doctorQualifications.length > 0 && (
              <div>
                <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Award size={16} /> Qualifications
                </h2>
                <div className="space-y-1">
                  {doctorQualifications.map((qual, idx) => (
                    <p key={idx} className="text-sm text-gray-500">• {qual.degree} from {qual.institution}</p>
                  ))}
                </div>
              </div>
            )}

            {doctorClinicAddress?.city && (
              <div>
                <h2 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Location
                </h2>
                <p className="text-sm text-gray-500">
                  {doctorClinicAddress.street && `${doctorClinicAddress.street}, `}
                  {doctorClinicAddress.city}
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-5">
              <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={16} /> Book Appointment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary"
                  />
                  {selectedDate && !isDateAvailable(new Date(selectedDate)) && doctorSchedule.length > 0 && (
                    <p className="text-xs text-red-500 mt-1">Doctor is not available on this day</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Time</label>
                  {loadingSchedule ? (
                    <div className="flex justify-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary"></div>
                    </div>
                  ) : availableTimeSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 py-2">No available slots for selected date</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`px-2 py-1.5 text-xs rounded-medical border transition-all ${
                            selectedTime === slot
                              ? 'bg-primary text-white border-primary'
                              : 'border-gray-200 text-gray-600 hover:border-primary'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={!selectedDate || !selectedTime || (selectedDate && !isDateAvailable(new Date(selectedDate)))}
                className="w-full py-2.5 bg-primary text-white rounded-medical text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Appointment
              </button>

              {doctorSchedule.length > 0 && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-medium mb-1">Doctor's Availability:</p>
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