import React, { useState } from "react";
import { Icon, icons } from "./shared/Icon";

// Mock Data (Baad mein API se aayega)
const patientProfileData = {
  personal: {
    name: "Rahul Sharma",
    id: "P10024",
    avatar: "RS",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    dob: "15 May 1990",
    bloodGroup: "O+",
    gender: "Male",
    address: "Sector 62, Noida, UP - 201301"
  },
  medicalHistory: {
    conditions: ["Hypertension", "Type 2 Diabetes"],
    allergies: ["Penicillin", "Dust"],
    surgeries: ["None"],
    familyHistory: ["Father: Diabetes", "Mother: Hypertension"]
  },
  stats: {
    totalAppointments: 24,
    pendingReports: 2,
    upcomingAppointments: 3,
    healthScore: 87
  },
  emergency: {
    name: "Parul Sharma",
    phone: "+91 98765 12345",
    relation: "Wife"
  },
  paymentMethods: [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/25" }
  ],
  recentReports: [
    { id: 1, name: "Blood Test Report", date: "Mar 15, 2024", status: "Normal", doctor: "Dr. Priya" },
    { id: 2, name: "Lipid Profile", date: "Feb 28, 2024", status: "Borderline", doctor: "Dr. Arjun" }
  ],
  recentAppointments: [
    { id: 1, doctor: "Dr. Priya Sharma", date: "Mar 10, 2024", type: "video", amount: "₹800" },
    { id: 2, doctor: "Dr. Arjun Mehta", date: "Feb 25, 2024", type: "in-person", amount: "₹1200" }
  ]
};

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState("overview");
  const { personal, medicalHistory, stats, emergency, paymentMethods, recentReports, recentAppointments } = patientProfileData;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-['Outfit']">
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal information and health records
          </p>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">Appointments</div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalAppointments}</div>
            <div className="text-xs text-green-600 mt-1">+3 this month</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">Pending Reports</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{stats.pendingReports}</div>
            <div className="text-xs text-gray-400 mt-1">Need attention</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">Upcoming</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.upcomingAppointments}</div>
            <div className="text-xs text-gray-400 mt-1">Appointments</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-4 shadow-sm">
            <div className="text-xs text-gray-400 mb-1">Health Score</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">{stats.healthScore}</div>
            <div className="text-xs text-emerald-600 mt-1">↑ 4 points</div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          
          {/* Cover & Avatar Section */}
          <div className="relative">
            <div className="h-24 sm:h-32 bg-gradient-to-r from-teal-400 to-teal-600"></div>
            <div className="px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                  {personal.avatar}
                </div>
                <div className="flex-1 sm:pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{personal.name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>ID: {personal.id}</span>
                    <span>•</span>
                    <span>{personal.bloodGroup}</span>
                    <span>•</span>
                    <span>{personal.gender}</span>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-600 rounded-xl text-sm font-medium hover:bg-teal-100 transition-colors">
                  <Icon d={icons.edit} size={16} stroke="currentColor" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-4 sm:px-6">
            <div className="flex gap-6 overflow-x-auto">
              {["overview", "medical", "reports", "payments"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "text-teal-600 border-b-2 border-teal-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "overview" && "Overview"}
                  {tab === "medical" && "Medical History"}
                  {tab === "reports" && "Reports"}
                  {tab === "payments" && "Payments"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Personal Info Grid */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <div className="text-xs text-gray-400">Email</div>
                      <div className="text-sm font-medium text-gray-800">{personal.email}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <div className="text-xs text-gray-400">Phone</div>
                      <div className="text-sm font-medium text-gray-800">{personal.phone}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <div className="text-xs text-gray-400">Date of Birth</div>
                      <div className="text-sm font-medium text-gray-800">{personal.dob}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 sm:col-span-2 lg:col-span-3">
                      <div className="text-xs text-gray-400">Address</div>
                      <div className="text-sm font-medium text-gray-800">{personal.address}</div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-red-400">Contact Name</div>
                        <div className="text-sm font-medium text-gray-800">{emergency.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-red-400">Phone</div>
                        <div className="text-sm font-medium text-gray-800">{emergency.phone}</div>
                      </div>
                      <div>
                        <div className="text-xs text-red-400">Relationship</div>
                        <div className="text-sm font-medium text-gray-800">{emergency.relation}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Appointments */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Appointments</h3>
                    <button className="text-xs text-teal-600 font-medium">View All →</button>
                  </div>
                  <div className="space-y-2">
                    {recentAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{apt.doctor}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{apt.date} • {apt.type}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{apt.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MEDICAL HISTORY TAB */}
            {activeTab === "medical" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.conditions.map((condition, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Allergies</h3>
                  <div className="flex flex-wrap gap-2">
                    {medicalHistory.allergies.map((allergy, i) => (
                      <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Surgeries</h3>
                  <p className="text-sm text-gray-600">{medicalHistory.surgeries.join(", ")}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Family History</h3>
                  <div className="space-y-1">
                    {medicalHistory.familyHistory.map((history, i) => (
                      <p key={i} className="text-sm text-gray-600">{history}</p>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 bg-teal-50 text-teal-600 rounded-xl font-medium text-sm hover:bg-teal-100 transition">
                  + Add Medical Record
                </button>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === "reports" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Uploaded Reports</h3>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition">
                    <Icon d={icons.plus} size={14} stroke="white" />
                    Upload New
                  </button>
                </div>

                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-sm transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Icon d={icons.fileText} size={18} stroke="currentColor" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{report.name}</div>
                        <div className="text-xs text-gray-400">{report.date} • Dr. {report.doctor}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === "Normal" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                      }`}>
                        {report.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Icon d={icons.download} size={16} stroke="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Payment Methods</h3>
                    <button className="text-xs text-teal-600 font-medium">+ Add New</button>
                  </div>
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                          💳
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{method.type} •••• {method.last4}</div>
                          <div className="text-xs text-gray-400">Expires {method.expiry}</div>
                        </div>
                      </div>
                      <button className="text-red-500 text-sm">Remove</button>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Transaction History</h3>
                  <div className="space-y-2">
                    {recentAppointments.map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{apt.doctor}</div>
                          <div className="text-xs text-gray-400">{apt.date} • {apt.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{apt.amount}</div>
                          <div className="text-xs text-green-600">Completed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}