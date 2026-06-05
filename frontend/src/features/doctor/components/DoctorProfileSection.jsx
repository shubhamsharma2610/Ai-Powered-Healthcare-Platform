import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Award, Clock, DollarSign, AlertCircle, Send, CheckCircle, XCircle } from 'lucide-react';
import { getDoctorProfile, updateDoctorProfile, submitForApproval } from '../services/doctorApi';
import { toast } from 'react-hot-toast';

export default function DoctorProfileSection() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    bio: '',
    consultationFee: '',
    clinicAddress: { street: '', city: '', state: '', zipCode: '', country: '' }
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    checkProfileCompleteness();
  }, [formData, profile]);

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
      
      if (response.data.isApproved) {
        setSubmissionStatus('approved');
      } else if (response.data.submittedForApproval) {
        setSubmissionStatus('submitted');
      } else {
        setSubmissionStatus('pending');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const checkProfileCompleteness = () => {
    const requiredFields = {
      phoneNumber: formData.phoneNumber?.trim() !== '',
      consultationFee: formData.consultationFee && parseFloat(formData.consultationFee) > 0,
      bio: formData.bio?.trim() !== '',
      clinicStreet: formData.clinicAddress?.street?.trim() !== '',
      clinicCity: formData.clinicAddress?.city?.trim() !== '',
      clinicState: formData.clinicAddress?.state?.trim() !== '',
      clinicZipCode: formData.clinicAddress?.zipCode?.trim() !== '',
      clinicCountry: formData.clinicAddress?.country?.trim() !== ''
    };
    
    const allRequired = Object.values(requiredFields).every(val => val === true);
    setIsProfileComplete(allRequired);
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
    if (!isProfileComplete) {
      toast.error('Please fill all required fields before saving');
      return;
    }
    
    try {
      await updateDoctorProfile(formData);
      toast.success('Profile saved successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleSubmitForApproval = async () => {
    if (!isProfileComplete) {
      toast.error('Please complete your profile first');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitForApproval();
      toast.success('Profile submitted for approval! Admin will review soon.');
      setSubmissionStatus('submitted');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit for approval');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequiredFieldsList = () => {
    const missing = [];
    if (!formData.phoneNumber?.trim()) missing.push('Phone Number');
    if (!formData.consultationFee || parseFloat(formData.consultationFee) <= 0) missing.push('Consultation Fee');
    if (!formData.bio?.trim()) missing.push('Bio');
    if (!formData.clinicAddress?.street?.trim()) missing.push('Street Address');
    if (!formData.clinicAddress?.city?.trim()) missing.push('City');
    if (!formData.clinicAddress?.state?.trim()) missing.push('State');
    if (!formData.clinicAddress?.zipCode?.trim()) missing.push('Zip Code');
    if (!formData.clinicAddress?.country?.trim()) missing.push('Country');
    return missing;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  const missingFields = getRequiredFieldsList();
  const canSubmit = isProfileComplete && submissionStatus === 'pending';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Approval Status Banner */}
      {submissionStatus === 'approved' && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600" />
          <div>
            <p className="text-sm font-medium text-green-800">Account Approved!</p>
            <p className="text-xs text-green-600">Your profile has been approved. You can now accept appointments.</p>
          </div>
        </div>
      )}
      
      {submissionStatus === 'submitted' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
          <Clock size={20} className="text-yellow-600" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Pending Approval</p>
            <p className="text-xs text-yellow-600">Your profile is under review. Admin will approve shortly.</p>
          </div>
        </div>
      )}
      
      {submissionStatus === 'pending' && !isProfileComplete && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-800">Complete Your Profile</p>
            <p className="text-xs text-orange-600">Please fill all required fields to submit for approval.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
              {user?.fullName?.[0] || 'D'}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.fullName}</h1>
              <p className="text-primary capitalize">{profile?.specialization}</p>
              <p className="text-sm text-gray-500">{profile?.experience} years experience</p>
            </div>
            {submissionStatus === 'pending' && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
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
                <p className="text-xs text-gray-400">Phone *</p>
                {isEditing ? (
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    className="text-sm bg-transparent outline-none w-full" 
                    placeholder="Enter phone number" 
                  />
                ) : (
                  <p className="text-sm font-medium">{formData.phoneNumber || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign size={18} className="text-gray-400" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Consultation Fee *</p>
                {isEditing ? (
                  <input 
                    type="number" 
                    name="consultationFee" 
                    value={formData.consultationFee} 
                    onChange={handleChange} 
                    className="text-sm bg-transparent outline-none w-full" 
                    placeholder="Enter fee" 
                  />
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
            <p className="text-xs text-gray-400 mb-1">Bio *</p>
            {isEditing ? (
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                rows="3" 
                className="text-sm bg-transparent outline-none w-full" 
                placeholder="Write your bio..." 
              />
            ) : (
              <p className="text-sm">{formData.bio || 'No bio added'}</p>
            )}
          </div>

          {/* Clinic Address */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
              <MapPin size={14} /> Clinic Address *
            </p>
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  type="text" 
                  name="clinicAddress.street" 
                  value={formData.clinicAddress.street} 
                  onChange={handleChange} 
                  placeholder="Street *" 
                  className="w-full text-sm border rounded-lg p-2" 
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    name="clinicAddress.city" 
                    value={formData.clinicAddress.city} 
                    onChange={handleChange} 
                    placeholder="City *" 
                    className="text-sm border rounded-lg p-2" 
                  />
                  <input 
                    type="text" 
                    name="clinicAddress.state" 
                    value={formData.clinicAddress.state} 
                    onChange={handleChange} 
                    placeholder="State *" 
                    className="text-sm border rounded-lg p-2" 
                  />
                  <input 
                    type="text" 
                    name="clinicAddress.zipCode" 
                    value={formData.clinicAddress.zipCode} 
                    onChange={handleChange} 
                    placeholder="Zip Code *" 
                    className="text-sm border rounded-lg p-2" 
                  />
                  <input 
                    type="text" 
                    name="clinicAddress.country" 
                    value={formData.clinicAddress.country} 
                    onChange={handleChange} 
                    placeholder="Country *" 
                    className="text-sm border rounded-lg p-2" 
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm">
                {formData.clinicAddress.street 
                  ? `${formData.clinicAddress.street}, ${formData.clinicAddress.city}, ${formData.clinicAddress.state} - ${formData.clinicAddress.zipCode}, ${formData.clinicAddress.country}` 
                  : 'No address added'}
              </p>
            )}
          </div>

          {/* Missing Fields Warning */}
          {isEditing && missingFields.length > 0 && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-medium text-red-700 mb-2">Required fields missing:</p>
              <ul className="list-disc list-inside text-xs text-red-600">
                {missingFields.map((field, i) => (
                  <li key={i}>{field}</li>
                ))}
              </ul>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSave}
                disabled={!isProfileComplete}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isProfileComplete 
                    ? 'bg-primary text-white hover:bg-primary-dark' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit for Approval Button */}
      {submissionStatus === 'pending' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Ready to get verified?</p>
              <p className="text-xs text-gray-500">Submit your profile for admin approval to start accepting appointments.</p>
            </div>
            <button
              onClick={handleSubmitForApproval}
              disabled={!canSubmit || isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                canSubmit && !isSubmitting
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit for Approval
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}