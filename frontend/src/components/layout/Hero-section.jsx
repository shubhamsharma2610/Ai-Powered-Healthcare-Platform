import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Stethoscope, ArrowRight, Sparkles, ShieldCheck, Cpu, Search } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <section className=" bg-gray-100 relative max-h-screen pt-14 pb-20 overflow-hidden bg-background-soft">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary-light/30 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light/50 text-primary font-bold text-[10px] uppercase tracking-widest mb-6 border border-primary/10"
            >
              <Sparkles size={14} />
              <span>Next-Gen Healthcare</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl lg:text-6xl font-display font-extrabold text-secondary leading-[1.1] mb-6"
            >
              Smart Diagnosis <br />
              <span className="text-primary text-4xl lg:text-5xl italic font-medium">Powered by Intelligence.</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-base text-gray-500 mb-10 max-w-lg leading-relaxed"
            >
              Upload your medical reports for an instant AI-driven analysis. 
              Get clear insights, share data securely with your doctor, and 
              take control of your health journey today.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/ai-assistant')}
                className="bg-primary text-white px-8 py-4 rounded-medical font-bold text-md shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all"
              >
                <Bot size={20} />
                AI Assistant
                <ArrowRight size={18} />
              </motion.button>

              <button 
                onClick={() => navigate('/patient/find-doctor')}
                className="bg-white text-secondary border border-gray-200 px-8 py-4 rounded-medical font-bold text-md hover:border-primary/30 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <Search size={20} />
                Find Doctors
              </button>
            </motion.div>
          </motion.div>

          {/* Right Side: Updated Image & Floating Mini Card */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Image Container with Custom Shape */}
            <div className="relative w-full max-w-[450px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-[10px] border-white">
              <img
                src="https://png.pngtree.com/png-vector/20250207/ourmid/pngtree-cybernetic-ai-assistant-realistic-robot-clipart-for-digital-use-png-image_15420290.png" 
                alt="AI Health Technology" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent" />
            </div>

            {/* Compact Floating AI Card */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 w-52"
            >
              <div className="p-2.5 bg-primary rounded-xl text-white shadow-md shadow-primary/30">
                <Cpu size={22} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-tighter leading-none">System Status</p>
                <p className="text-sm font-extrabold text-secondary">AI Analysis Live</p>
              </div>
            </motion.div>

            {/* Bottom Floating Success Card */}
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-8 right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-50 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs font-bold text-gray-600">Secure & Encrypted</span>
            </motion.div>

            {/* Background Circle Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border-2 border-primary/5 rounded-full -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;