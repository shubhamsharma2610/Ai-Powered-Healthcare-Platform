import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Mail, Phone, Calendar, Stethoscope, UserCheck, UserX } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setDoctors(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isApproved) => {
    if (isApproved) {
      return { text: 'Approved', className: 'bg-green-100 text-green-700', icon: UserCheck };
    }
    return { text: 'Pending', className: 'bg-yellow-100 text-yellow-700', icon: UserX };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Doctors</h1>
        <p className="text-gray-500 text-sm mb-6">View all doctors on the platform</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name, email or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          Total Doctors: {filteredDoctors.length}
        </span>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">No doctors found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => {
            const status = getStatusBadge(doctor.isApproved);
            const StatusIcon = status.icon;
            
            return (
              <div key={doctor._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
                      <Stethoscope size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{doctor.fullName || 'Doctor'}</h3>
                      <p className="text-xs text-gray-500 capitalize">{doctor.specialization}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${status.className}`}>
                    <StatusIcon size={12} />
                    {status.text}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-600 text-xs truncate">{doctor.email}</span>
                  </div>
                  {doctor.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-gray-600 text-xs">{doctor.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-600 text-xs">{doctor.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💰</span>
                    <span className="text-gray-600 text-xs">₹{doctor.consultationFee || 500} per visit</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 px-2 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors">
                    View Details
                  </button>
                  <button className="flex-1 px-2 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}