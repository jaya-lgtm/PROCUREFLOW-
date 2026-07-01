const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  price: { type: Number },
  leadTime: { type: Number }, // in days
  qualityScore: { type: Number, default: 90 }, // vendor performance metrics snapshot
  performanceRating: { type: Number, default: 4.5 },
  status: { type: String, enum: ['Pending', 'Submitted'], default: 'Pending' },
  submittedAt: { type: Date },
});

const RFQSchema = new mongoose.Schema({
  rfqNumber: {
    type: String,
    required: true,
    unique: true,
  },
  prReference: {
    type: String, // PR Number reference
    default: null,
  },
  materialId: {
    type: String,
    required: true,
  },
  materialName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Sent', 'Quotation Received', 'Closed'],
    default: 'Open',
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  quotations: [QuotationSchema],
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RFQ', RFQSchema);
