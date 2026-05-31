import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctorById, clearSelectedDoctor } from '../../../redux/slices/doctorSlice';
import { MapPin, Clock, DollarSign, Star, Briefcase, Award, ChevronLeft, Calendar } from 'lucide-react';

export default function DoctorProfilePage() {


  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedDoctor, loading, error } = useSelector((state) => state.doctors);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    dispatch(fetchDoctorById(id));
    return () => {
      dispatch(clearSelectedDoctor());
    };
  }, [dispatch, id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', `/doctor/${id}`);
      navigate('/login');
      return;
    }
    navigate(`/doctor/${id}/book`, {
      state: { doctor: selectedDoctor, selectedDate, selectedTime }
    });
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

  // ✅ FIXED: Use selectedDoctor directly
  const doctorFullName = selectedDoctor?.fullName || selectedDoctor?._id?.fullName || selectedDoctor?.name || 'Doctor Name';
  const doctorSpecialization = selectedDoctor?.specialization || 'Specialist';
  const doctorRating = selectedDoctor?.rating || 4.5;
  const doctorExperience = selectedDoctor?.experience || 0;
  const doctorFee = selectedDoctor?.consultationFee || 500;
  const doctorBio = selectedDoctor?.bio || 'Experienced doctor dedicated to providing quality healthcare.';
  const doctorQualifications = selectedDoctor?.qualifications || [];
  const doctorClinicAddress = selectedDoctor?.clinicAddress || {};

  const availableSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];


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
                {/* ✅ Now shows correct doctor name */}
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
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
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
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={!selectedDate || !selectedTime}
                className="w-full py-2.5 bg-primary text-white rounded-medical text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}