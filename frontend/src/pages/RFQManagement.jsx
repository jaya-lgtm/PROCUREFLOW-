import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, Plus, Mail, CheckCircle2, Clock, X, Building, DollarSign, Calendar } from 'lucide-react';

const RFQManagement = () => {
  const { rfqs, addRFQ, submitQuotation, prs, vendors, activeRole, currentUser } = useSimulatedDB();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  
  // Create RFQ form states
  const [prRef, setPrRef] = useState('');
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [deadline, setDeadline] = useState('');
  const [remarks, setRemarks] = useState('');

  // Bid submission states
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [quotedPrice, setQuotedPrice] = useState('');
  const [quotedLeadTime, setQuotedLeadTime] = useState('');

  const isVendor = activeRole === 'Vendor';
  const canCreate = activeRole === 'Purchase Officer' || activeRole === 'Admin' || activeRole === 'Procurement Manager';

  // Approved PRs available for RFQ conversion
  const approvedPRs = prs.filter(p => p.status === 'Approved');

  const handleCreateRFQ = (e) => {
    e.preventDefault();
    const pr = prs.find(p => p.prNumber === prRef);
    if (!pr || selectedVendors.length === 0) return;

    addRFQ({
      prReference: pr.prNumber,
      materialId: pr.materialId,
      materialName: pr.materialName,
      quantity: pr.quantity,
      deliveryDate: pr.expectedDate,
      deadlineDate: deadline,
      vendorIds: selectedVendors,
      remarks,
    });

    // Reset Form
    setPrRef('');
    setSelectedVendors([]);
    setDeadline('');
    setRemarks('');
    setModalOpen(false);
  };

  const handleVendorBid = (e) => {
    e.preventDefault();
    if (!selectedRfq || !quotedPrice || !quotedLeadTime) return;

    submitQuotation(
      selectedRfq.rfqNumber,
      currentUser.vendorRef || 'VND-2001', // Default to VND-2001 if Admin simulating
      parseFloat(quotedPrice),
      parseInt(quotedLeadTime)
    );

    // Reset Form
    setQuotedPrice('');
    setQuotedLeadTime('');
    setBidModalOpen(false);
    setSelectedRfq(null);
  };

  const toggleVendorSelection = (vId) => {
    setSelectedVendors(prev =>
      prev.includes(vId) ? prev.filter(id => id !== vId) : [...prev, vId]
    );
  };

  const filteredRFQs = rfqs.filter(r =>
    r.rfqNumber.toLowerCase().includes(search.toLowerCase()) ||
    r.materialName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Actions and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search RFQs by number or material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-250 dark:border-slate-755 bg-transparent rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white"
          />
        </div>
        <div>
          {canCreate && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Create RFQ</span>
            </button>
          )}
        </div>
      </div>

      {/* RFQ Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRFQs.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400 font-semibold text-xs">
            No RFQs registered in this purchasing cycle.
          </div>
        ) : (
          filteredRFQs.map((rfq) => {
            const hasSubmittedBid = rfq.quotations.some(
              q => q.vendorId === (currentUser.vendorRef || 'VND-2001') && q.status === 'Submitted'
            );

            return (
              <div key={rfq.rfqNumber} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-400 block">{rfq.rfqNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rfq.status === 'Open' ? 'bg-blue-500/10 text-primary border border-primary/20' :
                      rfq.status === 'Sent' ? 'bg-orange-500/10 text-warning border border-warning/20' :
                      rfq.status === 'Quotation Received' ? 'bg-purple-500/10 text-aiAccent border border-purple-500/20' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {rfq.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">{rfq.materialName}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">Qty: {rfq.quantity} PC • Delivery: {new Date(rfq.deliveryDate).toLocaleDateString()}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Vendors Elicited:</span>
                      <span className="font-bold">{rfq.quotations.length}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Bids Collected:</span>
                      <span className="font-bold text-success">
                        {rfq.quotations.filter(q => q.status === 'Submitted').length} / {rfq.quotations.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Clock size={12} />
                    <span>Ends {new Date(rfq.deadlineDate).toLocaleDateString()}</span>
                  </div>

                  {isVendor && rfq.status === 'Sent' && (
                    <button
                      onClick={() => { setSelectedRfq(rfq); setBidModalOpen(true); }}
                      disabled={hasSubmittedBid}
                      className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition border cursor-pointer ${
                        hasSubmittedBid
                          ? 'bg-success/10 text-success border-success/20 cursor-not-allowed'
                          : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                      }`}
                    >
                      {hasSubmittedBid ? '✓ Bid Submitted' : 'Submit Bidding Quote'}
                    </button>
                  )}

                  {!isVendor && rfq.status === 'Quotation Received' && (
                    <span className="text-[10px] font-extrabold text-aiAccent animate-pulse">
                      Ready for Comparison
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Buyer: Create RFQ Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full z-10 overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Generate RFQ from Requisition</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRFQ} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Approved PR Reference</label>
                <select
                  required
                  value={prRef}
                  onChange={(e) => setPrRef(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-850 dark:text-white"
                >
                  <option value="">-- Choose PR --</option>
                  {approvedPRs.map(pr => (
                    <option key={pr.prNumber} value={pr.prNumber}>
                      {pr.prNumber} - {pr.materialName} ({pr.quantity} units)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Target Suppliers to Elicit</label>
                <div className="grid grid-cols-1 gap-2">
                  {vendors.map(v => (
                    <label key={v.vendorId} className="flex items-center gap-3 p-2 border border-slate-150 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(v.vendorId)}
                        onChange={() => toggleVendorSelection(v.vendorId)}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <div>
                        <span>{v.vendorName}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">Rating: ★ {v.rating.toFixed(1)} • Delivery: {v.performanceMetrics.onTimeDelivery}%</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bidding Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Buyer Notes / Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-850 dark:text-white h-20 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold"
                >
                  Create & Dispatch RFQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor: Submit Bid Modal */}
      {bidModalOpen && selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBidModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full z-10 overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Submit Bidding Quotation</h3>
              <button onClick={() => setBidModalOpen(false)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleVendorBid} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-750 rounded-lg text-xs space-y-1">
                <span className="text-slate-450 block">RFQ Reference: <strong>{selectedRfq.rfqNumber}</strong></span>
                <span className="text-slate-450 block">Required Material: <strong>{selectedRfq.materialName}</strong></span>
                <span className="text-slate-450 block">Target Quantity: <strong>{selectedRfq.quantity} units</strong></span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quoted Price per Unit ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="number"
                    min="1"
                    required
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    placeholder="e.g. 240"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Time to Ship (Days)</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="number"
                    min="1"
                    required
                    value={quotedLeadTime}
                    onChange={(e) => setQuotedLeadTime(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBidModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20"
                >
                  Submit Official Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFQManagement;
