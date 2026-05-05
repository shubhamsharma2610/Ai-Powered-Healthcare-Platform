import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Sparkles, ShieldCheck, Cpu, Search, Activity } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: "easeOut" }
  };

  return (
    <section className="relative min-h-screen bg-gray-100 pt-16 pb-16 md:pt-20 md:pb-24 overflow-hidden flex items-center">

      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-8%] right-[-8%] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] md:w-[560px] md:h-[560px] rounded-full bg-[hsl(182,100%,37%)]/10 blur-[120px]" />
        <div className="absolute bottom-[5%] left-[-4%] w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full bg-[#2a6f7c]/8 blur-[90px]" />
        <div className="absolute top-[40%] left-[30%] w-[160px] h-[160px] rounded-full bg-[hsl(182,100%,37%)]/5 blur-[60px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(hsl(182,100%,37%) 1px, transparent 1px), linear-gradient(90deg, hsl(182,100%,37%) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center">

          {/* ── Left: Content ── */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.13 } } }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 text-[11px] font-bold uppercase tracking-widest"
              style={{
                background: 'hsl(182,100%,92%)',
                borderColor: 'hsl(182,100%,75%)',
                color: 'hsl(182,100%,25%)',
              }}
            >
              <Sparkles size={13} />
              Next-Gen Healthcare Platform
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="font-display font-extrabold text-[#1a3a4a] leading-[1.08] mb-5"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-[64px]">
                Smart Diagnosis
              </span>
              <span
                className="block text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-medium italic mt-1"
                style={{ color: 'hsl(182,100%,37%)' }}
              >
                Powered by Intelligence.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-gray-500 text-base sm:text-[17px] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Upload your medical reports for an instant AI-driven analysis.
              Get clear insights, share data securely with your doctor, and
              take control of your health journey today.
            </motion.p>

            {/* Trust line */}
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center lg:justify-start gap-5 mb-8"
            >
              {["HIPAA Compliant", "256-bit Encrypted", "24/7 Available"].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'hsl(182,100%,37%)' }} />
                  {t}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/ai-assistant')}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white text-sm sm:text-base transition-all duration-200"
                style={{
                  background: 'hsl(182,100%,37%)',
                  boxShadow: '0 6px 28px -4px hsl(182,100%,37%,0.45)',
                }}
              >
                <Bot size={19} />
                AI Assistant
                <ArrowRight size={17} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/patient/find-doctor')}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base border-2 bg-white transition-all duration-200 hover:bg-[hsl(182,100%,97%)]"
                style={{
                  borderColor: 'hsl(182,100%,75%)',
                  color: '#2a6f7c',
                }}
              >
                <Search size={19} />
                Find Doctors
              </motion.button>
            </motion.div>
          </motion.div>

          {/* ── Right: Image & Floating Cards ── */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-20 -z-10"
              style={{ background: 'hsl(182,100%,37%)' }}
            />

            {/* Main image */}
            <div
              className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[460px] aspect-square rounded-3xl overflow-hidden shadow-2xl"
              style={{ border: '10px solid white' }}
            >
              <img
                src="https://png.pngtree.com/png-vector/20250207/ourmid/pngtree-cybernetic-ai-assistant-realistic-robot-clipart-for-digital-use-png-image_15420290.png"
                alt="AI Health Technology"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(42,111,124,0.35), transparent)' }}
              />
            </div>

            {/* Floating card — top left: AI Status */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 w-48 sm:w-52"
            >
              <div
                className="p-2.5 rounded-xl text-white shrink-0 shadow-md"
                style={{ background: 'hsl(182,100%,37%)', boxShadow: '0 4px 12px hsl(182,100%,37%,0.35)' }}
              >
                <Cpu size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-tight leading-none mb-0.5" style={{ color: 'hsl(182,100%,37%)' }}>
                  System Status
                </p>
                <p className="text-sm font-extrabold text-[#1a3a4a]">AI Analysis Live</p>
              </div>
            </motion.div>

            {/* Floating card — bottom right: Secure */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-6 right-2 sm:-right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                <ShieldCheck size={17} />
              </div>
              <span className="text-xs font-bold text-gray-600 whitespace-nowrap">Secure & Encrypted</span>
            </motion.div>

            {/* Floating card — mid left: Live pulse */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[42%] -left-4 sm:-left-10 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2.5"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'hsl(182,100%,92%)', color: 'hsl(182,100%,37%)' }}
              >
                <Activity size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-medium leading-none mb-0.5">Reports Analyzed</p>
                <p className="text-sm font-extrabold text-[#1a3a4a]">2M+ Reports</p>
              </div>
            </motion.div>

            {/* Decorative ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] border border-dashed rounded-full -z-10 opacity-30"
              style={{ borderColor: 'hsl(182,100%,37%)' }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;