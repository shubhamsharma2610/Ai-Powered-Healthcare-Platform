import React from "react";

import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: "shield", target: 94, suffix: "%", label: "Diagnostic Accuracy", badge: "AI Verified", bar: 94 },
  { icon: "users", target: 2, suffix: "M+", label: "Patients Served", badge: "& Growing", bar: 80 },
  { icon: "stethoscope", target: 500, suffix: "+", label: "Partner Doctors", badge: "Verified MDs", bar: 65 },
  { icon: "clock", target: 30, suffix: "sec", label: "Avg Response Time", badge: "Realtime AI", bar: 55 },
];
 function StatsBar() {
  const [counts, setCounts] = useState(stats.map(() => 0));
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    stats.forEach((stat, i) => {
      let start = null;
      const animate = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCounts(prev => { const n = [...prev]; n[i] = Math.round(eased * stat.target); return n; });
        if (p < 1) requestAnimationFrame(animate);
      };
      setTimeout(() => requestAnimationFrame(animate), i * 130);
    });
  }, [visible]);

  return (
    <section className="bg-gray-100   py-20 px-12 relative overflow-hidden">
      {/* heading */}
      <div className="text-center mb-14">
        <p className="text-primary text-xs font-semibold tracking-[3px] uppercase mb-3">Trusted Globally</p>
        <h2 className="font-display text-4xl font-extrabold text-secondary">
          Numbers That <span className="text-primary">Speak for Themselves</span>
        </h2>
      </div>
      {/* grid */}
      <div ref={ref} className="grid grid-cols-4 rounded-2xl overflow-hidden border border-primary/10" style={{background:'rgba(255,255,255,0.04)'}}>
        {stats.map((s, i) => (
          <div key={i} className={`p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-primary/5 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
            <div className="w-13 h-13 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center mx-auto mb-5">
              {/* swap with your icon library */}
            </div>
            <div className="font-display text-5xl font-black text-secondary tracking-tight mb-1">
              {counts[i]}<span className="text-primary text-4xl">{s.suffix}</span>
            </div>
            <p className="text-secondary text-sm font-medium mb-3">{s.label}</p>
            <div className="h-[3px] bg-white/10 rounded-full mx-auto w-3/5 overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-[1600ms]"
                style={{ width: visible ? `${s.bar}%` : '0%' }} />
            </div>
            <span className="inline-block mt-3 text-[11px] font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {s.badge}
            </span>
          </div>
        ))}
      </div>
      {/* trust pills */}
      <div className="flex items-center justify-center gap-8 mt-10 text-secondary text-sm">
        {["HIPAA Compliant","ISO 27001 Certified","Available 24/7","20+ Languages"].map((t,i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"/>
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

export default StatsBar