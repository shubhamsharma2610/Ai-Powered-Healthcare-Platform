import React from "react"

import { useState } from "react";

export default function AdminRequests() {
  const [requests, setRequests] = useState([
    { id: 1, name: "Dr. Sharma", email: "dr.sharma@email.com", phone: "+91 98765 43210", specialization: "Cardiologist", experience: "8 years", appliedOn: "2024-01-15" },
    { id: 2, name: "Dr. Patel", email: "dr.patel@email.com", phone: "+91 98765 43211", specialization: "Dermatologist", experience: "5 years", appliedOn: "2024-01-14" },
  ]);

  const [message, setMessage] = useState("");

  const handleApprove = (doctor) => {
    setRequests(requests.filter(r => r.id !== doctor.id));
    setMessage(`${doctor.name} approved successfully!`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReject = (id, name) => {
    setRequests(requests.filter(r => r.id !== id));
    setMessage(`${name} request rejected!`);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Doctor Requests</h1>
      <p className="text-gray-500 text-sm mb-6">Approve or reject new doctor registrations</p>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {message}
        </div>
      )}

      <div className="mb-4">
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          {requests.length} Pending Requests
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Pending Requests</h3>
          <p className="text-sm text-gray-500">All doctor requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{doctor.name}</h3>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">Pending</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📧</span>
                      <span className="text-gray-600 text-xs sm:text-sm break-all">{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📞</span>
                      <span className="text-gray-600 text-xs sm:text-sm">{doctor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🎓</span>
                      <span className="text-gray-600 text-xs sm:text-sm">{doctor.specialization}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📅</span>
                      <span className="text-gray-600 text-xs sm:text-sm">{doctor.experience} experience</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(doctor)}
                    className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleReject(doctor.id, doctor.name)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}