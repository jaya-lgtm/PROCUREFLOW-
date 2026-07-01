import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, CheckCircle2, ShieldAlert, AlertTriangle, FileSpreadsheet, X, HelpCircle } from 'lucide-react';

const InvoiceVerification = () => {
  const { invoices, verifyInvoice, pos, grns, activeRole } = useSimulatedDB();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(invoices[0]?.invoiceNumber || '');
  const [search, setSearch] = useState('');

  const activeInvoice = invoices.find(i => i.invoiceNumber === selectedInvoiceId) || invoices[0];
  const canVerify = activeRole === 'Finance Manager' || activeRole === 'Admin';

  // Fetch associated PO and GRN logs for side-by-side match comparison
  const associatedPO = activeInvoice ? pos.find(p => p.poNumber === activeInvoice.poReference) : null;
  const associatedGRN = activeInvoice ? grns.find(g => g.poReference === activeInvoice.poReference) : null;

  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    inv.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Column 1: Invoices sidebar list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col max-h-[80vh] lg:col-span-1">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search invoice number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-250 dark:border-slate-755 bg-transparent rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No invoice logs found.
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <button
                key={inv.invoiceNumber}
                onClick={() => setSelectedInvoiceId(inv.invoiceNumber)}
                className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-850/20 transition-colors flex items-center justify-between ${
                  selectedInvoiceId === inv.invoiceNumber ? 'bg-primary/5 dark:bg-primary/10 border-r-4 border-primary' : ''
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">{inv.invoiceNumber}</span>
                  <span className="text-xs font-bold text-slate-805 dark:text-slate-200 block truncate max-w-[140px]">{inv.vendorName}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block">PO: {inv.poReference}</span>
                </div>
                <div className="text-right">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold block ${
                    inv.status === 'Verified' ? 'bg-success/15 text-success' :
                    inv.status === 'Blocked' ? 'bg-danger/15 text-danger' :
                    'bg-warning/15 text-warning'
                  }`}>
                    {inv.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-750 dark:text-slate-300 block mt-1">${inv.totalAmount.toLocaleString()}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Columns 2-4: 3-Way Match Verification Workspace */}
      {activeInvoice ? (
        <div className="lg:col-span-3 space-y-6">
          {/* Mismatch Alert Panel */}
          <div className={`p-5 rounded-xl border flex gap-4 ${
            activeInvoice.status === 'Blocked'
              ? 'bg-red-500/5 border-danger/30 text-danger'
              : activeInvoice.status === 'Verified'
              ? 'bg-success/5 border-success/30 text-success'
              : 'bg-warning/5 border-warning/30 text-warning'
          }`}>
            <div className="mt-0.5 flex-shrink-0">
              {activeInvoice.status === 'Blocked' ? (
                <ShieldAlert size={20} className="animate-pulse" />
              ) : (
                <CheckCircle2 size={20} />
              )}
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider leading-none mb-1.5">
                3-Way Match Audit: {activeInvoice.status}
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                {activeInvoice.status === 'Blocked'
                  ? `Discrepancies identified during system check: ${activeInvoice.threeWayMatch.mismatchLogs.join('. ')}.`
                  : activeInvoice.status === 'Verified'
                  ? `This invoice has been successfully audited and approved. Payment scheduled.`
                  : 'Pending verification check by Finance Manager.'}
              </p>
            </div>
          </div>

          {/* 3-Way Sheets Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sheet 1: Purchase Order Reference */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Document 01</span>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">Purchase Order (PO)</h4>
                <span className="text-[10px] text-primary font-bold mt-1 block hover:underline cursor-pointer">{activeInvoice.poReference}</span>
                
                <div className="mt-5 space-y-3 text-xs">
                  {associatedPO ? (
                    associatedPO.items.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{item.materialName}</span>
                        <div className="flex justify-between text-slate-450 text-[10px] font-semibold">
                          <span>Qty Ordered:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{item.quantity} PC</span>
                        </div>
                        <div className="flex justify-between text-slate-450 text-[10px] font-semibold">
                          <span>Price Agreed:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">${item.price}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No PO Reference found.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sheet 2: Goods Receipt Reference */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Document 02</span>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">Goods Receipt Note</h4>
                <span className="text-[10px] text-success font-bold mt-1 block">
                  {associatedGRN ? associatedGRN.grnNumber : 'Awaiting Delivery Receipt'}
                </span>
                
                <div className="mt-5 space-y-3 text-xs">
                  {associatedGRN ? (
                    associatedGRN.items.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{item.materialName}</span>
                        <div className="flex justify-between text-slate-450 text-[10px] font-semibold">
                          <span>Qty Received:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">{item.quantityReceived} PC</span>
                        </div>
                        <div className="flex justify-between text-slate-450 text-[10px] font-semibold">
                          <span>Qty Damaged:</span>
                          <span className={`font-bold ${item.quantityDamaged > 0 ? 'text-danger' : 'text-slate-700 dark:text-slate-300'}`}>{item.quantityDamaged} PC</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-450 italic">No Goods Receipt found. Inventory yet to be recorded in warehouse.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Sheet 3: Vendor Invoice */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between relative">
              {activeInvoice.threeWayMatch.priceMismatch && (
                <div className="absolute top-4 right-4 bg-danger/10 border border-danger/20 text-danger text-[9px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1.5">
                  <AlertTriangle size={10} />
                  <span>Price Discrepancy</span>
                </div>
              )}
              
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Document 03</span>
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">Vendor Invoice Details</h4>
                <span className="text-[10px] text-danger font-bold mt-1 block">{activeInvoice.invoiceNumber}</span>
                
                <div className="mt-5 space-y-3 text-xs">
                  {activeInvoice.items.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{item.materialName}</span>
                      <div className="flex justify-between text-slate-450 text-[10px] font-semibold">
                        <span>Qty Invoiced:</span>
                        <span className={`font-bold ${activeInvoice.threeWayMatch.quantityMismatch ? 'text-danger font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>{item.quantityInvoice} PC</span>
                      </div>
                      <div className="flex justify-between text-slate-450 text-[10px] font-semibold">
                        <span>Price Charged:</span>
                        <span className={`font-bold ${activeInvoice.threeWayMatch.priceMismatch ? 'text-danger font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>${item.priceInvoice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aggregated sums */}
              <div className="border-t border-slate-100 dark:border-slate-700/50 pt-3 mt-4 text-[10px] font-semibold text-slate-450 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${activeInvoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-800 dark:text-white font-extrabold text-xs">
                  <span>Invoice Total:</span>
                  <span>${activeInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Operations Panel */}
          {activeInvoice.status !== 'Verified' && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase">VERIFICATION PANEL</span>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1 block">
                  Verify to release invoice for payments scheduling, or block if price/quantity claims are disputed.
                </span>
              </div>
              {canVerify ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => { verifyInvoice(activeInvoice.invoiceNumber, 'Block'); alert('Invoice blocked successfully.'); }}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-danger hover:bg-red-50 dark:hover:bg-red-955/15 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Dispute / Block
                  </button>
                  <button
                    onClick={() => { verifyInvoice(activeInvoice.invoiceNumber, 'Verify'); alert('Invoice matching successful. releasing for payment scheduling.'); }}
                    className="px-4 py-2 bg-success text-white hover:bg-success-hover rounded-lg text-xs font-bold shadow-lg shadow-success/15 transition cursor-pointer"
                  >
                    Verify & Release
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded uppercase">Requires Finance Manager Role</span>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="lg:col-span-3 text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-450 font-semibold text-xs">
          Select an invoice document to audit.
        </div>
      )}
    </div>
  );
};

export default InvoiceVerification;
