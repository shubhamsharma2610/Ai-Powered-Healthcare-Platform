import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  amount: {
    type: Number,
    required: true
  },
  paymentId: String,
  symptoms: String,
  notes: String,
  
  // Cancellation tracking
  cancelledBy: {
    type: String,
    enum: ['patient', 'doctor', 'admin', null],
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  
  // ✅ NEW: Refund tracking fields
  refundAmount: {
    type: Number,
    default: 0
  },
  refundPercentage: {
    type: Number,
    default: 0
  },
  refundId: {
    type: String,
    default: ''
  },
  refundProcessedAt: {
    type: Date,
    default: null
  },
  
  // Doctor side
  doctorNotes: {
    type: String,
    default: ''
  },
  prescription: {
    type: String,
    default: ''
  },
  
  // Video call
  meetingLink: {
    type: String,
    default: ''
  },
  meetingId: {
    type: String,
    default: ''
  },

  // For tracking completion
  completedAt: {
    type: Date,
    default: null
  },
  noShowAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Index for auto-deletion of pending appointments after 24 hours
appointmentSchema.index(
  { createdAt: 1 },
  { 
    expireAfterSeconds: 86400,
    partialFilterExpression: { status: 'pending' }
  }
);

// Indexes for faster queries
appointmentSchema.index({ patientId: 1, date: -1 });
appointmentSchema.index({ doctorId: 1, date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ paymentStatus: 1 });
appointmentSchema.index({ cancelledBy: 1 });

export default mongoose.model('Appointment', appointmentSchema);