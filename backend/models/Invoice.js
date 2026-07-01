const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  materialId: { type: String, required: true },
  materialName: { type: String, required: true },
  quantityInvoice: { type: Number, required: true },
  priceInvoice: { type: Number, required: true }, // price billed per unit
  taxInvoice: { type: Number, default: 18 },       // tax percentage billed
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  poReference: {
    type: String,
    required: true,
  },
  grnReference: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  items: [InvoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  taxAmount: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Verified', 'Pending', 'Blocked'],
    default: 'Pending',
  },
  threeWayMatch: {
    priceMismatch: { type: Boolean, default: false },
    quantityMismatch: { type: Boolean, default: false },
    taxMismatch: { type: Boolean, default: false },
    mismatchLogs: [{ type: String }],
  },
  verifiedBy: {
    type: String,
  },
  verifiedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
