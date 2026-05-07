import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsDisplay from '../components/ResultsDisplay';

function AiAssistant() {
  const [analysisResults, setAnalysisResults] = useState(null);

  const handleFileUpload = (results) => {
    setAnalysisResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-4 lg:pb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-5 lg:mb-6 shadow-lg">
              <svg className="w-8 h-8 lg:w-10 lg:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-3 lg:mb-4 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-snug">
              AI Health Assistant
            </h1>
            <p className="text-gray-600 text-base lg:text-lg xl:text-xl max-w-3xl mx-auto leading-relaxed px-4 font-medium">
              Upload your medical report and get instant AI-powered analysis with personalized doctor recommendations
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 xl:gap-10">
          {/* Upload Section */}
          <div className="order-2 xl:order-1">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* Results Section */}
          <div className="order-1 xl:order-2">
            {analysisResults ? (
              <ResultsDisplay results={analysisResults} />
            ) : (
                <div className="bg-white p-6 lg:p-8 xl:p-10 rounded-2xl shadow-lg border border-gray-100 text-center h-full flex flex-col justify-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2 lg:mb-3">Analysis Results</h3>
                  <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                  Upload a medical report to see AI-powered insights, identified concerns, and personalized recommendations here
                </p>
                  <div className="mt-4 lg:mt-6 flex justify-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Simple steps to get AI-powered medical insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Report</h3>
              <p className="text-gray-600">Upload your PDF medical report or health image securely</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Advanced AI processes your report and identifies key insights</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Get Recommendations</h3>
              <p className="text-gray-600">Receive personalized doctor suggestions and next steps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiAssistant;




