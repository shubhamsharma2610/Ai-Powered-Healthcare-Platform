import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";

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
  "Good": { color: "text-green-600", bg: "bg-green-50", score: "text-green-600", ring: "stroke-green-500" },
  "Fair": { color: "text-yellow-600", bg: "bg-yellow-50", score: "text-yellow-600", ring: "stroke-yellow-500" },
  "Needs Attention": { color: "text-red-600", bg: "bg-red-50", score: "text-red-600", ring: "stroke-red-500" },
  "Critical": { color: "text-red-600", bg: "bg-red-50", score: "text-red-600", ring: "stroke-red-500" },
};

function ScoreRing({ score, status }) {
  const cfg = overallConfig[status] || overallConfig["Fair"];
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const strokeColor = {
    "Good": "#16a34a",
    "Fair": "#ca8a04",
    "Needs Attention": "#dc2626",
    "Critical": "#dc2626",
  }[status] || "#ca8a04";

  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="45" cy="45" r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="45" y="49" textAnchor="middle" fontSize="18" fontWeight="700" fill={strokeColor}>{score}</text>
      </svg>
      <span className={`text-xs font-semibold mt-1 ${cfg.color}`}>{status}</span>
    </div>
  );
}

export default function ReportResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const { result, fileName, fileSize } = location.state || {};

  useEffect(() => {
    console.log("Location state:", location.state);
    
    // Agar result nahi hai toh dummy data use karo (for testing)
    if (!result) {
      console.log("No state found, using dummy data");
      // Dummy data for testing - Jab tak API integrate nahi hoti
      const dummyData = {
        result: {
          overallScore: 85,
          overallStatus: "Good",
          patientSummary: "Your medical report shows healthy parameters. Keep maintaining your current lifestyle and regular checkups.",
          keyFindings: [
            { parameter: "Hemoglobin", value: "14.2 g/dL", status: "normal", note: "Within normal range" },
            { parameter: "Blood Sugar (Fasting)", value: "110 mg/dL", status: "warning", note: "Slightly elevated, consider reducing sugar intake" },
            { parameter: "Total Cholesterol", value: "180 mg/dL", status: "normal", note: "Healthy range" },
            { parameter: "Blood Pressure", value: "120/80 mmHg", status: "normal", note: "Optimal range" },
            { parameter: "Vitamin D", value: "28 ng/mL", status: "warning", note: "Mild deficiency, consider supplements" }
          ],
          dietRecommendations: {
            include: ["Leafy greens (spinach, kale)", "Whole grains (oats, brown rice)", "Lean proteins (chicken, fish)", "Nuts and seeds", "Fruits rich in Vitamin C"],
            avoid: ["Processed sugar", "Fried foods", "Excess salt", "Red meat", "Carbonated drinks"]
          },
          lifestyleAdvice: ["Exercise 30 mins daily", "Drink 8-10 glasses of water", "Sleep 7-8 hours", "Reduce stress with meditation", "Avoid smoking/alcohol"],
          suggestedSpecialists: [
            { type: "General Physician", urgency: "routine", reason: "Regular health checkup recommended" },
            { type: "Dietitian/Nutritionist", urgency: "soon", reason: "For personalized diet plan to manage blood sugar" },
            { type: "Cardiologist", urgency: "routine", reason: "Preventive heart health assessment" }
          ]
        },
        fileName: "Medical_Report.pdf",
        fileSize: "2.4"
      };
      
      // Set dummy data as state
      setTimeout(() => {
        setLoading(false);
        setVisible(true);
      }, 500);
      return;
    }
    
    setLoading(false);
    setTimeout(() => setVisible(true), 100);
  }, [result, location.state]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your report results...</p>
        </div>
      </div>
    );
  }

  // Use actual result or dummy data
  const reportData = result || {
    overallScore: 85,
    overallStatus: "Good",
    patientSummary: "Your medical report shows healthy parameters. Keep maintaining your current lifestyle and regular checkups.",
    keyFindings: [
      { parameter: "Hemoglobin", value: "14.2 g/dL", status: "normal", note: "Within normal range" },
      { parameter: "Blood Sugar (Fasting)", value: "110 mg/dL", status: "warning", note: "Slightly elevated" }
    ],
    dietRecommendations: {
      include: ["Leafy greens", "Whole grains", "Lean proteins"],
      avoid: ["Processed sugar", "Fried foods"]
    },
    lifestyleAdvice: ["Exercise daily", "Drink water", "Sleep well"],
    suggestedSpecialists: [
      { type: "General Physician", urgency: "routine", reason: "Regular checkup" }
    ]
  };

  const reportFileName = fileName || "Medical_Report.pdf";
  const reportFileSize = fileSize || "2.4";
  const cfg = overallConfig[reportData.overallStatus] || overallConfig["Fair"];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}>
     
     
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary-light/20 flex items-center justify-center flex-shrink-0">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{reportFileName}</p>
            <p className="text-xs text-gray-400 mt-0.5">{reportFileSize} MB &nbsp;·&nbsp; Analyzed just now &nbsp;·&nbsp; {reportData.keyFindings?.length || 0} parameters checked</p>
          </div>
          <ScoreRing score={reportData.overallScore || 0} status={reportData.overallStatus} />
        </div>

        {/* AI Summary */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-primary-light/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="hsl(182,100%,37%)">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-800">AI Summary</span>
            <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
              {reportData.overallStatus}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed bg-primary-light/10 rounded-xl px-4 py-3 border-l-4 border-primary">
            {reportData.patientSummary}
          </p>
        </div>

        {/* Key Findings */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">Key Findings</span>
          </div>
          <div className="space-y-2">
            {reportData.keyFindings?.map((finding, i) => {
              const sc = statusConfig[finding.status] || statusConfig.normal;
              return (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary-light/5 transition-all">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${sc.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-800">{finding.parameter}</span>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">{finding.value}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.badge}`}>
                        {sc.label}
                      </span>
                    </div>
                    {finding.note && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{finding.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Diet Recommendations */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">Diet Plan</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</span>
                Include in diet
              </p>
              <div className="space-y-1.5">
                {reportData.dietRecommendations?.include?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-green-50 px-3 py-2 rounded-xl">
                    <span className="text-green-600 font-bold">+</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">✗</span>
                Avoid / reduce
              </p>
              <div className="space-y-1.5">
                {reportData.dietRecommendations?.avoid?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-red-50 px-3 py-2 rounded-xl">
                    <span className="text-red-600 font-bold">−</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          {reportData.lifestyleAdvice?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-600 mb-2">Lifestyle tips</p>
              <div className="flex flex-wrap gap-2">
                {reportData.lifestyleAdvice.map((tip, i) => (
                  <span key={i} className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200">
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggested Specialists */}
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-semibold text-gray-800">Suggested Specialists</span>
          </div>
          <div className="space-y-3">
            {reportData.suggestedSpecialists?.map((doc, i) => {
              const ug = urgencyConfig[doc.urgency] || urgencyConfig.routine;
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary-light/20 flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="hsl(182,100%,37%)" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">{doc.type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ug.color}`}>{ug.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{doc.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center bg-amber-50 p-2 rounded-xl">
            ⚠️ Yeh AI suggestions hain — final diagnosis ke liye doctor se milein.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <button className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darkest text-white py-3.5 rounded-xl font-display font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02]">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Report
          </button>
          <button
            onClick={() => navigate("/ai-upload-report")}
            className="flex-1 border border-gray-200 bg-white hover:border-primary hover:text-primary text-gray-600 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-md"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Upload New Report
          </button>
        </div>
      </div>
    </div>
  );
}