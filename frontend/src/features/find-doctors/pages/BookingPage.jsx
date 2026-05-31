import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, Calendar, Clock, User, MapPin, DollarSign, Shield } from 'lucide-react';
import { createAppointment, createPaymentOrder, verifyPayment } from '../services/bookingApi';

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

  useEffect(() => {
    if (!doctor || !selectedDate || !selectedTime) {
      navigate('/find-doctors');
    }
  }, [doctor, selectedDate, selectedTime, navigate]);

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
        description: `Appointment with ${doctor.fullName}`,
        order_id: orderRes.data.orderId,
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            appointmentId: appointment._id
          });
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

  return (
    <div className="min-h-screen bg-surface-soft py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
          <ChevronLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-medical shadow-card p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4 font-display">Complete Booking</h1>
            
            {error && (
              <div className="mb-4 p-3 bg-danger-light text-danger text-sm rounded-medical">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                <input type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Symptoms (Optional)</label>
                <textarea rows="3" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-medical focus:outline-none focus:border-primary" placeholder="Describe your symptoms..." />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-medical shadow-card p-6 h-fit sticky top-24">
            <h2 className="text-md font-semibold text-gray-800 mb-4">Booking Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-500"><User size={14} /> {doctor?.fullName}</div>
              <div className="flex items-center gap-2 text-gray-500"><Calendar size={14} /> {selectedDate}</div>
              <div className="flex items-center gap-2 text-gray-500"><Clock size={14} /> {selectedTime}</div>
              <div className="flex items-center gap-2 text-gray-500"><MapPin size={14} /> {doctor?.clinicAddress?.city || 'Online'}</div>
            </div>
            <div className="border-t border-gray-100 mt-4 pt-3">
              <div className="flex justify-between text-sm"><span>Consultation Fee</span><span>₹{fee}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>GST (18%)</span><span>₹{gst}</span></div>
              <div className="flex justify-between text-md font-bold mt-2 pt-2 border-t border-gray-100"><span>Total</span><span className="text-primary">₹{total}</span></div>
            </div>
            <button onClick={handlePayment} disabled={loading} className="w-full mt-5 py-2.5 bg-primary text-white rounded-medical text-sm font-medium hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : 'Proceed to Pay'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1"><Shield size={12} /> Secure payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}