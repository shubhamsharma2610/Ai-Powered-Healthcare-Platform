import mongoose from 'mongoose';
import User from './User.js';

const patientSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      min: [0, 'Age cannot be negative'],
      max: [150, 'Age cannot exceed 150']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    bloodType: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown']
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedAt: Date,
        status: {
          type: String,
          enum: ['active', 'resolved', 'ongoing']
        }
      }
    ],
    allergies: [
      {
        substance: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe']
        }
      }
    ],
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
      email: String
    },
    profilePicture: String,
    phoneNumber: String,
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
      }
    ],
    appointmentCount: {
      type: Number,
      default: 0
    },
    lastConsultationDate: Date
  },
  { timestamps: true }
);

const Patient = User.discriminator('patient', patientSchema);
export default Patient;
