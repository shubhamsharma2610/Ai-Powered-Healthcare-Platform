import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  User, Mail, Phone, MapPin, Award, Clock, DollarSign, AlertCircle, 
  Send, CheckCircle, XCircle, Upload, Image, IdCard, GraduationCap, 
  CreditCard, Eye, FileText, Loader, Edit2 
} from 'lucide-react';
import { getDoctorProfile, updateDoctorProfile, submitForApproval, uploadDocument } from '../services/doctorApi';
import { toast } from 'react-hot-toast';

export default function DoctorProfileSection() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    bio: '',
    consultationFee: '',
    clinicAddress: { street: '', city: '', state: '', zipCode: '', country: '' }
  });

  // Document states
  const [documents, setDocuments] = useState({
    profilePhoto: '',
    aadharCard: '',
    panCard: '',
    medicalDegree: '',
    upiId: ''
  });

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    checkProfileCompleteness();
  }, [formData, documents, submissionStatus]);

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
      
      // Set document data
      if (response.data.documents) {
        setDocuments({
          profilePhoto: response.data.documents.profilePhoto || '',
          aadharCard: response.data.documents.aadharCard || '',
          panCard: response.data.documents.panCard || '',
          medicalDegree: response.data.documents.medicalDegree || '',
          upiId: response.data.documents.upiId || ''
        });
      }
      
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
    // For profile completion check (for submit approval)
    if (submissionStatus === 'pending') {
      const requiredFields = {
        phoneNumber: formData.phoneNumber?.trim() !== '',
        consultationFee: formData.consultationFee && parseFloat(formData.consultationFee) > 0,
        bio: formData.bio?.trim() !== '',
        clinicStreet: formData.clinicAddress?.street?.trim() !== '',
        clinicCity: formData.clinicAddress?.city?.trim() !== '',
        clinicState: formData.clinicAddress?.state?.trim() !== '',
        clinicZipCode: formData.clinicAddress?.zipCode?.trim() !== '',
        clinicCountry: formData.clinicAddress?.country?.trim() !== '',
        aadharCard: documents.aadharCard !== '',
        panCard: documents.panCard !== '',
        medicalDegree: documents.medicalDegree !== ''
      };
      const allRequired = Object.values(requiredFields).every(val => val === true);
      setIsProfileComplete(allRequired);
    } else {
      // For approved/submitted, only basic fields needed for editing
      setIsProfileComplete(true);
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
    } else if (name === 'upiId') {
      setDocuments(prev => ({ ...prev, upiId: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (file, documentType) => {
    if (!file) return;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, or PDF files are allowed');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setUploading(true);
    setUploadingDocType(documentType);
    try {
      const response = await uploadDocument(file, documentType);
      setDocuments(prev => ({ ...prev, [documentType]: response.data.url }));
      toast.success(`${getDocumentTitle(documentType)} uploaded successfully`);
      
      // Auto save after upload
      await saveProfileData();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
      setUploadingDocType(null);
    }
  };

  const getDocumentTitle = (type) => {
    const titles = {
      profilePhoto: 'Profile Photo',
      aadharCard: 'Aadhar Card',
      panCard: 'PAN Card',
      medicalDegree: 'Medical Degree'
    };
    return titles[type] || type;
  };

  const saveProfileData = async () => {
    try {
      const updateData = {
        ...formData,
        documents: {
          profilePhoto: documents.profilePhoto,
          aadharCard: documents.aadharCard,
          panCard: documents.panCard,
          medicalDegree: documents.medicalDegree,
          upiId: documents.upiId
        }
      };
      await updateDoctorProfile(updateData);
      toast.success('Profile saved successfully');
      setIsEditing(false);
      fetchProfile();
      return true;
    } catch (error) {
      toast.error('Failed to update profile');
      return false;
    }
  };

  const handleSave = async () => {
    await saveProfileData();
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
    
    // Only check documents if not approved
    if (submissionStatus === 'pending') {
      if (!documents.aadharCard) missing.push('Aadhar Card');
      if (!documents.panCard) missing.push('PAN Card');
      if (!documents.medicalDegree) missing.push('Medical Degree');
    }
    return missing;
  };

  const DocumentUploadCard = ({ title, type, icon: Icon, required = true }) => {
    const isUploading = uploading && uploadingDocType === type;
    
    return (
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-primary" />
            <h4 className="font-medium text-gray-800">
              {title} {required && submissionStatus === 'pending' && <span className="text-red-500 text-xs">*</span>}
            </h4>
          </div>
          {isEditing && documents[type] && (
            <button
              onClick={() => setDocuments(prev => ({ ...prev, [type]: '' }))}
              className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
            >
              <XCircle size={14} /> Remove
            </button>
          )}
        </div>
        
        {documents[type] ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm text-green-700 flex-1">Uploaded</span>
              <a
                href={documents[type]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm flex items-center gap-1"
              >
                <Eye size={14} /> View
              </a>
              {isEditing && (
                <label className="cursor-pointer text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                  <Edit2 size={14} /> Update
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileUpload(e.target.files[0], type);
                      }
                    }}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
        ) : (
          <label className={`block w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors ${(!isEditing || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleFileUpload(e.target.files[0], type);
                }
              }}
              disabled={!isEditing || uploading}
            />
            {isUploading ? (
              <Loader size={24} className="mx-auto text-primary animate-spin mb-2" />
            ) : (
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-500">
              {!isEditing ? 'Click Edit Profile to upload' : `Click to upload ${title}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, or PDF (Max 5MB)</p>
          </label>
        )}
      </div>
    );
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
            <p className="text-xs text-yellow-600">Your profile is under review. Admin will review shortly.</p>
          </div>
        </div>
      )}
      
      {submissionStatus === 'pending' && !isProfileComplete && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} className="text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-800">Complete Your Profile</p>
            <p className="text-xs text-orange-600">Please fill all required fields and upload documents to submit for approval.</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-center gap-4">
            {documents.profilePhoto ? (
              <img 
                src={documents.profilePhoto} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                {user?.fullName?.[0] || 'D'}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user?.fullName}</h1>
              <p className="text-primary capitalize">{profile?.specialization}</p>
              <p className="text-sm text-gray-500">{profile?.experience} years experience</p>
            </div>
            {/* Edit button always visible */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {isEditing ? <XCircle size={16} /> : <Edit2 size={16} />}
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
                <p className="text-xs text-gray-400">Phone {submissionStatus === 'pending' && '*'}</p>
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
                <p className="text-xs text-gray-400">Consultation Fee {submissionStatus === 'pending' && '*'}</p>
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
            <p className="text-xs text-gray-400 mb-1">Bio {submissionStatus === 'pending' && '*'}</p>
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
              <MapPin size={14} /> Clinic Address {submissionStatus === 'pending' && '*'}
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

          {/* UPI ID Field */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-2">
              <CreditCard size={14} /> UPI ID (for payments)
            </p>
            {isEditing ? (
              <input 
                type="text" 
                name="upiId" 
                value={documents.upiId} 
                onChange={handleChange} 
                className="text-sm bg-transparent outline-none w-full" 
                placeholder="Enter UPI ID (e.g., doctor@okhdfcbank)" 
              />
            ) : (
              <p className="text-sm">{documents.upiId || 'Not set'}</p>
            )}
          </div>

          {/* Documents Section - Show for all, but edit only in edit mode */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Documents</h3>
            <p className="text-sm text-gray-500 mb-4">
              {submissionStatus === 'approved' 
                ? 'Your documents are verified. You can update them if needed.' 
                : 'Please upload clear copies of the following documents for verification'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentUploadCard 
                title="Profile Photo" 
                type="profilePhoto" 
                icon={Image}
                required={false}
              />
              <DocumentUploadCard 
                title="Aadhar Card" 
                type="aadharCard" 
                icon={IdCard}
                required={true}
              />
              <DocumentUploadCard 
                title="PAN Card" 
                type="panCard" 
                icon={IdCard}
                required={true}
              />
              <DocumentUploadCard 
                title="Medical Degree" 
                type="medicalDegree" 
                icon={GraduationCap}
                required={true}
              />
            </div>
          </div>

          {/* Missing Fields Warning */}
          {isEditing && missingFields.length > 0 && submissionStatus === 'pending' && (
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
                className="px-5 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit for Approval Button - Only for pending doctors */}
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