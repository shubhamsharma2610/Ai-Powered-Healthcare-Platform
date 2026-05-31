import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientProfile, updatePatientProfile } from '../../../redux/slices/patientSlice';
import { Icon, icons } from './shared/Icon';
import { toast } from 'react-hot-toast';

export default function ProfileSection() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    bloodType: '',
    phoneNumber: '',
    emergencyContact: { name: '', phone: '', relation: '' }
  });

  useEffect(() => {
    dispatch(fetchPatientProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile?.age || '',
        gender: profile?.gender || '',
        bloodType: profile?.bloodType || '',
        phoneNumber: profile?.phoneNumber || user?.phoneNumber || '',
        emergencyContact: profile?.emergencyContact || { name: '', phone: '', relation: '' }
      });
    }
  }, [profile, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('emergency')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(updatePatientProfile(formData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      dispatch(fetchPatientProfile());
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const fullName = user?.fullName || 'Patient';
  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  const patientId = profile?._id?.slice(-8) || 'N/A';
  const bloodGroup = profile?.bloodType || 'Not recorded';
  const gender = profile?.gender || 'Not specified';
  const age = profile?.age || '—';
  const phoneNumber = formData.phoneNumber || profile?.phoneNumber || 'Not provided';
  const email = user?.email || 'Not provided';
  const address = profile?.address || profile?.clinicAddress?.city || 'Not provided';
  
  const stats = {
    totalAppointments: profile?.appointmentCount || 0,
    pendingReports: profile?.pendingReports || 0,
    upcomingAppointments: profile?.upcomingAppointments || 0,
    healthScore: profile?.healthScore || 85
  };
  
  const medicalHistory = {
    conditions: profile?.medicalHistory?.filter(h => h.status === 'active').map(h => h.condition) || [],
    allergies: profile?.allergies?.map(a => a.substance) || [],
    familyHistory: profile?.familyHistory || []
  };
  
  const emergency = profile?.emergencyContact || { name: 'Not set', phone: 'Not set', relation: 'Not set' };
  const recentReports = profile?.recentReports || [];
  const recentAppointments = profile?.recentAppointments || [];

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
            <div className="text-xs text-green-600 mt-1">Total visits</div>
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
            <div className="text-xs text-emerald-600 mt-1">Good</div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          
          {/* Cover & Avatar Section */}
          <div className="relative">
            <div className="h-24 sm:h-32 bg-gradient-to-r from-primary to-primary-dark"></div>
            <div className="px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                  {initials}
                </div>
                <div className="flex-1 sm:pb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{fullName}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>ID: {patientId}</span>
                    <span>•</span>
                    <span>{bloodGroup}</span>
                    <span>•</span>
                    <span>{gender}</span>
                    <span>•</span>
                    <span>{age} yrs</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <Icon d={icons.edit} size={16} stroke="currentColor" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
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
                      ? "text-primary border-b-2 border-primary"
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
                    {isEditing ? (
                      <>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400">Age</div>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none"
                          />
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400">Gender</div>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400">Blood Type</div>
                          <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleInputChange}
                            className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none"
                          >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                          </select>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400">Phone</div>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full text-sm font-medium text-gray-800 bg-transparent outline-none"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400">Email</div>
                          <div className="text-sm font-medium text-gray-800">{email}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400">Phone</div>
                          <div className="text-sm font-medium text-gray-800">{phoneNumber}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50">
                          <div className="text-xs text-gray-400">Date of Birth</div>
                          <div className="text-sm font-medium text-gray-800">{age} years</div>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-50 sm:col-span-2 lg:col-span-3">
                          <div className="text-xs text-gray-400">Address</div>
                          <div className="text-sm font-medium text-gray-800">{address}</div>
                        </div>
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex justify-end gap-3 mt-4">
                      <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg text-sm">Cancel</button>
                      <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg text-sm">Save Changes</button>
                    </div>
                  )}
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
                    <button className="text-xs text-primary font-medium">View All →</button>
                  </div>
                  {recentAppointments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent appointments</p>
                  ) : (
                    <div className="space-y-2">
                      {recentAppointments.slice(0, 3).map((apt) => (
                        <div key={apt._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition">
                          <div>
                            <div className="font-medium text-gray-800 text-sm">Dr. {apt.doctorId?.fullName}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{new Date(apt.date).toLocaleDateString()} • {apt.timeSlot}</div>
                          </div>
                          <div className="text-sm font-medium text-gray-900">₹{apt.amount}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MEDICAL HISTORY TAB */}
            {activeTab === "medical" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Conditions</h3>
                  {medicalHistory.conditions.length === 0 ? (
                    <p className="text-gray-500 text-sm">No conditions recorded</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.conditions.map((condition, i) => (
                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          {condition}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Allergies</h3>
                  {medicalHistory.allergies.length === 0 ? (
                    <p className="text-gray-500 text-sm">No allergies recorded</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.allergies.map((allergy, i) => (
                        <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Family History</h3>
                  {medicalHistory.familyHistory.length === 0 ? (
                    <p className="text-gray-500 text-sm">No family history recorded</p>
                  ) : (
                    <div className="space-y-1">
                      {medicalHistory.familyHistory.map((history, i) => (
                        <p key={i} className="text-sm text-gray-600">• {history}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* REPORTS TAB */}
            {activeTab === "reports" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Uploaded Reports</h3>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
                    + Upload New
                  </button>
                </div>

                {recentReports.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">No reports uploaded yet</p>
                ) : (
                  recentReports.map((report) => (
                    <div key={report._id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:shadow-sm transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          📄
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{report.name}</div>
                          <div className="text-xs text-gray-400">{new Date(report.uploadedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                          {report.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">⬇️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Methods</h3>
                  <div className="p-4 rounded-xl border border-gray-200 text-center text-gray-500">
                    No payment methods added
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Transaction History</h3>
                  {recentAppointments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No transactions yet</p>
                  ) : (
                    <div className="space-y-2">
                      {recentAppointments.map((apt) => (
                        <div key={apt._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                          <div>
                            <div className="text-sm font-medium text-gray-800">Dr. {apt.doctorId?.fullName}</div>
                            <div className="text-xs text-gray-400">{new Date(apt.date).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">₹{apt.amount}</div>
                            <div className="text-xs text-green-600 capitalize">{apt.paymentStatus}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}