const mongoose = require('mongoose');

const PurchaseRequisitionSchema = new mongoose.Schema({
  prNumber: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  requestedBy: {
    type: String,
    required: true,
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
    min: [1, 'Quantity must be at least 1'],
  },
  expectedDate: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Approved', 'Rejected', 'Converted To RFQ'],
    default: 'Draft',
  },
  approvalTimeline: {
    created: { type: Date, default: Date.now },
    submitted: { type: Date },
    approved: { type: Date },
    rfqGenerated: { type: Date },
  },
  rejectionReason: {
    type: String,
  },
});

module.exports = mongoose.model('PurchaseRequisition', PurchaseRequisitionSchema);
