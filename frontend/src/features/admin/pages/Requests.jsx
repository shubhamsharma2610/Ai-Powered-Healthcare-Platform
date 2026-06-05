import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Clock, Mail, Phone, GraduationCap, Calendar, MapPin, DollarSign, Eye } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/pending-doctors`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setRequests(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching pending doctors:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctor) => {
    setProcessingId(doctor._id);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/approve-doctor/${doctor._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      toast.success(`${doctor.fullName || doctor.name} approved successfully!`);
      setShowDetailsModal(false); // Close modal if open
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error approving doctor:', error);
      toast.error('Failed to approve doctor');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (doctor) => {
    setProcessingId(doctor._id);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/reject-doctor/${doctor._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      toast.success(`${doctor.fullName || doctor.name} rejected`);
      setShowDetailsModal(false); // Close modal if open
      fetchPendingDoctors();
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      toast.error('Failed to reject doctor');
    } finally {
      setProcessingId(null);
    }
  };

  const viewFullProfile = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Doctor Verification Requests</h1>
      <p className="text-gray-500 text-sm mb-6">Review and verify doctor profiles submitted for approval</p>

      <div className="mb-4">
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium inline-flex items-center gap-1">
          <Clock size={14} />
          {requests.length} Pending {requests.length === 1 ? 'Request' : 'Requests'}
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No Pending Requests</h3>
          <p className="text-sm text-gray-500">All doctor verification requests have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((doctor) => (
            <div key={doctor._id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      Dr. {doctor.fullName || doctor.name || 'Doctor'}
                    </h3>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full inline-flex items-center gap-1">
                      <Clock size={10} /> Awaiting Verification
                    </span>
                    {doctor.submittedAt && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        Submitted: {new Date(doctor.submittedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-gray-600 text-xs sm:text-sm break-all">{doctor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-600 text-xs sm:text-sm">{doctor.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} className="text-gray-400" />
                      <span className="text-gray-600 text-xs sm:text-sm capitalize">{doctor.specialization || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-gray-600 text-xs sm:text-sm">{doctor.experience || 0} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-gray-400" />
                      <span className="text-gray-600 text-xs sm:text-sm">₹{doctor.consultationFee || 'Not set'}</span>
                    </div>
                    {doctor.clinicAddress?.city && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {doctor.clinicAddress.city}, {doctor.clinicAddress.state}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {doctor.bio && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{doctor.bio}</p>
                  )}
                  
                  {/* ✅ VIEW FULL PROFILE BUTTON */}
                  <button
                    onClick={() => viewFullProfile(doctor)}
                    className="mt-3 text-primary text-xs font-medium hover:underline flex items-center gap-1"
                  >
                    <Eye size={14} /> View Full Profile
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(doctor)}
                    disabled={processingId === doctor._id}
                    className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-all disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {processingId === doctor._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                    ) : (
                      <>
                        <CheckCircle size={14} /> Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(doctor)}
                    disabled={processingId === doctor._id}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ FULL PROFILE MODAL */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Doctor Profile Details</h2>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Name:</span> Dr. {selectedDoctor.fullName}</div>
                  <div><span className="text-gray-500">Email:</span> {selectedDoctor.email}</div>
                  <div><span className="text-gray-500">Phone:</span> {selectedDoctor.phoneNumber || 'N/A'}</div>
                  <div><span className="text-gray-500">License:</span> {selectedDoctor.licenseNumber || 'N/A'}</div>
                  <div><span className="text-gray-500">Specialization:</span> {selectedDoctor.specialization}</div>
                  <div><span className="text-gray-500">Experience:</span> {selectedDoctor.experience} years</div>
                  <div><span className="text-gray-500">Consultation Fee:</span> ₹{selectedDoctor.consultationFee}</div>
                  <div><span className="text-gray-500">Submitted:</span> {new Date(selectedDoctor.submittedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Bio */}
              {selectedDoctor.bio && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">Bio</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedDoctor.bio}</p>
                </div>
              )}

              {/* Clinic Address */}
              {selectedDoctor.clinicAddress && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">Clinic Address</h3>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <p>{selectedDoctor.clinicAddress.street}</p>
                    <p>{selectedDoctor.clinicAddress.city}, {selectedDoctor.clinicAddress.state}</p>
                    <p>Pin Code: {selectedDoctor.clinicAddress.zipCode}</p>
                    <p>{selectedDoctor.clinicAddress.country}</p>
                  </div>
                </div>
              )}

              {/* Qualifications (if available) */}
              {selectedDoctor.qualifications && selectedDoctor.qualifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">Qualifications</h3>
                  <div className="space-y-2">
                    {selectedDoctor.qualifications.map((qual, idx) => (
                      <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <span className="font-medium">{qual.degree}</span> from {qual.institution} ({qual.year})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleApprove(selectedDoctor)}
                disabled={processingId === selectedDoctor._id}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                {processingId === selectedDoctor._id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <CheckCircle size={16} /> Approve
                  </>
                )}
              </button>
              <button
                onClick={() => handleReject(selectedDoctor)}
                disabled={processingId === selectedDoctor._id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}