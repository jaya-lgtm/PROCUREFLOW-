const mongoose = require('mongoose');

const GRNItemSchema = new mongoose.Schema({
  materialId: { type: String, required: true },
  materialName: { type: String, required: true },
  quantityOrdered: { type: Number, required: true },
  quantityReceived: { type: Number, required: true },
  quantityDamaged: { type: Number, default: 0 },
  storageLocation: { type: String, required: true, default: 'SL01' },
});

const GoodsReceiptSchema = new mongoose.Schema({
  grnNumber: {
    type: String,
    required: true,
    unique: true,
  },
  poReference: {
    type: String,
    required: true, // PO Number
  },
  items: [GRNItemSchema],
  status: {
    type: String,
    enum: ['Pending Inspection', 'Accepted', 'Rejected'],
    default: 'Pending Inspection',
  },
  inspector: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('GoodsReceipt', GoodsReceiptSchema);
