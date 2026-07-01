import React, { useState, useEffect } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, Plus, Filter, CheckCircle2, AlertTriangle, FileSpreadsheet, X, Info } from 'lucide-react';

const PurchaseRequisitions = () => {
  const { prs, addPR, approvePR, materials, activeRole } = useSimulatedDB();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrId, setSelectedPrId] = useState(prs[0]?.prNumber || '');

  // Form states
  const [dept, setDept] = useState('Engineering');
  const [matId, setMatId] = useState('');
  const [qty, setQty] = useState(1);
  const [expDate, setExpDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const selectedPR = prs.find(p => p.prNumber === selectedPrId) || prs[0];

  useEffect(() => {
    if (materials.length > 0 && !matId) {
      setMatId(materials[0].materialId);
    }
  }, [materials, matId]);

  // Listen to global events for command palette quick action trigger
  useEffect(() => {
    const handleOpenModal = () => setModalOpen(true);
    window.addEventListener('open-pr-modal', handleOpenModal);
    return () => window.removeEventListener('open-pr-modal', handleOpenModal);
  }, []);

  const handleCreatePR = (e) => {
    e.preventDefault();
    const material = materials.find(m => m.materialId === matId);
    if (!material) return;

    addPR({
      department: dept,
      materialId: material.materialId,
      materialName: material.materialName,
      quantity: parseInt(qty),
      expectedDate: expDate,
      priority,
    });

    // Reset Form
    setDept('Engineering');
    setQty(1);
    setExpDate('');
    setPriority('Medium');
    setModalOpen(false);
  };

  // Export to CSV Helper
  const exportToCSV = () => {
    const headers = ['PR Number,Department,Requested By,Material,Quantity,Expected Date,Priority,Status'];
    const rows = prs.map(p => 
      `"${p.prNumber}","${p.department}","${p.requestedBy}","${p.materialName}",${p.quantity},"${p.expectedDate}","${p.priority}","${p.status}"`
    );
    const content = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encoded = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `procureflow_prs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPRs = prs.filter(p => {
    const matchSearch = p.prNumber.toLowerCase().includes(search.toLowerCase()) || p.materialName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left List Pane */}
      <div className="lg:col-span-2 space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search Requisition number or material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-250 dark:border-slate-755 bg-transparent rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-lg text-xs text-slate-500">
              <Filter size={13} />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none font-bold text-slate-700 dark:text-slate-350"
              >
                <option value="All">All Requisitions</option>
                <option value="Draft">Draft</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Converted To RFQ">Converted to RFQ</option>
              </select>
            </div>

            <button
              onClick={exportToCSV}
              className="p-2 border border-slate-250 dark:border-slate-750 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
              title="Export as CSV/Excel"
            >
              <FileSpreadsheet size={16} />
            </button>

            {/* Create Button */}
            {(activeRole === 'Purchase Officer' || activeRole === 'Admin') && (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 transition cursor-pointer"
              >
                <Plus size={14} />
                <span>Create PR</span>
              </button>
            )}
          </div>
        </div>

        {/* PR Main Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold">
                  <th className="px-6 py-4">PR Number</th>
                  <th className="px-6 py-4">Material</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Requested By</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredPRs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 text-xs font-semibold">
                      No Purchase Requisitions found.
                    </td>
                  </tr>
                ) : (
                  filteredPRs.map((pr) => (
                    <tr
                      key={pr.prNumber}
                      onClick={() => setSelectedPrId(pr.prNumber)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/20 text-slate-750 dark:text-slate-355 font-medium cursor-pointer transition-colors ${
                        selectedPrId === pr.prNumber ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{pr.prNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white truncate max-w-[150px]">{pr.materialName}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{pr.materialId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{pr.department}</td>
                      <td className="px-6 py-4 text-slate-500 font-semibold">{pr.requestedBy}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{pr.quantity}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pr.status === 'Draft' ? 'bg-slate-100 text-slate-550 border border-slate-200' :
                          pr.status === 'Submitted' ? 'bg-blue-500/10 text-primary border border-primary/15' :
                          pr.status === 'Approved' ? 'bg-success/10 text-success border border-success/15' :
                          pr.status === 'Rejected' ? 'bg-danger/10 text-danger border border-danger/15' :
                          'bg-purple-500/10 text-aiAccent border border-purple-500/15'
                        }`}>
                          {pr.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Details Panel: Workflow Timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-22">
        {selectedPR ? (
          <div className="p-6 space-y-6">
            <div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                selectedPR.priority === 'High' ? 'bg-red-500/15 text-danger' :
                selectedPR.priority === 'Medium' ? 'bg-orange-500/15 text-warning' :
                'bg-blue-500/15 text-primary'
              }`}>
                {selectedPR.priority} Priority
              </span>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-2">{selectedPR.prNumber} Details</h3>
              <p className="text-xs text-slate-400 mt-1">Acquisition request tracking details.</p>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-750">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[9px] font-bold uppercase block">Material Spec</span>
                  <span className="text-slate-800 dark:text-white font-semibold leading-normal">{selectedPR.materialName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] font-bold uppercase block">Quantity requested</span>
                  <span className="text-slate-850 dark:text-slate-200 font-extrabold">{selectedPR.quantity} PC</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="text-slate-400 text-[9px] font-bold uppercase block">Required By Date</span>
                  <span className="text-slate-800 dark:text-white font-semibold">{new Date(selectedPR.expectedDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] font-bold uppercase block">Requesting Dept</span>
                  <span className="text-slate-800 dark:text-white font-semibold">{selectedPR.department}</span>
                </div>
              </div>
            </div>

            {/* Visual Workflow Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Approval Workflow Progression</h4>
              <div className="space-y-5">
                {[
                  { label: 'PR Created', done: true, date: selectedPR.approvalTimeline.created },
                  { label: 'Submitted for Review', done: !!selectedPR.approvalTimeline.submitted, date: selectedPR.approvalTimeline.submitted },
                  { label: 'Manager Review Approved', done: selectedPR.status === 'Approved' || selectedPR.status === 'Converted To RFQ', date: selectedPR.approvalTimeline.approved, isFail: selectedPR.status === 'Rejected' },
                  { label: 'RFQ Generation Dispatch', done: selectedPR.status === 'Converted To RFQ', date: selectedPR.approvalTimeline.rfqGenerated },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative pl-5 border-l-2 border-slate-100 dark:border-slate-800 last:border-l-0 ml-1.5 pb-2">
                    {/* Circle Node */}
                    <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                      step.isFail ? 'bg-danger border-white text-white' :
                      step.done
                        ? 'bg-success border-white dark:border-slate-900 text-white'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}>
                      {step.isFail ? (
                        <span className="text-[8px] font-bold">✕</span>
                      ) : step.done ? (
                        <span className="text-[8px] font-bold">✓</span>
                      ) : (
                        <span className="text-[8px] font-semibold">{idx + 1}</span>
                      )}
                    </div>
                    {/* Step Info */}
                    <div>
                      <span className={`text-xs font-bold block ${
                        step.isFail ? 'text-danger' : step.done ? 'text-slate-800 dark:text-white font-semibold' : 'text-slate-400'
                      }`}>
                        {step.label} {step.isFail && '(REJECTED)'}
                      </span>
                      {step.date && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {new Date(step.date).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Controls */}
            {selectedPR.status === 'Submitted' && (activeRole === 'Procurement Manager' || activeRole === 'Admin') && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex gap-2">
                <button
                  onClick={() => approvePR(selectedPR.prNumber, false, 'Rejected by Procurement Manager')}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-danger hover:bg-red-50 dark:hover:bg-red-950/10 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Reject Requisition
                </button>
                <button
                  onClick={() => approvePR(selectedPR.prNumber, true)}
                  className="flex-1 px-4 py-2 bg-success text-white hover:bg-success-hover rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Approve Requisition
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
            <Info size={32} strokeWidth={1.5} />
            <span className="text-xs font-semibold">Select a requisition log to inspect</span>
          </div>
        )}
      </div>

      {/* Requisition Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full z-10 overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850/50">
              <h3 className="font-bold text-slate-800 dark:text-white">Create Purchase Requisition</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePR} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Department</label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="R&D">R&D</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Material Master</label>
                <select
                  value={matId}
                  onChange={(e) => setMatId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                >
                  {materials.map(m => (
                    <option key={m.materialId} value={m.materialId}>
                      {m.materialId} - {m.materialName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-850 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  required
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-850 dark:text-white"
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
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseRequisitions;
