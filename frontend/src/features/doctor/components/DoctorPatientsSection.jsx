import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Calendar } from 'lucide-react';
import { getDoctorPatients } from '../services/doctorApi';

export default function DoctorPatientsSection() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await getDoctorPatients(params);
      setPatients(response.data || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">My Patients</h2>
        <p className="text-sm text-gray-500">List of patients who have consulted you</p>
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

      {/* Patients Grid */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">No patients found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div key={patient._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg">
                  {patient.fullName?.[0] || 'P'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{patient.fullName}</h3>
                  <p className="text-xs text-gray-500 capitalize">{patient.gender || 'Not specified'} • {patient.age || '?'} years</p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={14} /> {patient.email}
                </div>
                {patient.phoneNumber && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={14} /> {patient.phoneNumber}
                  </div>
                )}
              </div>
              <button className="mt-3 w-full text-center text-sm text-primary hover:underline">
                View History
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button className="px-3 py-1 border rounded-lg text-sm">Previous</button>
          <span className="px-3 py-1 text-sm">Page {pagination.currentPage} of {pagination.totalPages}</span>
          <button className="px-3 py-1 border rounded-lg text-sm">Next</button>
        </div>
      )}
    </div>
  );
}