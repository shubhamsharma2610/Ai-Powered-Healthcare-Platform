import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Star, CheckCircle } from 'lucide-react';

export default function DoctorCard({ doctor }) {
  // Get profile picture from documents.profilePhoto or direct profilePicture field
  const profilePhoto = doctor?.documents?.profilePhoto || doctor?.profilePicture || null;
  
  // Get initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return 'D';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-white rounded-medical shadow-soft border border-gray-100 overflow-hidden hover:shadow-hover transition-all hover:-translate-y-0.5">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Profile Picture */}
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt={doctor.fullName}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">${getInitials(doctor.fullName)}</div>`;
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                {getInitials(doctor.fullName)}
              </div>
            )}
            
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-gray-800 text-base">{doctor.fullName}</h3>
                {/* Verified Badge - Show only if doctor is approved */}
                {doctor.isApproved && (
                  <CheckCircle size={16} className="text-green-500 fill-green-500" />
                )}
              </div>
              <p className="text-xs text-primary capitalize">{doctor.specialization}</p>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-700">{doctor.rating || '4.8'}</span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <MapPin size={13} />
            <span>{doctor.clinicAddress?.city || doctor.clinicAddress?.city || 'Location not specified'}</span>
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