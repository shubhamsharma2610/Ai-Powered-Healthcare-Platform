import React from 'react';

export default function ResultsDisplay({ results }) {
  if (!results) return null;

  return (
    <div className="bg-gray-900 p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-700 max-h-80 overflow-y-scroll animate-fade-in custom-scrollbar">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Analysis Complete</h3>
          <p className="text-gray-300 text-sm">AI-powered insights from your medical report</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white">Report Summary</h4>
        </div>
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-4 rounded-xl border border-blue-700">
          <p className="text-gray-200 leading-relaxed">{results.summary}</p>
        </div>
      </div>

      {/* Problems */}
      <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white">Identified Concerns</h4>
        </div>
        <div className="space-y-3">
          {results.problems.map((problem, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-orange-900 rounded-lg border border-orange-700 animate-slide-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
              <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></div>
              <p className="text-gray-200">{problem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-white">Doctor Recommendations</h4>
        </div>
        <div className="space-y-3">
          {results.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-green-900 rounded-lg border border-green-700 animate-slide-up" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
              <p className="text-gray-200">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600 animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <div className="flex items-start space-x-2">
          <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-300">
            <strong>Important:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider for proper diagnosis and treatment.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 #111827;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}