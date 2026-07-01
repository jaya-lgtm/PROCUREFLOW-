const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  vendorId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  vendorName: {
    type: String,
    required: [true, 'Vendor Name is required'],
    trim: true,
  },
  gstNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  bankDetails: {
    accountNo: { type: String, required: true },
    bankName: { type: String, required: true },
    ifsc: { type: String, required: true },
  },
  currency: {
    type: String,
    default: 'USD',
  },
  paymentTerms: {
    type: String,
    enum: ['NET15', 'NET30', 'NET45', 'NET60', 'DUE_ON_RECEIPT'],
    default: 'NET30',
  },
  purchasingOrganization: {
    type: String,
    default: 'PO10', // SAP purchasing organization code
  },
  performanceMetrics: {
    onTimeDelivery: { type: Number, default: 100 }, // Percentage (0-100)
    qualityScore: { type: Number, default: 100 },    // Percentage (0-100)
    costEfficiency: { type: Number, default: 100 },  // Percentage (0-100)
    responseTime: { type: Number, default: 100 },    // Score (0-100)
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vendor', VendorSchema);
