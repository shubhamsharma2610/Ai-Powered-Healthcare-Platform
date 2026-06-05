import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Mail, Phone, Calendar, User, Users, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000/api';

// Axios instance with credentials (cookie based)
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // ✅ Use api instance, not raw axios
      const response = await api.get('/admin/patients');
      // ✅ Ensure data is array
      setPatients(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Patients</h1>
        <p className="text-gray-500 text-sm mb-6">View all registered patients</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          Total Patients: {filteredPatients.length}
        </span>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <div key={patient._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{patient.fullName || 'Patient'}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="capitalize">{patient.gender || 'Not specified'}</span>
                      {patient.age && <span>• {patient.age} years</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-600 text-xs truncate">{patient.email}</span>
                </div>
                {patient.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600 text-xs">{patient.phoneNumber}</span>
                  </div>
                )}
                {patient.bloodType && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🩸</span>
                    <span className="text-gray-600 text-xs">Blood: {patient.bloodType}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-gray-600 text-xs">
                    Joined: {new Date(patient.createdAt || patient._id?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {patient.appointmentCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-gray-600 text-xs">{patient.appointmentCount} appointments</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <button className="w-full px-2 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
                  <Eye size={12} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}