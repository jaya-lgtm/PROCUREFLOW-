const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  invoiceReference: {
    type: String,
    required: true, // Invoice Number
  },
  vendorId: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'UPI', 'Cheque'],
    default: 'Bank Transfer',
  },
  status: {
    type: String,
    enum: ['Pending', 'Scheduled', 'Paid'],
    default: 'Pending',
  },
  transactionReference: {
    type: String, // Bank reference transaction ID, Cheque number, etc.
  },
  scheduledDate: {
    type: Date,
  },
});

module.exports = mongoose.model('Payment', PaymentSchema);
