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
      default: '' // Empty string means no image uploaded yet
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

    // change after testing
    isApproved: {
      type: Boolean,
      default: true 
    },
    approvedAt: Date,
    rejectionReason: String
  },
  { timestamps: true }
);

// Index for faster queries
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isApproved: 1 });
doctorSchema.index({ consultationFee: 1 }); // Add this for filtering by fee

const Doctor = User.discriminator('Doctor', doctorSchema);
export default Doctor;