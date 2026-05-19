import React from "react";

export default function AdminDoctors() {
  const [doctors] = React.useState([
    { id: 1, name: "Dr. Singh", email: "dr.singh@email.com", specialization: "Neurologist", experience: "8 years", approvedOn: "2024-01-10", status: "active" },
    { id: 2, name: "Dr. Verma", email: "dr.verma@email.com", specialization: "Orthopedic", experience: "6 years", approvedOn: "2024-01-09", status: "active" },
    { id: 3, name: "Dr. Sharma", email: "dr.sharma@email.com", specialization: "Cardiologist", experience: "10 years", approvedOn: "2024-01-05", status: "active" },
  ]);

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Doctors</h1>
      <p className="text-gray-500 text-sm mb-6">View all approved doctors on the platform</p>

      <div className="mb-4">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Total Doctors: {doctors.length}
        </span>
      </div>

      {/* Responsive Grid - 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                  <p className="text-xs text-gray-500">{doctor.specialization}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">active</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📧</span>
                <span className="text-gray-600 text-xs truncate">{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🎓</span>
                <span className="text-gray-600 text-xs">{doctor.experience}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
              <button className="flex-1 px-2 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100">
                View Details
              </button>
              <button className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}