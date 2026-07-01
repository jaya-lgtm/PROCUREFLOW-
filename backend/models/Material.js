const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  materialId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  materialName: {
    type: String,
    required: [true, 'Material Name is required'],
    trim: true,
  },
  materialType: {
    type: String,
    enum: ['ROH', 'HALB', 'FERT'], // ROH: Raw, HALB: Semi-finished, FERT: Finished
    default: 'ROH',
  },
  unitOfMeasure: {
    type: String,
    enum: ['PC', 'KG', 'L', 'M', 'BOX'],
    default: 'PC',
  },
  storageLocation: {
    type: String,
    enum: ['SL01', 'SL02', 'SL03'], // Warehouse Storage Locations
    default: 'SL01',
  },
  valuationClass: {
    type: String,
    enum: ['3000', '7900', '7920'], // SAP MM valuation classes
    default: '3000',
  },
  reorderPoint: {
    type: Number,
    required: true,
    default: 10,
  },
  safetyStock: {
    type: Number,
    required: true,
    default: 5,
  },
  leadTime: {
    type: Number, // In Days
    required: true,
    default: 5,
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0,
  },
  reservedStock: {
    type: Number,
    default: 0,
  },
  incomingStock: {
    type: Number,
    default: 0,
  },
  outgoingStock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Material', MaterialSchema);
