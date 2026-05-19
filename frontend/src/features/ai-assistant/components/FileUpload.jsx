import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Upload, FileText, Zap, Utensils, Stethoscope, X, Loader2, Shield, Sparkles } from "lucide-react";

export default function MedicalReportAnalyzer() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const validateAndSet = (selectedFile) => {
    setError(null);
    
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
    setTimeout(() => {
      navigate("/ai-result-upload");
      setLoading(false);
    }, 1500);
  };

  const features = [
    { icon: Zap, title: "Instant results", desc: "Analysis in under 30 seconds", color: "text-yellow-500" },
    { icon: Utensils, title: "Diet plan", desc: "Personalized recommendations", color: "text-green-500" },
    { icon: Stethoscope, title: "Doctor suggestions", desc: "Right specialist for you", color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-light/20 text-primary-dark text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={12} className="text-primary" />
            Powered by AI
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Upload Medical Report
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Get AI-powered analysis, diet plan, and specialist suggestions in seconds
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="p-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragging ? "border-primary bg-primary-light/10 scale-[1.01]" :
                file ? "border-green-400 bg-green-50" :
                "border-gray-200 hover:border-primary hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
              />

              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <FileText size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{file.name}</p>
                    <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setError(null); }}
                    className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary-light/20 flex items-center justify-center">
                    <Upload size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — max 20MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !file}
              className={`mt-5 w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                file && !loading
                  ? "bg-primary text-white hover:bg-primary-dark hover:scale-[1.01] active:scale-[0.99]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate AI Analysis
                </>
              )}
            </button>

            {/* Privacy */}
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <Shield size={12} />
              Encrypted & private — deleted after analysis
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {features.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5">
              <item.icon size={28} className={`mx-auto mb-2 ${item.color}`} />
              <p className="text-sm font-semibold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}