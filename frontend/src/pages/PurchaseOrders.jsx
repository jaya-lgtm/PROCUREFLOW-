import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, Printer, FileCheck, Clipboard, ExternalLink, X, Info } from 'lucide-react';

const PurchaseOrders = () => {
  const { pos, activeRole, switchRole } = useSimulatedDB();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPoId, setSelectedPoId] = useState(pos[0]?.poNumber || '');
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const selectedPO = pos.find(p => p.poNumber === selectedPoId) || pos[0];

  const handlePrint = () => {
    window.print();
  };

  const filteredPOs = pos.filter(po => {
    const matchSearch = po.poNumber.toLowerCase().includes(search.toLowerCase()) || po.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || po.status === statusFilter;
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
              placeholder="Search PO number or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-250 dark:border-slate-755 bg-transparent rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 border border-slate-250 dark:border-slate-755 px-3 py-2 rounded-lg text-xs text-slate-500 bg-transparent">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none font-bold text-slate-700 dark:text-slate-350"
              >
                <option value="All">All Purchase Orders</option>
                <option value="Created">Created</option>
                <option value="Approved">Approved</option>
                <option value="Sent">Sent</option>
                <option value="Delivered">Delivered</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* PO Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold">
                  <th className="px-6 py-4">PO Number</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredPOs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-450 font-semibold text-xs">
                      No Purchase Orders issued.
                    </td>
                  </tr>
                ) : (
                  filteredPOs.map((po) => (
                    <tr
                      key={po.poNumber}
                      onClick={() => setSelectedPoId(po.poNumber)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-850/20 text-slate-750 dark:text-slate-355 font-medium cursor-pointer transition-colors ${
                        selectedPoId === po.poNumber ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-850 dark:text-white">{po.poNumber}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{po.vendorName}</td>
                      <td className="px-6 py-4 font-semibold text-slate-500">{po.totalQuantity} items</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-white">${po.totalAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          po.status === 'Created' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                          po.status === 'Sent' ? 'bg-blue-500/10 text-primary border border-primary/20' :
                          po.status === 'Delivered' ? 'bg-success/10 text-success border border-success/20' :
                          'bg-orange-500/10 text-warning border border-warning/20'
                        }`}>
                          {po.status}
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

      {/* Right Details Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-22">
        {selectedPO ? (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">SAP DOCUMENT ENTRY</span>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white mt-1">{selectedPO.poNumber}</h3>
                <span className="text-[11px] text-slate-450 mt-1 block">Issued: {new Date(selectedPO.createdAt).toLocaleDateString()}</span>
              </div>
              <button
                onClick={() => setPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg text-xs font-bold text-slate-650 dark:text-slate-350 cursor-pointer"
              >
                <Printer size={13} />
                <span>Export PDF / Print</span>
              </button>
            </div>

            {/* Vendor Profile reference */}
            <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-750 rounded-xl space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[9px] font-bold uppercase block">Supplier</span>
                <span className="text-slate-850 dark:text-white font-extrabold">{selectedPO.vendorName}</span>
                <span className="text-slate-400 block text-[10px] mt-0.5">Code: {selectedPO.vendorId}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 mt-2">
                <div>
                  <span className="text-slate-400 text-[9px] font-bold uppercase block">Expected Date</span>
                  <span className="text-slate-800 dark:text-white font-semibold">{new Date(selectedPO.deliveryDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] font-bold uppercase block">Agreement Ref</span>
                  <span className="text-slate-800 dark:text-white font-semibold">{selectedPO.rfqReference || 'Direct Order'}</span>
                </div>
              </div>
            </div>

            {/* Line Items summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Line Items Summary</h4>
              <div className="space-y-3">
                {selectedPO.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 dark:border-slate-800 pb-2 last:border-b-0 last:pb-0">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-white block truncate max-w-[170px]">{item.materialName}</span>
                      <span className="text-[10px] text-slate-400 block">{item.quantity} units @ ${item.price}</span>
                    </div>
                    <span className="font-extrabold text-slate-750 dark:text-slate-200">${(item.quantity * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs space-y-1.5 font-medium">
                <div className="flex justify-between text-slate-450">
                  <span>Subtotal:</span>
                  <span>${selectedPO.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-450">
                  <span>Tax (18% GST):</span>
                  <span>${selectedPO.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-800 dark:text-white font-bold border-t border-slate-100 dark:border-slate-700 pt-2.5">
                  <span>Grand Total (USD):</span>
                  <span className="text-primary dark:text-primary-light text-sm">${selectedPO.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Visual Approvals logs */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">SAP Control Approvals</h4>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex items-center justify-between p-2.5 bg-success/5 border border-success/15 rounded-lg text-success">
                  <div className="flex items-center gap-2">
                    <FileCheck size={14} />
                    <span>Manager Sign-Off: Sarah Jenkins</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">APPROVED</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-success/5 border border-success/15 rounded-lg text-success">
                  <div className="flex items-center gap-2">
                    <FileCheck size={14} />
                    <span>Director Sign-Off: Executive Auth</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">APPROVED</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-2">
            <Info size={32} strokeWidth={1.5} />
            <span className="text-xs font-semibold">Select a purchase order to view</span>
          </div>
        )}
      </div>

      {/* Printable Invoice PDF Modal (Styled Letterhead overlay) */}
      {printModalOpen && selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white print:backdrop-blur-none">
          <div className="fixed inset-0 print:hidden" onClick={() => setPrintModalOpen(false)} />
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full z-10 overflow-hidden flex flex-col print:border-none print:shadow-none print:max-w-none">
            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-b border-slate-150 flex justify-between items-center print:hidden">
              <span className="text-xs font-bold text-slate-700">Official Document Print Layout</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-250 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white hover:bg-primary-hover rounded-lg text-xs font-bold shadow-lg shadow-primary/10 transition cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print PO / Save PDF</span>
                </button>
              </div>
            </div>

            {/* PRINT BODY SHEET */}
            <div id="printable-po-body" className="p-8 space-y-8 bg-white text-slate-800 print:p-0">
              {/* Header Letterhead */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-lg mb-2">
                    PF
                  </div>
                  <h1 className="text-base font-black uppercase tracking-wider text-blue-600">ProcureFlow S/4</h1>
                  <span className="text-[10px] text-slate-400 block leading-relaxed font-semibold">
                    Enterprise Procurement Network Service<br />
                    100 Corporate Blvd, Tech City, NY 10001<br />
                    tax-id: GST-29AAAAA1111A1Z1
                  </span>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">PURCHASE ORDER</h2>
                  <span className="text-lg font-bold text-blue-600 block mt-1">{selectedPO.poNumber}</span>
                  <span className="text-[10px] text-slate-400 block mt-1 font-semibold">Date issued: {new Date(selectedPO.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Addresses Row */}
              <div className="grid grid-cols-2 gap-6 text-xs pt-4 border-t border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Billing / Ship-To Entity</span>
                  <span className="font-extrabold text-slate-800 block">ProcureFlow S/4 Systems Corp</span>
                  <span className="text-slate-500 mt-1 block leading-relaxed">
                    Logistics warehouse storage Location SL01<br />
                    Chicago Assembly center, IL 60611<br />
                    Purchasing Org: PO10
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Target Supplier / Vendor</span>
                  <span className="font-extrabold text-slate-800 block">{selectedPO.vendorName}</span>
                  <span className="text-slate-500 mt-1 block leading-relaxed">
                    Supplier Code: {selectedPO.vendorId}<br />
                    Contract reference: {selectedPO.rfqReference || 'Direct Solicitation'}<br />
                    Terms of Payment: {selectedPO.paymentTerms || 'NET30'}
                  </span>
                </div>
              </div>

              {/* Items details table */}
              <div className="pt-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-500 font-bold">
                      <th className="py-2 px-3">Item #</th>
                      <th className="py-2 px-3">Material Specs</th>
                      <th className="py-2 px-3 text-right">Qty</th>
                      <th className="py-2 px-3 text-right">Unit Price</th>
                      <th className="py-2 px-3 text-right">Tax Rate</th>
                      <th className="py-2 px-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedPO.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-3 font-semibold">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-800 block">{item.materialName}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Code: {item.materialId}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold">{item.quantity} PC</td>
                        <td className="py-3 px-3 text-right">${item.price}</td>
                        <td className="py-3 px-3 text-right">{item.tax}%</td>
                        <td className="py-3 px-3 text-right font-extrabold text-slate-800">${(item.quantity * item.price).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Terms and Signatures */}
              <div className="grid grid-cols-5 gap-6 pt-6 border-t border-slate-150">
                <div className="col-span-3 text-[10px] text-slate-450 leading-relaxed font-semibold">
                  <span className="font-bold text-slate-500 block uppercase mb-1">Standard Purchase Terms</span>
                  Please note that this document constitutes an official corporate procurement commitment under the standard terms. Deliveries must reach Chicago SL01 within the expected lead time date. All invoices must specify this PO reference and GRN document identifier to satisfy the 3-Way Match validation cycle.
                </div>
                <div className="col-span-2 space-y-4">
                  {/* Summary math */}
                  <div className="text-xs space-y-1.5 font-medium">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal amount:</span>
                      <span>${selectedPO.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>GST Tax (18%):</span>
                      <span>${selectedPO.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-800 font-black border-t border-slate-200 pt-2 text-sm">
                      <span>Total Amount (USD):</span>
                      <span className="text-blue-600">${selectedPO.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="pt-4 grid grid-cols-2 gap-4 text-center text-[9px] text-slate-400 font-bold uppercase">
                    <div>
                      <div className="h-8 border-b border-slate-250 mb-1 flex items-center justify-center font-serif text-[10px] text-blue-600 lowercase italic">
                        sarah.j
                      </div>
                      <span>Sarah Jenkins<br />Procurement Manager</span>
                    </div>
                    <div>
                      <div className="h-8 border-b border-slate-250 mb-1 flex items-center justify-center font-serif text-[10px] text-blue-600 lowercase italic">
                        exec.auth
                      </div>
                      <span>Executive Sign<br />Director Auth</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;
