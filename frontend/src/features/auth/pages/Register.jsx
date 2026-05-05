import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Stethoscope, UserCircle, Activity } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('patient');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[1.5rem] shadow-xl p-6 border border-gray-50 min-h-[60vh] flex flex-col justify-center"
      >
        <div className="text-center mb-5">
          <h2 className="text-2xl font-display font-extrabold text-secondary">Join Us</h2>
        </div>

        {/* Ultra-Compact Role Selection */}
        <div className="flex gap-3 mb-5">
          <button 
            onClick={() => setRole('patient')}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl border transition-all ${
              role === 'patient' ? 'border-primary bg-primary-light/10 text-primary font-bold' : 'border-gray-100 text-gray-400'
            }`}
          >
            <UserCircle size={18} />
            <span className="text-xs">Patient</span>
          </button>
          <button 
            onClick={() => setRole('doctor')}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl border transition-all ${
              role === 'doctor' ? 'border-primary bg-primary-light/10 text-primary font-bold' : 'border-gray-100 text-gray-400'
            }`}
          >
            <Stethoscope size={18} />
            <span className="text-xs">Doctor</span>
          </button>
        </div>

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="John" className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="email" placeholder="email@com" className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 text-xs" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input type="password" placeholder="Min. 8 characters" className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-primary/20 text-xs" />
            </div>
          </div>

          <button className="w-full bg-primary text-white py-3 mt-2 rounded-xl font-bold shadow-lg shadow-primary/10 hover:scale-[1.01] transition-all text-sm">
            Create {role === 'doctor' ? 'Doctor' : 'Patient'} Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-xs">
          Already a member? {' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;