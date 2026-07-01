const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Material = require('../models/Material');
const PurchaseRequisition = require('../models/PurchaseRequisition');
const RFQ = require('../models/RFQ');
const PurchaseOrder = require('../models/PurchaseOrder');
const GoodsReceipt = require('../models/GoodsReceipt');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://localhost:27017/procureflow_s4';
    await mongoose.connect(connStr);
    console.log('Connected to DB for seeding...');

    // Clear all databases
    await User.deleteMany();
    await Vendor.deleteMany();
    await Material.deleteMany();
    await PurchaseRequisition.deleteMany();
    await RFQ.deleteMany();
    await PurchaseOrder.deleteMany();
    await GoodsReceipt.deleteMany();
    await Invoice.deleteMany();
    await Payment.deleteMany();

    console.log('Cleared existing data.');

    // Seed Vendors
    const vendors = [
      {
        vendorId: 'VND-2001',
        vendorName: 'Apex Industrial Supplies',
        gstNumber: '29AAAAA1111A1Z1',
        email: 'apex@supplies.com',
        phone: '+1-555-0199',
        address: '100 Industrial Pkwy, Sector 4, Chicago, IL',
        bankDetails: {
          accountNo: '123456789012',
          bankName: 'JPMorgan Chase',
          ifsc: 'CHASUS33XXX',
        },
        currency: 'USD',
        paymentTerms: 'NET30',
        purchasingOrganization: 'PO10',
        performanceMetrics: {
          onTimeDelivery: 96,
          qualityScore: 98,
          costEfficiency: 92,
          responseTime: 95,
        },
        rating: 4.8,
      },
      {
        vendorId: 'VND-2002',
        vendorName: 'Global Tech Components',
        gstNumber: '29BBBBB2222B2Z2',
        email: 'sales@globaltech.com',
        phone: '+1-555-0244',
        address: '50 Silicon Rd, Tech District, San Jose, CA',
        bankDetails: {
          accountNo: '987654321098',
          bankName: 'Silicon Valley Bank',
          ifsc: 'SIVASV22XXX',
        },
        currency: 'USD',
        paymentTerms: 'NET15',
        purchasingOrganization: 'PO10',
        performanceMetrics: {
          onTimeDelivery: 92,
          qualityScore: 94,
          costEfficiency: 88,
          responseTime: 90,
        },
        rating: 4.3,
      },
      {
        vendorId: 'VND-2003',
        vendorName: 'Matrix Metals & Alloys',
        gstNumber: '29CCCCC3333C3Z3',
        email: 'matrix@alloys.com',
        phone: '+1-555-0377',
        address: '75 Metallurgy Way, Industrial Zone, Pittsburgh, PA',
        bankDetails: {
          accountNo: '543216789043',
          bankName: 'PNC Bank',
          ifsc: 'PNCBUS44XXX',
        },
        currency: 'USD',
        paymentTerms: 'NET45',
        purchasingOrganization: 'PO10',
        performanceMetrics: {
          onTimeDelivery: 94,
          qualityScore: 90,
          costEfficiency: 96,
          responseTime: 89,
        },
        rating: 4.5,
      },
    ];

    await Vendor.insertMany(vendors);
    console.log('Seeded vendors.');

    // Seed Materials
    const materials = [
      {
        materialId: 'MAT-1001',
        materialName: 'Raw Steel Plates (10mm)',
        materialType: 'ROH',
        unitOfMeasure: 'PC',
        storageLocation: 'SL01',
        valuationClass: '3000',
        reorderPoint: 50,
        safetyStock: 15,
        leadTime: 7,
        currentStock: 120,
      },
      {
        materialId: 'MAT-1002',
        materialName: 'Copper Wiring Spool (500m)',
        materialType: 'ROH',
        unitOfMeasure: 'BOX',
        storageLocation: 'SL01',
        valuationClass: '3000',
        reorderPoint: 20,
        safetyStock: 5,
        leadTime: 5,
        currentStock: 45,
      },
      {
        materialId: 'MAT-1003',
        materialName: 'Industrial Gas Valves (2")',
        materialType: 'HALB',
        unitOfMeasure: 'PC',
        storageLocation: 'SL02',
        valuationClass: '7900',
        reorderPoint: 15,
        safetyStock: 4,
        leadTime: 10,
        currentStock: 8, // Low Stock Alert
      },
      {
        materialId: 'MAT-1004',
        materialName: 'Electronic Control Modules',
        materialType: 'FERT',
        unitOfMeasure: 'PC',
        storageLocation: 'SL03',
        valuationClass: '7920',
        reorderPoint: 30,
        safetyStock: 10,
        leadTime: 15,
        currentStock: 75,
      },
      {
        materialId: 'MAT-1005',
        materialName: 'Hydraulic Actuator Pistons',
        materialType: 'HALB',
        unitOfMeasure: 'PC',
        storageLocation: 'SL02',
        valuationClass: '7900',
        reorderPoint: 10,
        safetyStock: 3,
        leadTime: 8,
        currentStock: 2, // Low Stock Alert
      },
    ];

    await Material.insertMany(materials);
    console.log('Seeded materials.');

    // Seed Users with roles
    const salt = await bcrypt.genSalt(10);
    const hashPassword = async (pwd) => await bcrypt.hash(pwd, salt);

    const users = [
      {
        username: 'System Admin',
        email: 'admin@procureflow.com',
        password: await hashPassword('admin123'),
        role: 'Admin',
      },
      {
        username: 'Sarah Jenkins (Manager)',
        email: 'manager@procureflow.com',
        password: await hashPassword('manager123'),
        role: 'Procurement Manager',
      },
      {
        username: 'Alex Rivera (Officer)',
        email: 'officer@procureflow.com',
        password: await hashPassword('officer123'),
        role: 'Purchase Officer',
      },
      {
        username: 'David Vance (Finance)',
        email: 'finance@procureflow.com',
        password: await hashPassword('finance123'),
        role: 'Finance Manager',
      },
      {
        username: 'Warehouse Supervisor',
        email: 'warehouse@procureflow.com',
        password: await hashPassword('warehouse123'),
        role: 'Warehouse Manager',
      },
      {
        username: 'Apex Suppliers Rep',
        email: 'vendorA@procureflow.com',
        password: await hashPassword('vendor123'),
        role: 'Vendor',
        vendorRef: 'VND-2001',
      },
    ];

    await User.insertMany(users);
    console.log('Seeded users.');

    console.log('Database Seeding Successful.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
