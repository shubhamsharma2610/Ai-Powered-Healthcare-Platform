import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white rounded-medical shadow-soft border border-gray-100 overflow-hidden hover:shadow-hover transition-all hover:-translate-y-0.5">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-2xl">
              👨‍⚕️
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-base">{doctor.fullName}</h3>
              <p className="text-xs text-primary capitalize">{doctor.specialization}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{doctor.rating || '4.8'}</span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} />
            <span>{doctor.clinicAddress?.city || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={13} />
            <span>{doctor.experience} years experience</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <DollarSign size={14} />
            <span>₹{doctor.consultationFee || 500} per visit</span>
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/doctor/${doctor.id || doctor._id}`}
          className="mt-4 w-full block text-center px-4 py-2.5 bg-primary text-white rounded-medical text-sm font-medium hover:bg-primary-600 transition-all"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}