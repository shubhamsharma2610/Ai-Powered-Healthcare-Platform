import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Award, Clock, DollarSign } from 'lucide-react';
import { getDoctorProfile, updateDoctorProfile } from '../services/doctorApi';
import { toast } from 'react-hot-toast';

export default function DoctorProfileSection() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    bio: '',
    consultationFee: '',
    clinicAddress: { street: '', city: '', state: '', zipCode: '', country: '' }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getDoctorProfile();
      setProfile(response.data);
      setFormData({
        phoneNumber: response.data.phoneNumber || '',
        bio: response.data.bio || '',
        consultationFee: response.data.consultationFee || '',
        clinicAddress: response.data.clinicAddress || { street: '', city: '', state: '', zipCode: '', country: '' }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('clinicAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        clinicAddress: { ...prev.clinicAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    try {
      await updateDoctorProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl">
              {user?.fullName?.[0] || 'D'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user?.fullName}</h1>
              <p className="text-primary capitalize">{profile?.specialization}</p>
              <p className="text-sm text-gray-500">{profile?.experience} years experience</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Phone</p>
                {isEditing ? (
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="text-sm bg-transparent outline-none w-full" placeholder="Enter phone number" />
                ) : (
                  <p className="text-sm font-medium">{formData.phoneNumber || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Consultation Fee</p>
                {isEditing ? (
                  <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} className="text-sm bg-transparent outline-none w-full" placeholder="Enter fee" />
                ) : (
                  <p className="text-sm font-medium">₹{formData.consultationFee || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Award size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">License Number</p>
                <p className="text-sm font-medium">{profile?.licenseNumber}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Bio</p>
            {isEditing ? (
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="text-sm bg-transparent outline-none w-full" placeholder="Write your bio..." />
            ) : (
              <p className="text-sm">{formData.bio || 'No bio added'}</p>
            )}
          </div>

          {/* Clinic Address */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-2"><MapPin size={14} /> Clinic Address</p>
            {isEditing ? (
              <div className="space-y-2">
                <input type="text" name="clinicAddress.street" value={formData.clinicAddress.street} onChange={handleChange} placeholder="Street" className="w-full text-sm border rounded-lg p-2" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" name="clinicAddress.city" value={formData.clinicAddress.city} onChange={handleChange} placeholder="City" className="text-sm border rounded-lg p-2" />
                  <input type="text" name="clinicAddress.state" value={formData.clinicAddress.state} onChange={handleChange} placeholder="State" className="text-sm border rounded-lg p-2" />
                  <input type="text" name="clinicAddress.zipCode" value={formData.clinicAddress.zipCode} onChange={handleChange} placeholder="Zip Code" className="text-sm border rounded-lg p-2" />
                  <input type="text" name="clinicAddress.country" value={formData.clinicAddress.country} onChange={handleChange} placeholder="Country" className="text-sm border rounded-lg p-2" />
                </div>
              </div>
            ) : (
              <p className="text-sm">{formData.clinicAddress.street ? `${formData.clinicAddress.street}, ${formData.clinicAddress.city}, ${formData.clinicAddress.state}` : 'No address added'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button onClick={handleSave} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark">Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}