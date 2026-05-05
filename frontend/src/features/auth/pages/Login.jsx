import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-soft px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-white rounded-[1.5rem] shadow-xl p-6 border border-gray-100 flex flex-col justify-center min-h-[55vh]"
      >
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2 bg-primary-light rounded-xl mb-3">
            <Activity className="text-primary" size={24} />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-secondary">Welcome</h2>
          <p className="text-xs text-gray-400 mt-1">Manage your health insights</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-primary/30 transition-all outline-none text-sm text-secondary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-primary/30 transition-all outline-none text-sm text-secondary"
              />
            </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group text-sm"
          >
            Sign In
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-[11px]">
          Don't have an account? {' '}
          <Link to="/signup" className="text-primary font-bold hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;