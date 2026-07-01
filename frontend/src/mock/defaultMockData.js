export const defaultMaterials = [
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
    reservedStock: 10,
    incomingStock: 30,
    outgoingStock: 15,
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
    reservedStock: 5,
    incomingStock: 0,
    outgoingStock: 10,
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
    reservedStock: 2,
    incomingStock: 25,
    outgoingStock: 5,
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
    reservedStock: 15,
    incomingStock: 0,
    outgoingStock: 20,
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
    reservedStock: 1,
    incomingStock: 15,
    outgoingStock: 2,
  },
];

export const defaultVendors = [
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

export const defaultPRs = [
  {
    prNumber: 'PR-2026-0001',
    department: 'Engineering',
    requestedBy: 'Alex Rivera',
    materialId: 'MAT-1003',
    materialName: 'Industrial Gas Valves (2")',
    quantity: 25,
    expectedDate: '2026-07-20',
    priority: 'High',
    status: 'Approved',
    approvalTimeline: {
      created: '2026-06-25T10:00:00Z',
      submitted: '2026-06-25T10:05:00Z',
      approved: '2026-06-26T14:30:00Z',
      rfqGenerated: '2026-06-26T16:00:00Z',
    },
  },
  {
    prNumber: 'PR-2026-0002',
    department: 'Operations',
    requestedBy: 'Alex Rivera',
    materialId: 'MAT-1001',
    materialName: 'Raw Steel Plates (10mm)',
    quantity: 50,
    expectedDate: '2026-07-28',
    priority: 'Medium',
    status: 'Submitted',
    approvalTimeline: {
      created: '2026-07-01T09:00:00Z',
      submitted: '2026-07-01T09:12:00Z',
    },
  },
  {
    prNumber: 'PR-2026-0003',
    department: 'R&D',
    requestedBy: 'Nate Cole',
    materialId: 'MAT-1004',
    materialName: 'Electronic Control Modules',
    quantity: 10,
    expectedDate: '2026-08-05',
    priority: 'Low',
    status: 'Draft',
    approvalTimeline: {
      created: '2026-07-01T15:30:00Z',
    },
  },
];

export const defaultRFQs = [
  {
    rfqNumber: 'RFQ-2026-0001',
    prReference: 'PR-2026-0001',
    materialId: 'MAT-1003',
    materialName: 'Industrial Gas Valves (2")',
    quantity: 25,
    deliveryDate: '2026-07-20',
    deadlineDate: '2026-07-10',
    status: 'Quotation Received',
    remarks: 'Urgent replacement stock required.',
    quotations: [
      {
        vendorId: 'VND-2001',
        vendorName: 'Apex Industrial Supplies',
        price: 280, // Total $7,000
        leadTime: 6,
        qualityScore: 98,
        performanceRating: 4.8,
        status: 'Submitted',
        submittedAt: '2026-06-28T09:00:00Z',
      },
      {
        vendorId: 'VND-2002',
        vendorName: 'Global Tech Components',
        price: 310, // Total $7,750
        leadTime: 4, // Faster lead time
        qualityScore: 94,
        performanceRating: 4.3,
        status: 'Submitted',
        submittedAt: '2026-06-29T11:00:00Z',
      },
      {
        vendorId: 'VND-2003',
        vendorName: 'Matrix Metals & Alloys',
        price: 250, // Best price! Total $6,250
        leadTime: 9, // Slower lead time
        qualityScore: 90,
        performanceRating: 4.5,
        status: 'Submitted',
        submittedAt: '2026-06-29T15:45:00Z',
      },
    ],
  },
];

export const defaultPOs = [
  {
    poNumber: 'PO-2026-0001',
    rfqReference: 'RFQ-2026-0001',
    vendorId: 'VND-2003',
    vendorName: 'Matrix Metals & Alloys',
    items: [
      {
        materialId: 'MAT-1003',
        materialName: 'Industrial Gas Valves (2")',
        quantity: 25,
        price: 250,
        tax: 18,
      },
    ],
    totalQuantity: 25,
    subtotal: 6250,
    taxAmount: 1125,
    totalAmount: 7375,
    deliveryDate: '2026-07-20',
    status: 'Delivered',
    approvalWorkflow: {
      requester: 'Sarah Jenkins',
      managerApproved: true,
      managerApprovalDate: '2026-06-30T10:00:00Z',
      directorApproved: true,
      directorApprovalDate: '2026-06-30T11:00:00Z',
    },
    createdAt: '2026-06-30T09:30:00Z',
  },
  {
    poNumber: 'PO-2026-0002',
    rfqReference: null,
    vendorId: 'VND-2001',
    vendorName: 'Apex Industrial Supplies',
    items: [
      {
        materialId: 'MAT-1001',
        materialName: 'Raw Steel Plates (10mm)',
        quantity: 10,
        price: 120,
        tax: 18,
      },
    ],
    totalQuantity: 10,
    subtotal: 1200,
    taxAmount: 216,
    totalAmount: 1416,
    deliveryDate: '2026-07-25',
    status: 'Sent',
    approvalWorkflow: {
      requester: 'Sarah Jenkins',
      managerApproved: true,
      managerApprovalDate: '2026-07-01T14:00:00Z',
      directorApproved: false,
    },
    createdAt: '2026-07-01T13:45:00Z',
  },
];

export const defaultGRNs = [
  {
    grnNumber: 'GRN-2026-0001',
    poReference: 'PO-2026-0001',
    items: [
      {
        materialId: 'MAT-1003',
        materialName: 'Industrial Gas Valves (2")',
        quantityOrdered: 25,
        quantityReceived: 25,
        quantityDamaged: 0,
        storageLocation: 'SL02',
      },
    ],
    status: 'Accepted',
    inspector: 'Warehouse Supervisor',
    remarks: 'Delivered in excellent condition. No damages found.',
    createdAt: '2026-07-01T08:00:00Z',
  },
];

export const defaultInvoices = [
  {
    invoiceNumber: 'INV-2026-0001',
    poReference: 'PO-2026-0001',
    grnReference: 'GRN-2026-0001',
    vendorId: 'VND-2003',
    vendorName: 'Matrix Metals & Alloys',
    items: [
      {
        materialId: 'MAT-1003',
        materialName: 'Industrial Gas Valves (2")',
        quantityInvoice: 25,
        priceInvoice: 275, // PRICE MISMATCH! (PO price is 250, Billed 275)
        taxInvoice: 18,
      },
    ],
    subtotal: 6875,
    taxAmount: 1237.5,
    totalAmount: 8112.5,
    status: 'Blocked', // Blocked automatically because of discrepancy
    threeWayMatch: {
      priceMismatch: true,
      quantityMismatch: false,
      taxMismatch: false,
      mismatchLogs: [
        'Price mismatch on Industrial Gas Valves (2"): Billed $275.00 vs PO $250.00'
      ],
    },
    createdAt: '2026-07-01T10:00:00Z',
  },
];

export const defaultPayments = [
  {
    paymentId: 'PAY-2026-0001',
    invoiceReference: 'INV-2026-9999', // a previously completed invoice
    vendorId: 'VND-2001',
    vendorName: 'Apex Industrial Supplies',
    amount: 3500,
    paymentDate: '2026-06-15T14:00:00Z',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    transactionReference: 'TXN-998877665544',
  },
];

export const defaultActivities = [
  {
    id: 1,
    time: 'July 01, 15:30',
    type: 'PR_CREATE',
    message: 'Purchase Requisition PR-2026-0003 created in Draft by Nate Cole',
    user: 'Nate Cole',
  },
  {
    id: 2,
    time: 'July 01, 14:00',
    type: 'PO_APPROVE',
    message: 'Purchase Order PO-2026-0002 approved by Sarah Jenkins (Manager)',
    user: 'Sarah Jenkins',
  },
  {
    id: 3,
    time: 'July 01, 10:00',
    type: 'INV_RECEIVE',
    message: 'Vendor invoice INV-2026-0001 received. Automatically BLOCKED due to price mismatch.',
    user: 'System Vendor Portal',
  },
  {
    id: 4,
    time: 'July 01, 08:00',
    type: 'GRN_CREATE',
    message: 'Goods Receipt Note GRN-2026-0001 created. 25 Gas Valves received at SL02.',
    user: 'Warehouse Supervisor',
  },
  {
    id: 5,
    time: 'June 26, 16:00',
    type: 'RFQ_CREATE',
    message: 'RFQ-2026-0001 dispatched to 3 vendors for 25 Industrial Gas Valves.',
    user: 'Alex Rivera',
  },
];
