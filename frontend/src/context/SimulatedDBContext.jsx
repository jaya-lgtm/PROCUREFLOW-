import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  defaultMaterials,
  defaultVendors,
  defaultPRs,
  defaultRFQs,
  defaultPOs,
  defaultGRNs,
  defaultInvoices,
  defaultPayments,
  defaultActivities
} from '../mock/defaultMockData';

const SimulatedDBContext = createContext();

export const useSimulatedDB = () => useContext(SimulatedDBContext);

export const SimulatedDBProvider = ({ children }) => {
  // Modes: 'demo' (in-browser mock) or 'live' (queries Express server)
  const [dbMode, setDbMode] = useState(() => {
    return localStorage.getItem('procureflow_db_mode') || 'demo';
  });

  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem('procureflow_active_role') || 'Admin';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('procureflow_current_user');
    return saved ? JSON.parse(saved) : { username: 'System Admin', email: 'admin@procureflow.com', role: 'Admin' };
  });

  // State for all schemas
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [prs, setPRs] = useState([]);
  const [rfqs, setRFQs] = useState([]);
  const [pos, setPOs] = useState([]);
  const [grns, setGRNs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Base URL for API
  const API_URL = 'http://localhost:5000/api';

  // Load Initial Data
  useEffect(() => {
    if (dbMode === 'demo') {
      const loadLocal = (key, defaultVal) => {
        const saved = localStorage.getItem(key);
        if (saved) return JSON.parse(saved);
        localStorage.setItem(key, JSON.stringify(defaultVal));
        return defaultVal;
      };

      setMaterials(loadLocal('procureflow_materials', defaultMaterials));
      setVendors(loadLocal('procureflow_vendors', defaultVendors));
      setPRs(loadLocal('procureflow_prs', defaultPRs));
      setRFQs(loadLocal('procureflow_rfqs', defaultRFQs));
      setPOs(loadLocal('procureflow_pos', defaultPOs));
      setGRNs(loadLocal('procureflow_grns', defaultGRNs));
      setInvoices(loadLocal('procureflow_invoices', defaultInvoices));
      setPayments(loadLocal('procureflow_payments', defaultPayments));
      setActivities(loadLocal('procureflow_activities', defaultActivities));
      setNotifications([
        { id: 1, text: 'PR-2026-0002 requires manager approval.', read: false, time: '2h ago' },
        { id: 2, text: 'INV-2026-0001 automatically blocked: Price Mismatch detected.', read: false, time: '1d ago' },
      ]);
    } else {
      // Live API mode - fetch from Express API
      fetchLiveStats();
    }
  }, [dbMode]);

  // Fetch Live Data Helper
  const fetchLiveStats = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser?.token || ''}`,
      };

      const resMat = await fetch(`${API_URL}/materials`, { headers }).then(r => r.json());
      const resVen = await fetch(`${API_URL}/vendors`, { headers }).then(r => r.json());
      const resPR = await fetch(`${API_URL}/prs`, { headers }).then(r => r.json());
      const resRFQ = await fetch(`${API_URL}/rfqs`, { headers }).then(r => r.json());
      const resPO = await fetch(`${API_URL}/pos`, { headers }).then(r => r.json());
      const resGRN = await fetch(`${API_URL}/grns`, { headers }).then(r => r.json());
      const resInv = await fetch(`${API_URL}/invoices`, { headers }).then(r => r.json());
      const resPay = await fetch(`${API_URL}/payments`, { headers }).then(r => r.json());

      if (resMat.success) setMaterials(resMat.data);
      if (resVen.success) setVendors(resVen.data);
      if (resPR.success) setPRs(resPR.data);
      if (resRFQ.success) setRFQs(resRFQ.data);
      if (resPO.success) setPOs(resPO.data);
      if (resGRN.success) setGRNs(resGRN.data);
      if (resInv.success) setInvoices(resInv.data);
      if (resPay.success) setPayments(resPay.data);

      setActivities(defaultActivities); // retain log history
    } catch (error) {
      console.error('Error fetching live data, falling back to local database.', error);
      setDbMode('demo');
      localStorage.setItem('procureflow_db_mode', 'demo');
    }
  };

  // Sync state to local storage helper (in demo mode)
  const syncLocal = (key, data, setter) => {
    setter(data);
    if (dbMode === 'demo') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // ==========================================
  // SYSTEM WIDE METRIC MUTATIONS (DEMO)
  // ==========================================

  const addActivity = (msg, type = 'INFO') => {
    const newAct = {
      id: Date.now(),
      time: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      type,
      message: msg,
      user: currentUser.username,
    };
    syncLocal('procureflow_activities', [newAct, ...activities], setActivities);
  };

  const addNotification = (text) => {
    const newNotif = {
      id: Date.now(),
      text,
      read: false,
      time: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const switchRole = (role) => {
    setActiveRole(role);
    localStorage.setItem('procureflow_active_role', role);
    
    // Simulate user logging in under that role
    let username = 'User';
    let email = 'user@procureflow.com';
    let vendorRef = null;

    if (role === 'Admin') { username = 'System Admin'; email = 'admin@procureflow.com'; }
    else if (role === 'Procurement Manager') { username = 'Sarah Jenkins (Manager)'; email = 'manager@procureflow.com'; }
    else if (role === 'Purchase Officer') { username = 'Alex Rivera (Officer)'; email = 'officer@procureflow.com'; }
    else if (role === 'Finance Manager') { username = 'David Vance (Finance)'; email = 'finance@procureflow.com'; }
    else if (role === 'Warehouse Manager') { username = 'Warehouse Supervisor'; email = 'warehouse@procureflow.com'; }
    else if (role === 'Vendor') { username = 'Apex Suppliers Rep'; email = 'vendorA@procureflow.com'; vendorRef = 'VND-2001'; }

    const updatedUser = { username, email, role, vendorRef };
    setCurrentUser(updatedUser);
    localStorage.setItem('procureflow_current_user', JSON.stringify(updatedUser));
    
    addActivity(`Switched role to ${role}`, 'AUTH_SWITCH');
  };

  // Switch API Mode
  const toggleDBMode = (mode) => {
    setDbMode(mode);
    localStorage.setItem('procureflow_db_mode', mode);
    addActivity(`Database mode switched to ${mode.toUpperCase()}`, 'SYSTEM');
  };

  // Auth Operations
  const login = async (email, password) => {
    if (dbMode === 'demo') {
      // Mock Auth
      let role = 'Purchase Officer';
      let username = 'User';
      let vendorRef = null;

      if (email.includes('admin')) { role = 'Admin'; username = 'System Admin'; }
      else if (email.includes('manager')) { role = 'Procurement Manager'; username = 'Sarah Jenkins'; }
      else if (email.includes('finance')) { role = 'Finance Manager'; username = 'David Vance'; }
      else if (email.includes('warehouse')) { role = 'Warehouse Manager'; username = 'Warehouse Supervisor'; }
      else if (email.includes('vendor')) { role = 'Vendor'; username = 'Apex Suppliers Rep'; vendorRef = 'VND-2001'; }

      const user = { username, email, role, vendorRef };
      setCurrentUser(user);
      setActiveRole(role);
      localStorage.setItem('procureflow_current_user', JSON.stringify(user));
      localStorage.setItem('procureflow_active_role', role);
      addActivity(`${username} logged in successfully`, 'AUTH');
      return { success: true, data: user };
    } else {
      // Live login
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }).then(r => r.json());

        if (res.success) {
          setCurrentUser(res.data);
          setActiveRole(res.data.role);
          localStorage.setItem('procureflow_current_user', JSON.stringify(res.data));
          localStorage.setItem('procureflow_active_role', res.data.role);
          addActivity(`${res.data.username} logged in (Live mode)`, 'AUTH');
          return res;
        }
        return { success: false, message: res.message || 'Login failed.' };
      } catch (err) {
        return { success: false, message: 'Server is not running. Please launch Express backend.' };
      }
    }
  };

  const register = async (username, email, password, role) => {
    if (dbMode === 'demo') {
      const user = { username, email, role, vendorRef: role === 'Vendor' ? 'VND-2001' : null };
      setCurrentUser(user);
      setActiveRole(role);
      localStorage.setItem('procureflow_current_user', JSON.stringify(user));
      localStorage.setItem('procureflow_active_role', role);
      addActivity(`New account ${username} registered`, 'AUTH');
      return { success: true };
    } else {
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, role }),
        }).then(r => r.json());
        return res;
      } catch (err) {
        return { success: false, message: 'Server unavailable.' };
      }
    }
  };

  // Material Operations
  const addMaterial = (newMat) => {
    const numPart = parseInt(materials[materials.length - 1]?.materialId.split('-')[1] || 1000) + 1;
    const formattedMat = {
      materialId: `MAT-${numPart}`,
      currentStock: 0,
      reservedStock: 0,
      incomingStock: 0,
      outgoingStock: 0,
      ...newMat,
    };
    syncLocal('procureflow_materials', [...materials, formattedMat], setMaterials);
    addActivity(`Material Master entry ${formattedMat.materialId} (${formattedMat.materialName}) created`, 'MM');
  };

  const editMaterial = (updatedMat) => {
    const updated = materials.map(m => m.materialId === updatedMat.materialId ? { ...m, ...updatedMat } : m);
    syncLocal('procureflow_materials', updated, setMaterials);
    addActivity(`Material Master entry ${updatedMat.materialId} modified`, 'MM');
  };

  // Requisitions (PR) Operations
  const addPR = (prData) => {
    const num = String(prs.length + 1).padStart(4, '0');
    const newPr = {
      prNumber: `PR-2026-${num}`,
      requestedBy: currentUser.username,
      department: prData.department || 'Procurement',
      status: 'Submitted',
      approvalTimeline: {
        created: new Date().toISOString(),
        submitted: new Date().toISOString(),
      },
      ...prData,
    };
    syncLocal('procureflow_prs', [...prs, newPr], setPRs);
    addActivity(`Requisition ${newPr.prNumber} submitted for approval`, 'PR');
    addNotification(`New Purchase Requisition ${newPr.prNumber} submitted by ${newPr.requestedBy}.`);
  };

  const approvePR = (prNumber, approved, comments = '') => {
    const updated = prs.map(pr => {
      if (pr.prNumber === prNumber) {
        return {
          ...pr,
          status: approved ? 'Approved' : 'Rejected',
          rejectionReason: comments,
          approvalTimeline: {
            ...pr.approvalTimeline,
            approved: new Date().toISOString(),
          },
        };
      }
      return pr;
    });
    syncLocal('procureflow_prs', updated, setPRs);
    addActivity(`Requisition ${prNumber} was ${approved ? 'APPROVED' : 'REJECTED'}`, 'PR');
  };

  // RFQ Operations
  const addRFQ = (rfqData) => {
    const num = String(rfqs.length + 1).padStart(4, '0');
    const vendorList = vendors.filter(v => rfqData.vendorIds.includes(v.vendorId));
    
    // Auto-create blank bids
    const quotations = vendorList.map(v => ({
      vendorId: v.vendorId,
      vendorName: v.vendorName,
      price: null,
      leadTime: null,
      qualityScore: v.performanceMetrics.qualityScore,
      performanceRating: v.rating,
      status: 'Pending',
    }));

    const newRfq = {
      rfqNumber: `RFQ-2026-${num}`,
      status: 'Sent',
      quotations,
      createdAt: new Date().toISOString(),
      ...rfqData,
    };

    syncLocal('procureflow_rfqs', [...rfqs, newRfq], setRFQs);

    if (rfqData.prReference) {
      const updatedPRs = prs.map(pr => {
        if (pr.prNumber === rfqData.prReference) {
          return {
            ...pr,
            status: 'Converted To RFQ',
            approvalTimeline: { ...pr.approvalTimeline, rfqGenerated: new Date().toISOString() },
          };
        }
        return pr;
      });
      syncLocal('procureflow_prs', updatedPRs, setPRs);
    }

    addActivity(`RFQ ${newRfq.rfqNumber} generated and dispatched to suppliers`, 'RFQ');
  };

  // Submit vendor bids (simulates vendor portals submitting pricing)
  const submitQuotation = (rfqNumber, vendorId, price, leadTime) => {
    const updated = rfqs.map(rfq => {
      if (rfq.rfqNumber === rfqNumber) {
        const updatedQuotes = rfq.quotations.map(q => {
          if (q.vendorId === vendorId) {
            return {
              ...q,
              price: parseFloat(price),
              leadTime: parseInt(leadTime),
              status: 'Submitted',
              submittedAt: new Date().toISOString(),
            };
          }
          return q;
        });

        const allSubmitted = updatedQuotes.every(q => q.status === 'Submitted');

        return {
          ...rfq,
          quotations: updatedQuotes,
          status: allSubmitted ? 'Quotation Received' : rfq.status,
        };
      }
      return rfq;
    });

    syncLocal('procureflow_rfqs', updated, setRFQs);
    addActivity(`Bidding quote submitted by supplier ${vendorId} for ${rfqNumber}`, 'RFQ');
  };

  // Purchase Order Operations
  const createPO = (poData) => {
    const num = String(pos.length + 1).padStart(4, '0');
    
    // Auto calculate taxes
    let subtotal = 0;
    let taxAmount = 0;
    poData.items.forEach(item => {
      const lineSub = item.quantity * item.price;
      subtotal += lineSub;
      taxAmount += lineSub * (item.tax / 100);
    });

    const newPO = {
      poNumber: `PO-2026-${num}`,
      status: 'Created',
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      totalQuantity: poData.items.reduce((sum, item) => sum + item.quantity, 0),
      approvalWorkflow: {
        requester: currentUser.username,
        managerApproved: true,
        managerApprovalDate: new Date().toISOString(),
        directorApproved: true,
        directorApprovalDate: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      ...poData,
    };

    syncLocal('procureflow_pos', [...pos, newPO], setPOs);

    // Auto adjust material incoming levels
    poData.items.forEach(item => {
      const matsUpdated = materials.map(m => {
        if (m.materialId === item.materialId) {
          return { ...m, incomingStock: (m.incomingStock || 0) + item.quantity };
        }
        return m;
      });
      syncLocal('procureflow_materials', matsUpdated, setMaterials);
    });

    // Close RFQ if any
    if (poData.rfqReference) {
      const updatedRFQs = rfqs.map(rfq => rfq.rfqNumber === poData.rfqReference ? { ...rfq, status: 'Closed' } : rfq);
      syncLocal('procureflow_rfqs', updatedRFQs, setRFQs);
    }

    addActivity(`Purchase Order ${newPO.poNumber} issued to ${newPO.vendorName}`, 'PO');
    return newPO;
  };

  // Goods Receipt (GRN) Operations
  const createGRN = (grnData) => {
    const num = String(grns.length + 1).padStart(4, '0');
    const newGrn = {
      grnNumber: `GRN-2026-${num}`,
      status: 'Accepted',
      inspector: currentUser.username,
      createdAt: new Date().toISOString(),
      ...grnData,
    };

    syncLocal('procureflow_grns', [...grns, newGrn], setGRNs);

    // Update Materials actual inventory levels!
    grnData.items.forEach(item => {
      const actualReceived = item.quantityReceived - (item.quantityDamaged || 0);
      const updatedMats = materials.map(m => {
        if (m.materialId === item.materialId) {
          return {
            ...m,
            currentStock: m.currentStock + actualReceived,
            incomingStock: Math.max(0, m.incomingStock - item.quantityOrdered),
          };
        }
        return m;
      });
      syncLocal('procureflow_materials', updatedMats, setMaterials);
    });

    // Update PO Delivery Status
    const po = pos.find(p => p.poNumber === grnData.poReference);
    if (po) {
      let allReceived = true;
      po.items.forEach(poItem => {
        const grItem = grnData.items.find(i => i.materialId === poItem.materialId);
        if (!grItem || grItem.quantityReceived < poItem.quantity) {
          allReceived = false;
        }
      });

      const updatedPOs = pos.map(p => {
        if (p.poNumber === grnData.poReference) {
          return { ...p, status: allReceived ? 'Delivered' : 'Partially Delivered' };
        }
        return p;
      });
      syncLocal('procureflow_pos', updatedPOs, setPOs);
    }

    addActivity(`Goods Receipt ${newGrn.grnNumber} processed. Warehouse stocks updated.`, 'GRN');
  };

  // Invoice Verification (3-Way Matching)
  const createInvoice = (invData) => {
    const num = String(invoices.length + 1).padStart(4, '0');
    
    // Fetch PO and GRN details
    const po = pos.find(p => p.poNumber === invData.poReference);
    const grn = grns.find(g => g.poReference === invData.poReference);

    let priceMismatch = false;
    let quantityMismatch = false;
    let taxMismatch = false;
    const mismatchLogs = [];

    if (!po) mismatchLogs.push('PO reference invalid.');
    if (!grn) mismatchLogs.push('GRN reference invalid.');

    if (po && grn) {
      invData.items.forEach(invItem => {
        // Price Compare
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
        }
        
        // Quantity Compare (Quantity Invoiced vs Quantity Received)
        const grItem = grn.items.find(i => i.materialId === invItem.materialId);
        if (grItem) {
          const acceptedQty = grItem.quantityReceived - grItem.quantityDamaged;
          if (invItem.quantityInvoice > acceptedQty) {
            quantityMismatch = true;
            mismatchLogs.push(`Quantity mismatch on ${invItem.materialName}: Billed ${invItem.quantityInvoice} vs Received ${acceptedQty}`);
          }
        }
      });
    }

    const autoStatus = (priceMismatch || quantityMismatch || taxMismatch) ? 'Blocked' : 'Pending';

    const newInv = {
      invoiceNumber: `INV-2026-${num}`,
      status: autoStatus,
      threeWayMatch: {
        priceMismatch,
        quantityMismatch,
        taxMismatch,
        mismatchLogs,
      },
      createdAt: new Date().toISOString(),
      ...invData,
    };

    syncLocal('procureflow_invoices', [...invoices, newInv], setInvoices);
    
    if (autoStatus === 'Blocked') {
      addNotification(`Invoice ${newInv.invoiceNumber} automatically BLOCKED due to discrepancy.`);
    }

    addActivity(`Invoice ${newInv.invoiceNumber} logged. Verification State: ${autoStatus}`, 'INVOICE');
  };

  const verifyInvoice = (invoiceNumber, action) => {
    const updated = invoices.map(inv => {
      if (inv.invoiceNumber === invoiceNumber) {
        return {
          ...inv,
          status: action === 'Verify' ? 'Verified' : 'Blocked',
          verifiedBy: currentUser.username,
          verifiedAt: new Date().toISOString(),
        };
      }
      return inv;
    });

    syncLocal('procureflow_invoices', updated, setInvoices);

    // If verified, generate a Payment ledger record
    if (action === 'Verify') {
      const inv = invoices.find(i => i.invoiceNumber === invoiceNumber);
      const num = String(payments.length + 1).padStart(4, '0');
      const newPay = {
        paymentId: `PAY-2026-${num}`,
        invoiceReference: invoiceNumber,
        vendorId: inv.vendorId,
        vendorName: inv.vendorName,
        amount: inv.totalAmount,
        status: 'Scheduled',
        paymentMethod: 'Bank Transfer',
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Net 30
      };
      syncLocal('procureflow_payments', [...payments, newPay], setPayments);
      addActivity(`Invoice ${invoiceNumber} verified. Payment ${newPay.paymentId} scheduled.`, 'INVOICE');
    } else {
      addActivity(`Invoice ${invoiceNumber} blocked manually`, 'INVOICE');
    }
  };

  // Payment Operations
  const processPayment = (paymentId, method, txnRef) => {
    const updated = payments.map(pay => {
      if (pay.paymentId === paymentId) {
        return {
          ...pay,
          status: 'Paid',
          paymentMethod: method,
          transactionReference: txnRef,
          paymentDate: new Date().toISOString(),
        };
      }
      return pay;
    });
    syncLocal('procureflow_payments', updated, setPayments);

    // Also close the Invoice status (Verified -> Fully Paid) if we want, or just mark payment paid
    addActivity(`Disbursement executed for ${paymentId} via ${method}. Transaction logged.`, 'FICO');
  };

  return (
    <SimulatedDBContext.Provider
      value={{
        dbMode,
        toggleDBMode,
        activeRole,
        switchRole,
        currentUser,
        login,
        register,
        materials,
        addMaterial,
        editMaterial,
        vendors,
        prs,
        addPR,
        approvePR,
        rfqs,
        addRFQ,
        submitQuotation,
        pos,
        createPO,
        grns,
        createGRN,
        invoices,
        createInvoice,
        verifyInvoice,
        payments,
        processPayment,
        activities,
        notifications,
        addActivity,
      }}
    >
      {children}
    </SimulatedDBContext.Provider>
  );
};
