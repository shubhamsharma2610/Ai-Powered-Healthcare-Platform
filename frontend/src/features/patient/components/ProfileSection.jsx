import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientProfile, updatePatientProfile } from '../../../redux/slices/patientSlice';
import { User, Mail, Phone, Calendar, Droplet, Activity, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProfileSection() {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.patient);
  const { user } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    bloodType: '',
    phoneNumber: '',
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
        phoneNumber: profile?.phoneNumber || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await dispatch(updatePatientProfile(formData)).unwrap();
      setIsEditing(false);
      toast.success('Profile updated!');
      dispatch(fetchPatientProfile());
    } catch (error) {
      toast.error('Update failed');
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm">View and manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover */}
        <div className="h-24 bg-gradient-to-r from-primary to-primary-dark"></div>
        
        {/* Avatar */}
        <div className="px-6">
          <div className="flex items-end -mt-12">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user?.fullName?.[0] || 'P'}
            </div>
            <div className="ml-auto pb-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
            <p className="text-sm text-gray-500">Patient ID: {profile?._id?.slice(-8) || 'N/A'}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 border-t border-gray-100 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email (Read only) */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800">{user?.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="text-sm font-medium text-gray-800 bg-transparent outline-none w-full"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">{formData.phoneNumber || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Age */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Age</p>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="text-sm font-medium text-gray-800 bg-transparent outline-none w-full"
                    placeholder="Enter age"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-800">{formData.age || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Gender</p>
                {isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="text-sm font-medium text-gray-800 bg-transparent outline-none w-full"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-gray-800 capitalize">{formData.gender || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Blood Type */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Droplet size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Blood Type</p>
                {isEditing ? (
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="text-sm font-medium text-gray-800 bg-transparent outline-none w-full"
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
                ) : (
                  <p className="text-sm font-medium text-gray-800">{formData.bloodType || 'Not set'}</p>
                )}
              </div>
            </div>

            {/* Total Appointments */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Activity size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Total Appointments</p>
                <p className="text-sm font-medium text-gray-800">{profile?.appointmentCount || 0}</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-5 flex justify-end">
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}