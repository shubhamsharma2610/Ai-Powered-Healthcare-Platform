import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Stethoscope, UserCircle, Activity } from 'lucide-react';
import { register, clearError } from '../../../redux/slices/authSlice';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form fields - exactly as per backend models
  const [role, setRole] = useState('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // Doctor specific fields (from doctorSchema)
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Frontend validation
  const [localError, setLocalError] = useState('');

  // Redux state
  const { isLoading, isAuthenticated, error, role: userRole } = useSelector((state) => state.auth);

  // Redirect after successful registration
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    }
  }, [isAuthenticated, userRole, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');
    
    // Basic validations
    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all required fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    
    if (!agreed) {
      setLocalError('Please accept the Terms of Service.');
      return;
    }
    
    // Doctor validations
    if (role === 'doctor') {
      if (!licenseNumber || !specialization || !experience) {
        setLocalError('Doctor requires license number, specialization, and experience.');
        return;
      }
    }
    
    // Prepare data as per backend expectations
    const registerData = {
      fullName,
      email,
      password,
      confirmPassword,
      role
    };
    
    // Add doctor fields if role is doctor
    if (role === 'doctor') {
      registerData.licenseNumber = licenseNumber;
      registerData.specialization = specialization;
      registerData.experience = parseInt(experience);
      if (phoneNumber) registerData.phoneNumber = phoneNumber;
    }
    
    // Dispatch Redux action
    dispatch(register(registerData));
  };

  const pwStrength = password.length >= 10 ? 'Strong' : password.length >= 6 ? 'Fair' : 'Weak';
  const pwColor = password.length >= 10 ? 'bg-primary' : password.length >= 6 ? 'bg-yellow-400' : 'bg-accent';

  const inputCls = 'w-full pl-9 pr-3 py-2.5 text-[13px] text-gray-900 bg-white border border-gray-200 rounded-xl outline-none placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full mb-3">
          <Activity size={14} className="text-primary" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Get started free</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h2>
        <p className="text-sm text-gray-500">
          Already a member?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign in →
          </Link>
        </p>
      </div>

      {/* Role Toggle */}
      <div className="flex gap-2 mb-5 p-1 bg-gray-100 rounded-xl">
        {[
          { key: 'patient', label: 'Patient', Icon: UserCircle },
          { key: 'doctor', label: 'Doctor', Icon: Stethoscope },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setRole(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
              role === key
                ? 'bg-white text-primary shadow-sm'
                : 'bg-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Error Messages */}
      {(localError || error) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {localError || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                className={inputCls} 
                type="text" 
                placeholder="John Doe" 
                value={fullName} 
                onChange={e => setFullName(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                className={inputCls} 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Doctor Fields */}
        {role === 'doctor' && (
          <div className="space-y-3 border border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <p className="text-xs font-bold text-gray-600 uppercase">Doctor Details</p>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">License Number</label>
              <input 
                className={inputCls} 
                type="text" 
                placeholder="LIC-12345" 
                value={licenseNumber} 
                onChange={e => setLicenseNumber(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Specialization</label>
              <select 
                className={inputCls}
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
              >
                <option value="">Select Specialization</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Psychiatry">Psychiatry</option>
                <option value="Oncology">Oncology</option>
                <option value="ENT">ENT</option>
                <option value="Gynecology">Gynecology</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Experience (Years)</label>
                <input 
                  className={inputCls} 
                  type="number" 
                  placeholder="5" 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                <input 
                  className={inputCls} 
                  type="tel" 
                  placeholder="9876543210" 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={inputCls + ' pr-10'}
              type={showPw ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full ${password.length >= i * 2.5 ? pwColor : 'bg-gray-200'}`} />
              ))}
              <span className="text-[10px] text-gray-400 ml-1">{pwStrength}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Confirm Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className={inputCls + ' pr-10'}
              type={showCf ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button 
              type="button" 
              onClick={() => setShowCf(!showCf)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCf ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="terms" className="text-xs text-gray-500">
            I agree to the <Link to="/terms" className="text-primary font-semibold">Terms</Link> and{' '}
            <Link to="/privacy" className="text-primary font-semibold">Privacy Policy</Link>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Creating account...
            </>
          ) : (
            <>Create {role === 'doctor' ? 'Doctor' : 'Patient'} Account <ArrowRight size={16} /> </>
          )}
        </button>
      </form>
    </div>
  );
}