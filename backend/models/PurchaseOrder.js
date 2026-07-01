const mongoose = require('mongoose');

const POItemSchema = new mongoose.Schema({
  materialId: { type: String, required: true },
  materialName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // unit price
  tax: { type: Number, default: 18 },      // percentage (e.g., 18%)
});

const PurchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    required: true,
    unique: true,
  },
  rfqReference: {
    type: String, // RFQ Number reference
    default: null,
  },
  vendorId: {
    type: String,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
  },
  items: [POItemSchema],
  totalQuantity: {
    type: Number,
    required: true,
  },
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
  deliveryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Created', 'Approved', 'Sent', 'Partially Delivered', 'Delivered', 'Closed'],
    default: 'Created',
  },
  approvalWorkflow: {
    requester: { type: String },
    managerApproved: { type: Boolean, default: false },
    managerApprovalDate: { type: Date },
    directorApproved: { type: Boolean, default: false },
    directorApprovalDate: { type: Date },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
