import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";

export default function MedicalReportAnalyzer() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate(); // ✅ Moved to top level - CORRECT

  const validateAndSet = (selectedFile) => {
    setError(null);
    
    // Validation
    if (selectedFile.size > 20 * 1024 * 1024) {
      setError("File size should be less than 20MB");
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF, JPG, and PNG files are allowed");
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSet(droppedFile);
  };

 const handleGenerate = () => {
  if (!file) return;
  setLoading(true);
  
  // Simulate API call

    
    navigate("/ai-result-upload"); 
    setLoading(false); // ✅ Forward slash is 
 
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      <div className="max-w-2xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-light/20 text-primary-dark text-xs font-medium px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Powered by Gemini AI
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 leading-tight">
            Upload your medical report
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto">
            AI-powered analysis — summary, diet plan, and specialist suggestions in seconds
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 mb-5 transition-all duration-300 hover:shadow-2xl">
          <div className="p-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current && fileRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                dragging
                  ? "border-primary bg-primary-light/20 scale-[1.02]"
                  : file
                  ? "border-green-400 bg-green-50/50"
                  : "border-gray-200 hover:border-primary hover:bg-primary-light/10"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndSet(e.target.files[0]);
                  }
                }}
              />

              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(1)} MB — Ready to analyze</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setError(null); }}
                    className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center transition-transform">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="hsl(182, 100%, 37%)" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 20MB</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-primary-light/20 hover:text-primary-dark transition-all">
                    Browse files
                  </span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl text-sm border border-red-100">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !file}
              className={`mt-6 w-full py-4 rounded-xl font-display font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300 ${
                file && !loading
                  ? "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darkest text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Analyzing report...
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generate AI Analysis
                </>
              )}
            </button>

            {/* Privacy Note */}
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Encrypted & deleted after analysis — 100% private
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { 
              icon: "⚡", 
              title: "Instant results", 
              desc: "Analysis in under 30 seconds",
              gradient: "from-yellow-500 to-orange-500"
            },
            { 
              icon: "🥗", 
              title: "Diet plan", 
              desc: "Personalized food recommendations",
              gradient: "from-green-500 to-emerald-500"
            },
            { 
              icon: "👨‍⚕️", 
              title: "Doctor suggestions", 
              desc: "Right specialist for your condition",
              gradient: "from-primary to-primary-dark"
            },
          ].map((item, idx) => (
            <div 
              key={item.title} 
              className="group bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              style={{
                animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              <div className={`text-3xl mb-3 inline-block p-3 rounded-2xl bg-gradient-to-br ${item.gradient} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}