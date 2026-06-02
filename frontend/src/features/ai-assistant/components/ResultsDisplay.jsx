import { useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useEffect } from "react";
import { Loader2, Download, Upload, AlertCircle, CheckCircle, Activity, Stethoscope, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

const statusConfig = {
  normal: {
    label: "Normal",
    badge: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  warning: {
    label: "Borderline",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500",
  },
  critical: {
    label: "Critical",
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

const urgencyConfig = {
  routine: { label: "Routine visit", color: "text-green-600 bg-green-50" },
  soon: { label: "Visit soon", color: "text-yellow-600 bg-yellow-50" },
  urgent: { label: "Urgent", color: "text-red-600 bg-red-50" },
};

const overallConfig = {
  "Good": { color: "text-green-600", bg: "bg-green-50", icon: "✅" },
  "Fair": { color: "text-yellow-600", bg: "bg-yellow-50", icon: "⚠️" },
  "Needs Attention": { color: "text-orange-600", bg: "bg-orange-50", icon: "🔴" },
  "Critical": { color: "text-red-600", bg: "bg-red-50", icon: "🚨" },
};

export default function ReportResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showDownloadNotice, setShowDownloadNotice] = useState(true);

  const { result, fileName, fileSize } = location.state || {};

  useEffect(() => {
    if (!result) {
      navigate("/ai-upload-report");
      return;
    }
    setTimeout(() => setVisible(true), 100);
  }, [result, navigate]);

  const handleConsultDoctor = () => {
    // Extract suggested specialty from AI result
    const suggestedSpecialty = result?.suggestedSpecialists?.[0]?.type || "";
    navigate("/find-doctors", { state: { filterSpecialty: suggestedSpecialty } });
  };

  const handleDownload = () => {
    toast.success("Report downloaded successfully!");
    setShowDownloadNotice(false);
    setTimeout(() => {
      window.print(); // This opens print dialog for saving as PDF
    }, 500);
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your report results...</p>
        </div>
      </div>
    );
  }

  const reportData = result;
  const cfg = overallConfig[reportData.overallStatus] || overallConfig["Fair"];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
      
      {/* Download Notice Banner */}
      {showDownloadNotice && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-600 text-lg">⚠️</span>
              <p className="text-xs text-amber-700">Download this report — it will vanish after page refresh!</p>
            </div>
            <button 
              onClick={() => setShowDownloadNotice(false)}
              className="text-amber-500 hover:text-amber-700 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-light/20 flex items-center justify-center flex-shrink-0">
              <Activity size={28} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-base">{fileName || "Medical Report"}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {fileSize || "0"} MB · Analyzed just now
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <span className="text-2xl">{cfg.icon}</span>
              <div>
                <p className="text-xs text-gray-500">Overall Status</p>
                <p className={`text-sm font-bold ${cfg.color}`}>{reportData.overallStatus}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-light/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="hsl(182,100%,37%)">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">AI Summary</span>
            <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
              {reportData.overallStatus}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed bg-primary-light/10 rounded-xl px-5 py-4 border-l-4 border-primary">
            {reportData.summary || "Analysis completed. Please consult a doctor for detailed interpretation."}
          </p>
        </div>

        {/* Consult Doctor Button - NEW */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Stethoscope size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Need Professional Medical Advice?</h3>
                <p className="text-sm text-gray-500">Consult with our verified doctors for proper diagnosis and treatment</p>
              </div>
            </div>
            <button
              onClick={handleConsultDoctor}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all flex items-center gap-2 group"
            >
              Consult a Doctor
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Key Findings */}
        {reportData.keyFindings?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-semibold text-gray-800">Key Findings</span>
            </div>
            <div className="space-y-3">
              {reportData.keyFindings.map((finding, i) => {
                const sc = statusConfig[finding.status] || statusConfig.normal;
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary-light/5 transition-all">
                    <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${sc.dot}`} />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{finding.parameter}</span>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {finding.value} {finding.unit}
                        </span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.badge}`}>
                          {sc.label}
                        </span>
                      </div>
                      {finding.note && (
                        <p className="text-sm text-gray-500">{finding.note}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Diet Recommendations */}
        {(reportData.dietRecommendations?.include?.length > 0 || reportData.dietRecommendations?.avoid?.length > 0) && (
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-lg font-semibold text-gray-800">Diet Plan</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</span>
                  Include in diet
                </p>
                <div className="space-y-2">
                  {reportData.dietRecommendations.include.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 px-4 py-2 rounded-xl">
                      <span className="text-green-600 font-bold">+</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs">✗</span>
                  Avoid / reduce
                </p>
                <div className="space-y-2">
                  {reportData.dietRecommendations.avoid.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-red-50 px-4 py-2 rounded-xl">
                      <span className="text-red-600 font-bold">−</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lifestyle Advice */}
        {reportData.lifestyleAdvice?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-lg font-semibold text-gray-800">Lifestyle Advice</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportData.lifestyleAdvice.map((advice, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                  <span className="text-blue-500">💡</span>
                  <span className="text-sm text-gray-700">{advice}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Specialists */}
        {reportData.suggestedSpecialists?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-lg font-semibold text-gray-800">Suggested Specialists</span>
            </div>
            <div className="space-y-3">
              {reportData.suggestedSpecialists.map((doc, i) => {
                const ug = urgencyConfig[doc.urgency] || urgencyConfig.routine;
                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-primary-light/20 flex items-center justify-center flex-shrink-0">
                      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-800 text-base">{doc.type}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${ug.color}`}>{ug.label}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{doc.reason}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center bg-amber-50 p-3 rounded-xl">
              ⚠️ These are AI-generated suggestions — please consult a qualified doctor for final diagnosis and treatment plan.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pb-8">
          <button 
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]"
          >
            <Download size={18} />
            Download Report
          </button>
          <button
            onClick={() => navigate("/ai-upload-report")}
            className="flex-1 border border-gray-200 bg-white hover:border-primary hover:text-primary text-gray-600 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-md"
          >
            <Upload size={18} />
            Upload New Report
          </button>
        </div>
      </div>
    </div>
  );
}