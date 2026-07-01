const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Models
const Material = require('../models/Material');
const Vendor = require('../models/Vendor');
const PurchaseRequisition = require('../models/PurchaseRequisition');
const RFQ = require('../models/RFQ');
const PurchaseOrder = require('../models/PurchaseOrder');
const GoodsReceipt = require('../models/GoodsReceipt');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');

// ==========================================
// 1. MATERIAL MASTER (MM) ENDPOINTS
// ==========================================

router.get('/materials', async (req, res) => {
  try {
    const materials = await Material.find({});
    res.json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/materials', protect, authorize('Admin', 'Procurement Manager', 'Purchase Officer'), async (req, res) => {
  try {
    const lastMaterial = await Material.findOne().sort({ createdAt: -1 });
    let nextId = 'MAT-1001';
    if (lastMaterial && lastMaterial.materialId) {
      const numericPart = parseInt(lastMaterial.materialId.split('-')[1]) + 1;
      nextId = `MAT-${numericPart}`;
    }
    
    const material = await Material.create({
      materialId: nextId,
      ...req.body
    });
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/materials/:id', protect, authorize('Admin', 'Warehouse Manager'), async (req, res) => {
  try {
    const material = await Material.findOneAndUpdate(
      { materialId: req.params.id },
      req.body,
      { new: true }
    );
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    res.json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. VENDOR MASTER ENDPOINTS
// ==========================================

router.get('/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/vendors', protect, authorize('Admin', 'Procurement Manager'), async (req, res) => {
  try {
    const lastVendor = await Vendor.findOne().sort({ createdAt: -1 });
    let nextId = 'VND-2001';
    if (lastVendor && lastVendor.vendorId) {
      const numericPart = parseInt(lastVendor.vendorId.split('-')[1]) + 1;
      nextId = `VND-${numericPart}`;
    }
    
    const vendor = await Vendor.create({
      vendorId: nextId,
      ...req.body
    });
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. PURCHASE REQUISITIONS (PR) ENDPOINTS
// ==========================================

router.get('/prs', protect, async (req, res) => {
  try {
    let query = {};
    // Vendors only see what is relevant (if applicable, but PR is internal).
    const prs = await PurchaseRequisition.find(query);
    res.json({ success: true, data: prs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/prs', protect, authorize('Admin', 'Purchase Officer', 'Procurement Manager'), async (req, res) => {
  try {
    const lastPR = await PurchaseRequisition.findOne().sort({ prNumber: -1 });
    let nextNum = 'PR-2026-0001';
    if (lastPR && lastPR.prNumber) {
      const numericPart = parseInt(lastPR.prNumber.split('-')[2]) + 1;
      nextNum = `PR-2026-${String(numericPart).padStart(4, '0')}`;
    }
    
    const pr = await PurchaseRequisition.create({
      prNumber: nextNum,
      requestedBy: req.user.username,
      department: req.body.department || 'Procurement',
      ...req.body,
      status: 'Submitted',
      approvalTimeline: {
        created: new Date(),
        submitted: new Date()
      }
    });

    res.status(201).json({ success: true, data: pr });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/prs/:id/approve', protect, authorize('Admin', 'Procurement Manager'), async (req, res) => {
  try {
    const pr = await PurchaseRequisition.findOne({ prNumber: req.params.id });
    if (!pr) {
      return res.status(404).json({ success: false, message: 'PR not found' });
    }
    
    pr.status = req.body.approved ? 'Approved' : 'Rejected';
    pr.rejectionReason = req.body.rejectionReason || '';
    pr.approvalTimeline.approved = new Date();
    await pr.save();

    res.json({ success: true, data: pr });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. RFQ MANAGEMENT ENDPOINTS
// ==========================================

router.get('/rfqs', protect, async (req, res) => {
  try {
    const rfqs = await RFQ.find({});
    res.json({ success: true, data: rfqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/rfqs', protect, authorize('Admin', 'Purchase Officer', 'Procurement Manager'), async (req, res) => {
  try {
    const lastRFQ = await RFQ.findOne().sort({ rfqNumber: -1 });
    let nextNum = 'RFQ-2026-0001';
    if (lastRFQ && lastRFQ.rfqNumber) {
      const numericPart = parseInt(lastRFQ.rfqNumber.split('-')[2]) + 1;
      nextNum = `RFQ-2026-${String(numericPart).padStart(4, '0')}`;
    }

    const { vendorIds, materialId, materialName, quantity, deliveryDate, deadlineDate, prReference, remarks } = req.body;
    
    // Build list of vendors
    const vendorList = await Vendor.find({ vendorId: { $in: vendorIds } });
    const quotations = vendorList.map(v => ({
      vendorId: v.vendorId,
      vendorName: v.vendorName,
      price: null,
      leadTime: null,
      qualityScore: v.performanceMetrics.qualityScore,
      performanceRating: v.rating,
      status: 'Pending'
    }));

    const rfq = await RFQ.create({
      rfqNumber: nextNum,
      prReference,
      materialId,
      materialName,
      quantity,
      deliveryDate,
      deadlineDate,
      remarks,
      status: 'Sent',
      quotations
    });

    if (prReference) {
      await PurchaseRequisition.findOneAndUpdate(
        { prNumber: prReference },
        { status: 'Converted To RFQ', 'approvalTimeline.rfqGenerated': new Date() }
      );
    }

    res.status(201).json({ success: true, data: rfq });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/rfqs/:id/quotation', protect, authorize('Admin', 'Vendor', 'Purchase Officer'), async (req, res) => {
  try {
    const { vendorId, price, leadTime } = req.body;
    const rfq = await RFQ.findOne({ rfqNumber: req.params.id });
    if (!rfq) {
      return res.status(404).json({ success: false, message: 'RFQ not found' });
    }

    const qIndex = rfq.quotations.findIndex(q => q.vendorId === vendorId);
    if (qIndex === -1) {
      return res.status(404).json({ success: false, message: 'Vendor not listed in this RFQ' });
    }

    rfq.quotations[qIndex].price = price;
    rfq.quotations[qIndex].leadTime = leadTime;
    rfq.quotations[qIndex].status = 'Submitted';
    rfq.quotations[qIndex].submittedAt = new Date();

    // Check if all quotations are submitted
    const allSubmitted = rfq.quotations.every(q => q.status === 'Submitted');
    if (allSubmitted) {
      rfq.status = 'Quotation Received';
    }

    await rfq.save();
    res.json({ success: true, data: rfq });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. PURCHASE ORDERS (PO) ENDPOINTS
// ==========================================

router.get('/pos', protect, async (req, res) => {
  try {
    const pos = await PurchaseOrder.find({});
    res.json({ success: true, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/pos', protect, authorize('Admin', 'Procurement Manager'), async (req, res) => {
  try {
    const lastPO = await PurchaseOrder.findOne().sort({ poNumber: -1 });
    let nextNum = 'PO-2026-0001';
    if (lastPO && lastPO.poNumber) {
      const numericPart = parseInt(lastPO.poNumber.split('-')[2]) + 1;
      nextNum = `PO-2026-${String(numericPart).padStart(4, '0')}`;
    }

    const { vendorId, vendorName, items, deliveryDate, rfqReference } = req.body;
    
    // Math
    let totalQuantity = 0;
    let subtotal = 0;
    let taxAmount = 0;

    items.forEach(item => {
      totalQuantity += item.quantity;
      const itemSubtotal = item.quantity * item.price;
      subtotal += itemSubtotal;
      taxAmount += itemSubtotal * (item.tax / 100);
    });

    const totalAmount = subtotal + taxAmount;

    const po = await PurchaseOrder.create({
      poNumber: nextNum,
      rfqReference,
      vendorId,
      vendorName,
      items,
      totalQuantity,
      subtotal,
      taxAmount,
      totalAmount,
      deliveryDate,
      status: 'Created',
      approvalWorkflow: {
        requester: req.user.username,
        managerApproved: true, // Auto-approved by the manager who creates it
        managerApprovalDate: new Date()
      }
    });

    if (rfqReference) {
      await RFQ.findOneAndUpdate({ rfqNumber: rfqReference }, { status: 'Closed' });
    }

    res.status(201).json({ success: true, data: po });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/pos/:id/status', protect, async (req, res) => {
  try {
    const po = await PurchaseOrder.findOneAndUpdate(
      { poNumber: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!po) {
      return res.status(404).json({ success: false, message: 'PO not found' });
    }
    res.json({ success: true, data: po });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 6. GOODS RECEIPT NOTE (GRN) ENDPOINTS
// ==========================================

router.get('/grns', protect, async (req, res) => {
  try {
    const grns = await GoodsReceipt.find({});
    res.json({ success: true, data: grns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/grns', protect, authorize('Admin', 'Warehouse Manager'), async (req, res) => {
  try {
    const lastGRN = await GoodsReceipt.findOne().sort({ grnNumber: -1 });
    let nextNum = 'GRN-2026-0001';
    if (lastGRN && lastGRN.grnNumber) {
      const numericPart = parseInt(lastGRN.grnNumber.split('-')[2]) + 1;
      nextNum = `GRN-2026-${String(numericPart).padStart(4, '0')}`;
    }

    const { poReference, items } = req.body;
    
    const grn = await GoodsReceipt.create({
      grnNumber: nextNum,
      poReference,
      items,
      status: 'Accepted',
      inspector: req.user.username
    });

    // Update Materials Stock Levels automatically!
    for (const item of items) {
      const actualReceived = item.quantityReceived - (item.quantityDamaged || 0);
      await Material.findOneAndUpdate(
        { materialId: item.materialId },
        { $inc: { currentStock: actualReceived } }
      );
    }

    // Set PO status to Delivered (or Partially Delivered)
    const po = await PurchaseOrder.findOne({ poNumber: poReference });
    if (po) {
      let allDelivered = true;
      po.items.forEach(poItem => {
        const receivedItem = items.find(i => i.materialId === poItem.materialId);
        if (!receivedItem || receivedItem.quantityReceived < poItem.quantity) {
          allDelivered = false;
        }
      });
      po.status = allDelivered ? 'Delivered' : 'Partially Delivered';
      await po.save();
    }

    res.status(201).json({ success: true, data: grn });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 7. INVOICE VERIFICATION ENDPOINTS
// ==========================================

router.get('/invoices', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.json({ success: true, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/invoices', protect, authorize('Admin', 'Vendor', 'Finance Manager'), async (req, res) => {
  try {
    const lastInv = await Invoice.findOne().sort({ invoiceNumber: -1 });
    let nextNum = 'INV-2026-0001';
    if (lastInv && lastInv.invoiceNumber) {
      const numericPart = parseInt(lastInv.invoiceNumber.split('-')[2]) + 1;
      nextNum = `INV-2026-${String(numericPart).padStart(4, '0')}`;
    }

    const { poReference, grnReference, items, subtotal, taxAmount, totalAmount, vendorId, vendorName } = req.body;

    // PERFORM SAP 3-WAY MATCHING ALGORITHM!
    const po = await PurchaseOrder.findOne({ poNumber: poReference });
    const grn = await GoodsReceipt.findOne({ grnNumber: grnReference });

    let priceMismatch = false;
    let quantityMismatch = false;
    let taxMismatch = false;
    const mismatchLogs = [];

    if (!po) mismatchLogs.push('PO Reference does not exist.');
    if (!grn) mismatchLogs.push('GRN Reference does not exist.');

    if (po && grn) {
      items.forEach(invItem => {
        // Compare with PO price
        const poItem = po.items.find(i => i.materialId === invItem.materialId);
        if (poItem) {
          if (invItem.priceInvoice !== poItem.price) {
            priceMismatch = true;
            mismatchLogs.push(`Price mismatch on ${invItem.materialName}: Billed $${invItem.priceInvoice} vs PO $${poItem.price}`);
          }
          if (invItem.taxInvoice !== poItem.tax) {
            taxMismatch = true;
            mismatchLogs.push(`Tax mismatch on ${invItem.materialName}: Billed ${invItem.taxInvoice}% vs PO ${poItem.tax}%`);
          }
        } else {
          priceMismatch = true;
          mismatchLogs.push(`Material ${invItem.materialName} not present in PO.`);
        }

        // Compare with GRN quantity (Quantity invoiced should not exceed Quantity received)
        const grnItem = grn.items.find(i => i.materialId === invItem.materialId);
        if (grnItem) {
          const acceptedQty = grnItem.quantityReceived - grnItem.quantityDamaged;
          if (invItem.quantityInvoice > acceptedQty) {
            quantityMismatch = true;
            mismatchLogs.push(`Quantity mismatch on ${invItem.materialName}: Invoiced ${invItem.quantityInvoice} vs Received ${acceptedQty}`);
          }
        } else {
          quantityMismatch = true;
          mismatchLogs.push(`Material ${invItem.materialName} not received in GRN.`);
        }
      });
    }

    const status = (priceMismatch || quantityMismatch || taxMismatch) ? 'Blocked' : 'Pending';

    const invoice = await Invoice.create({
      invoiceNumber: nextNum,
      poReference,
      grnReference,
      vendorId,
      vendorName,
      items,
      subtotal,
      taxAmount,
      totalAmount,
      status,
      threeWayMatch: {
        priceMismatch,
        quantityMismatch,
        taxMismatch,
        mismatchLogs
      }
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/invoices/:id/verify', protect, authorize('Admin', 'Finance Manager'), async (req, res) => {
  try {
    const { action } = req.body; // 'Verify' or 'Block'
    const invoice = await Invoice.findOne({ invoiceNumber: req.params.id });
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    invoice.status = action === 'Verify' ? 'Verified' : 'Blocked';
    invoice.verifiedBy = req.user.username;
    invoice.verifiedAt = new Date();
    await invoice.save();

    // If verified, auto-schedule a payment record in FICO AP!
    if (invoice.status === 'Verified') {
      const lastPay = await Payment.findOne().sort({ paymentId: -1 });
      let nextPayId = 'PAY-2026-0001';
      if (lastPay && lastPay.paymentId) {
        const numericPart = parseInt(lastPay.paymentId.split('-')[2]) + 1;
        nextPayId = `PAY-2026-${String(numericPart).padStart(4, '0')}`;
      }

      await Payment.create({
        paymentId: nextPayId,
        invoiceReference: invoice.invoiceNumber,
        vendorId: invoice.vendorId,
        vendorName: invoice.vendorName,
        amount: invoice.totalAmount,
        status: 'Scheduled',
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // NET30 schedule
      });
    }

    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 8. PAYMENT MANAGEMENT ENDPOINTS
// ==========================================

router.get('/payments', protect, async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/payments/:id/process', protect, authorize('Admin', 'Finance Manager'), async (req, res) => {
  try {
    const { paymentMethod, transactionReference } = req.body;
    const payment = await Payment.findOne({ paymentId: req.params.id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    payment.status = 'Paid';
    payment.paymentMethod = paymentMethod || 'Bank Transfer';
    payment.transactionReference = transactionReference || `TXN${Date.now()}`;
    payment.paymentDate = new Date();
    await payment.save();

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 9. METRICS & KPI DASHBOARD
// ==========================================

router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const [materials, vendors, prs, rfqs, pos, grns, invoices, payments] = await Promise.all([
      Material.find({}),
      Vendor.find({}),
      PurchaseRequisition.find({}),
      RFQ.find({}),
      PurchaseOrder.find({}),
      GoodsReceipt.find({}),
      Invoice.find({}),
      Payment.find({})
    ]);

    // Aggregate spend
    const totalSpend = pos.reduce((sum, po) => sum + (po.status !== 'Closed' ? po.totalAmount : 0), 0);
    const activeVendors = vendors.length;
    const openPOs = pos.filter(po => ['Created', 'Approved', 'Sent', 'Partially Delivered'].includes(po.status)).length;
    
    // Approvals: Draft PRs or Blocked Invoices or POs awaiting dispatch
    const pendingApprovals = prs.filter(pr => pr.status === 'Submitted').length + invoices.filter(inv => inv.status === 'Pending').length;

    // Inventory value calculation
    let inventoryValue = 0;
    materials.forEach(mat => {
      // rough average valuation
      const valRate = mat.valuationClass === '3000' ? 120 : mat.valuationClass === '7900' ? 350 : 800;
      inventoryValue += mat.currentStock * valRate;
    });

    res.json({
      success: true,
      data: {
        totalSpend,
        activeVendors,
        openPOs,
        pendingApprovals,
        inventoryValue,
        materialCount: materials.length,
        rfqCount: rfqs.length,
        invoiceCount: invoices.length,
        paymentCount: payments.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
