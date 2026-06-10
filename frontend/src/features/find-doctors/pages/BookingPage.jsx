import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, Calendar, Clock, User, MapPin, DollarSign, Shield, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { createAppointment, createPaymentOrder, verifyPayment } from '../services/bookingApi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { doctor, selectedDate, selectedTime } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patientName, setPatientName] = useState(user?.fullName || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptoms, setSymptoms] = useState('');
  
  // Schedule validation states
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [isScheduleValid, setIsScheduleValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [isCheckingSlot, setIsCheckingSlot] = useState(false);

  useEffect(() => {
    if (!doctor || !selectedDate || !selectedTime) {
      navigate('/find-doctors');
    } else {
      validateDoctorSchedule();
    }
  }, [doctor, selectedDate, selectedTime, navigate]);

  const validateDoctorSchedule = async () => {
    setIsCheckingSlot(true);
    try {
      const response = await axios.get(`${API_URL}/doctors/${doctor.id}/schedule`, {
        withCredentials: true
      });
      setDoctorSchedule(response.data.data || []);
      
      // Validate selected date
      const date = new Date(selectedDate);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const daySchedule = response.data.data?.find(slot => slot.day === dayName);
      
      if (!daySchedule || !daySchedule.isAvailable) {
        setIsScheduleValid(false);
        setValidationMessage(`Doctor is not available on ${dayName}. Please go back and select another date.`);
        toast.error(`Doctor not available on ${dayName}`);
      } 
      // Validate selected time
      else if (selectedTime < daySchedule.startTime || selectedTime > daySchedule.endTime) {
        setIsScheduleValid(false);
        setValidationMessage(`Selected time ${selectedTime} is outside doctor's working hours (${daySchedule.startTime} - ${daySchedule.endTime}).`);
        toast.error(`Time slot outside working hours`);
      }
      else {
        // Check if slot is already booked
        await checkSlotAvailability(selectedDate, selectedTime, daySchedule);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsCheckingSlot(false);
    }
  };

  const checkSlotAvailability = async (date, timeSlot, daySchedule) => {
    try {
      const response = await axios.get(`${API_URL}/appointments/check-slot`, {
        params: {
          doctorId: doctor.id,
          date: date,
          timeSlot: timeSlot
        },
        withCredentials: true
      });
      
      if (response.data.success && response.data.available) {
        setIsScheduleValid(true);
        setValidationMessage('');
      } else {
        setIsScheduleValid(false);
        setValidationMessage(response.data.reason || 'This time slot is already booked. Please go back and select another time.');
        toast.error('Time slot already booked');
      }
    } catch (error) {
      console.error('Error checking slot:', error);
      // If API fails, assume slot is available
      setIsScheduleValid(true);
      setValidationMessage('');
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!patientName || !patientEmail || !patientPhone) {
      setError('Please fill all fields');
      return;
    }
    
    if (!isScheduleValid) {
      setError('Please go back and select a valid date/time as per doctor\'s schedule');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create appointment
      const appointmentRes = await createAppointment({
        doctorId: doctor.id,
        date: selectedDate,
        timeSlot: selectedTime,
        symptoms,
        amount: doctor.consultationFee || 500
      });
      
      const appointment = appointmentRes.data;
      
      // Create Razorpay order
      const orderRes = await createPaymentOrder(appointment.amount, appointment._id);
      
      // Load Razorpay
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Payment gateway failed to load');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'HealthAI',
        description: `Appointment with Dr. ${doctor.fullName}`,
        order_id: orderRes.data.orderId,
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            appointmentId: appointment._id
          });
          toast.success('Appointment booked successfully!');
          navigate('/patient/dashboard');
        },
        prefill: {
          name: patientName,
          email: patientEmail,
          contact: patientPhone
        },
        theme: { color: 'hsl(182, 100%, 37%)' }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const fee = doctor?.consultationFee || 500;
  const gst = Math.round(fee * 0.18);
  const total = fee + gst;
  
  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const isFormValid = patientName && patientEmail && patientPhone && isScheduleValid && !isCheckingSlot;

  return (
    <div className="min-h-screen bg-surface-soft py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
          <ChevronLeft size={16} /> Back
        </button>

        {/* ⚠️ Schedule Validation Error Banner */}
        {!isScheduleValid && !isCheckingSlot && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-medical flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Invalid Booking Request</p>
              <p className="text-sm text-red-600 mt-1">{validationMessage}</p>
              <button 
                onClick={() => navigate(`/doctor/${doctor?.id}`)} 
                className="mt-2 text-sm text-red-700 font-medium hover:underline"
              >
                ← Go back and select valid date/time
              </button>
            </div>
          </div>
        )}

        {/* Checking Slot Loading */}
        {isCheckingSlot && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-medical flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-600 border-t-transparent"></div>
            <p className="text-sm text-yellow-800">Verifying your selected slot...</p>
          </div>
        )}

        {/* Valid Slot Confirmation */}
        {isScheduleValid && !isCheckingSlot && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-medical flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Slot Available!</p>
              <p className="text-sm text-green-600">
                Your selected slot on {getDayName(selectedDate)}, {selectedDate} at {selectedTime} is available.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-medical shadow-card p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4 font-display">Complete Booking</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-medical">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)} 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input 
                  type="email" 
                  value={patientEmail} 
                  onChange={(e) => setPatientEmail(e.target.value)} 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                <input 
                  type="tel" 
                  value={patientPhone} 
                  onChange={(e) => setPatientPhone(e.target.value)} 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Symptoms (Optional)</label>
                <textarea 
                  rows="3" 
                  value={symptoms} 
                  onChange={(e) => setSymptoms(e.target.value)} 
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" 
                  placeholder="Describe your symptoms..." 
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-medical shadow-card p-6 h-fit sticky top-24">
            <h2 className="text-md font-semibold text-gray-800 mb-4">Booking Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <User size={14} /> Dr. {doctor?.fullName}
                {doctor?.isApproved && <span className="text-green-500 text-xs">✓ Verified</span>}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} /> {selectedDate} ({getDayName(selectedDate)})
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock size={14} /> {selectedTime}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={14} /> {doctor?.clinicAddress?.city || 'Online Consultation'}
              </div>
            </div>
            
            {/* Doctor's Schedule Info */}
            {doctorSchedule.length > 0 && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 font-medium">Doctor's Available Hours:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doctorSchedule.filter(s => s.isAvailable).map(slot => (
                    <span key={slot.day} className="text-xs text-gray-500">
                      {slot.day}: {slot.startTime}-{slot.endTime}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-100 mt-4 pt-3">
              <div className="flex justify-between text-sm">
                <span>Consultation Fee</span>
                <span>₹{fee}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>GST (18%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between text-md font-bold mt-2 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
            
            {/* Validation Status Indicator */}
            <div className="mt-3 text-center">
              {!isFormValid ? (
                <p className="text-xs text-amber-600 flex items-center justify-center gap-1">
                  <AlertCircle size={12} /> 
                  {!isScheduleValid ? 'Invalid slot selected' :
                   isCheckingSlot ? 'Verifying slot...' :
                   'Fill patient details'}
                </p>
              ) : (
                <p className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <CheckCircle size={12} /> Ready to book
                </p>
              )}
            </div>
            
            <button 
              onClick={handlePayment} 
              disabled={loading || !isFormValid || isCheckingSlot} 
              className={`w-full mt-3 py-2.5 rounded-medical text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isFormValid && !isCheckingSlot
                  ? 'bg-primary text-white hover:bg-primary-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : isCheckingSlot ? (
                'Verifying...'
              ) : (
                'Proceed to Pay'
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Shield size={12} /> Secure payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}