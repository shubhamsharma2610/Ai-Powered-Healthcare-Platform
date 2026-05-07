import React, { useState, useRef } from 'react';

export default function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // --- Logic (Exactly same as your original) ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
      if (allowedTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
      } else {
        alert('Please upload only PDF or image files');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      const mockResponse = {
        summary: "Your report shows normal blood pressure and cholesterol levels.",
        problems: ["Mild vitamin D deficiency"],
        suggestions: ["Increase sun exposure", "Take vitamin D supplements"]
      };
      onFileUpload(mockResponse);
      setUploading(false);
    }, 2000);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- Professional Enhanced UI ---
  return (
    <div className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col gap-5">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Medical Report</h3>
          <p className="text-gray-600 text-sm">PDF or image files supported</p>
        </div>

        {/* Enhanced Dropzone */}
        <div
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-xl px-5 py-6 transition-all cursor-pointer text-center
            ${dragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/30'}
            ${file ? 'border-green-400 bg-green-50' : ''}`}
        >
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
          
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800 mb-1">File Selected</p>
                <p className="text-xs text-gray-600 truncate max-w-[180px]">{file.name}</p>
              </div>
              <button onClick={removeFile} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-medium transition-colors">
                Remove File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-base font-semibold text-gray-700 mb-1">Drop your file here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload Button */}
        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-2.5 px-5 rounded-xl font-semibold text-white transition-all duration-300
              ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing Report...
              </div>
            ) : (
              'Analyze Report'
            )}
          </button>
        )}
      </div>
    </div>
  );
} 