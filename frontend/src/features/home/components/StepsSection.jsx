import React from "react";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    title: "Upload Your Report",
    description:
      "Securely upload your medical report in any format — PDF, image scan, or plain text.",
    tags: ["PDF", "JPG / PNG", "Text"],
    color: "#00BFBF",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our AI reads your report instantly and generates a clear summary with key findings and diagnosis hints.",
    tags: ["Instant Summary", "Key Findings", "Risk Flags"],
    color: "#2a6f7c",
  },
  {
    number: "03",
    title: "Find the Right Doctor",
    description:
      "We recommend the most relevant specialists based on your report and help you book a consultation.",
    tags: ["Specialist Match", "Book Appointment", "Verified Doctors"],
    color: "#ff6b6b",
  },
];

 function StepsSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-20 px-4 bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full bg-[hsl(182,100%,92%)] text-[hsl(182,100%,25%)] mb-4">
            Simple 3-Step Process
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            How It <span className="text-[hsl(182,100%,37%)]">Works</span>
          </h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            From report to specialist in under 60 seconds — no medical knowledge required.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms`, transitionDuration: "600ms" }}
            >
              {/* Big number watermark */}
              <span
                className="absolute top-4 right-5 text-6xl font-bold select-none pointer-events-none"
                style={{ color: step.color, opacity: 0.1 }}
              >
                {step.number}
              </span>

              {/* Step badge */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-4"
                style={{ background: step.color }}
              >
                {step.number}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{step.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{
                      background: `${step.color}18`,
                      color: step.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{ background: step.color }}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-12 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <button
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: "hsl(182,100%,37%)" }}
          >
            Upload Your Report Now
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
export default StepsSection;  