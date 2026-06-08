import mongoose from 'mongoose';
import User from './User.js';

const doctorSchema = new mongoose.Schema(
  {
    licenseNumber: {
      type: String,
      required: [true, 'License number is required'],
      unique: true,
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      enum: [
        'Cardiology',
        'Neurology',
        'Dermatology',
        'Pediatrics',
        'General Medicine',
        'Orthopedics',
        'Psychiatry',
        'Oncology',
        'ENT',
        'Gynecology'
      ]
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [80, 'Experience cannot exceed 80 years']
    },
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number
      }
    ],
    clinicAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    consultationFee: {
      type: Number,
      min: [0, 'Fee cannot be negative'],
      default: 0
    },
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: String,
        endTime: String,
        isAvailable: {
          type: Boolean,
          default: true
        }
      }
    ],
    profilePicture: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    phoneNumber: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please enter valid phone number']
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    totalConsultations: {
      type: Number,
      default: 0
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
      }
    ],

    // ========== DOCUMENTS SECTION (NEW) ==========
    documents: {
      profilePhoto: { type: String, default: '' },      // Profile picture URL
      aadharCard: { type: String, default: '' },        // Aadhar card URL
      panCard: { type: String, default: '' },           // PAN card URL
      medicalDegree: { type: String, default: '' },     // MBBS degree URL
      upiId: { type: String, default: '' }              // ✅ UPI ID for payments
    },
    // =============================================

    // ========== APPROVAL WORKFLOW FIELDS ==========
    isApproved: {
      type: Boolean,
      default: false
    },
    
    submittedForApproval: {
      type: Boolean,
      default: false
    },
    
    isRejected: {
      type: Boolean,
      default: false
    },
    
    submittedAt: {
      type: Date
    },
    
    approvedAt: {
      type: Date
    },
    
    rejectedAt: {
      type: Date
    },
    
    rejectionReason: {
      type: String,
      default: ''
    },
    
    status: {
      type: String,
      enum: ['pending', 'submitted', 'active', 'rejected'],
      default: 'pending'
    }
    // =============================================
  },
  { timestamps: true }
);

// Indexes for faster queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isApproved: 1 });
doctorSchema.index({ submittedForApproval: 1 });
doctorSchema.index({ consultationFee: 1 });
doctorSchema.index({ status: 1 });

// ✅ UPDATED Virtual to check if profile is complete (including documents)
doctorSchema.virtual('isProfileComplete').get(function() {
  return !!(this.phoneNumber && 
            this.consultationFee > 0 && 
            this.bio && 
            this.clinicAddress?.street &&
            this.clinicAddress?.city &&
            this.clinicAddress?.state &&
            this.clinicAddress?.zipCode &&
            this.clinicAddress?.country &&
            this.documents?.aadharCard &&      // ✅ Mandatory
            this.documents?.panCard &&         // ✅ Mandatory
            this.documents?.medicalDegree);    // ✅ Mandatory
});

// ✅ Method to submit for approval (updated with document check)
doctorSchema.methods.submitForApproval = function() {
  if (this.isProfileComplete && !this.isApproved && !this.submittedForApproval) {
    this.submittedForApproval = true;
    this.submittedAt = new Date();
    this.status = 'submitted';
    this.isRejected = false;
    this.rejectionReason = '';
    return true;
  }
  return false;
};

// ✅ Method to approve doctor
doctorSchema.methods.approve = function() {
  this.isApproved = true;
  this.submittedForApproval = false;
  this.approvedAt = new Date();
  this.status = 'active';
  this.isRejected = false;
  return true;
};

// ✅ Method to reject doctor
doctorSchema.methods.reject = function(reason = '') {
  this.isApproved = false;
  this.submittedForApproval = false;
  this.isRejected = true;
  this.rejectedAt = new Date();
  this.rejectionReason = reason || 'Profile does not meet requirements';
  this.status = 'rejected';
  return true;
};

// ✅ Method to get missing documents
doctorSchema.methods.getMissingDocuments = function() {
  const missing = [];
  if (!this.documents?.aadharCard) missing.push('Aadhar Card');
  if (!this.documents?.panCard) missing.push('PAN Card');
  if (!this.documents?.medicalDegree) missing.push('Medical Degree');
  return missing;
};

// Ensure virtuals are included in JSON output
doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

const Doctor = User.discriminator('Doctor', doctorSchema);
export default Doctor;