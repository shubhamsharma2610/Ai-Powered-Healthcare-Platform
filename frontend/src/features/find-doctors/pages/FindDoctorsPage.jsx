import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors, fetchSpecializations } from '../../../redux/slices/doctorSlice';
import DoctorCard from '../components/DoctorCard';
import SearchBar from '../components/SearchBar';

export default function FindDoctorsPage() {
  const dispatch = useDispatch();
  const { doctors, specializations, loading, error } = useSelector((state) => state.doctors);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchDoctors({ specialization: selectedSpecialty, search: searchTerm }));
    dispatch(fetchSpecializations());
  }, [dispatch, selectedSpecialty, searchTerm]);

  return (
    <div className="min-h-screen bg-surface-soft py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-display">Find Doctors</h1>
          <p className="text-sm text-gray-500 mt-1">Book appointment with trusted doctors</p>
        </div>

        {/* Search */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center my-6">
          <button
            onClick={() => setSelectedSpecialty('')}
            className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all ${
              selectedSpecialty === '' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All
          </button>
          {(specializations || []).map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-pill text-xs font-medium transition-all capitalize ${
                selectedSpecialty === spec 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-medical border border-red-100">
            <p className="text-sm text-red-500">{error || 'Failed to load doctors. Please try again.'}</p>
          </div>
        ) : (doctors || []).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-medical border border-gray-100">
            <p className="text-sm text-gray-500">No doctors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(doctors || []).map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
