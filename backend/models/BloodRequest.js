const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    unitsNeeded: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'normal',
    },
    hospital: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true },
      },
    },
    contactPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'fulfilled', 'expired', 'cancelled'],
      default: 'open',
    },
    matchedDonors: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
        status: {
          type: String,
          enum: ['notified', 'accepted', 'declined', 'donated'],
          default: 'notified',
        },
        notifiedAt: { type: Date, default: Date.now },
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    },
    notes: String,
  },
  { timestamps: true }
);

bloodRequestSchema.index({ 'hospital.location': '2dsphere' });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
