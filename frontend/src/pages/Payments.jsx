import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, DollarSign, Calendar, CreditCard, ShieldCheck, CheckSquare, X } from 'lucide-react';

const Payments = () => {
  const { payments, processPayment, activeRole } = useSimulatedDB();

  const [search, setSearch] = useState('');
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedPayRecord, setSelectedPayRecord] = useState(null);

  // Form states
  const [method, setMethod] = useState('Bank Transfer');
  const [txnRef, setTxnRef] = useState('');

  const isFinanceMgr = activeRole === 'Finance Manager' || activeRole === 'Admin';

  // Math
  const scheduledPayments = payments.filter(p => p.status === 'Scheduled');
  const paidPayments = payments.filter(p => p.status === 'Paid');

  const outstandingAmount = scheduledPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const dueCount = scheduledPayments.length;

  const triggerPaymentModal = (pay) => {
    setSelectedPayRecord(pay);
    setTxnRef(`TXN-FICO-${Date.now().toString().slice(-8)}`);
    setPayModalOpen(true);
  };

  const handlePayExecute = (e) => {
    e.preventDefault();
    if (!selectedPayRecord) return;

    processPayment(selectedPayRecord.paymentId, method, txnRef);
    setPayModalOpen(false);
    setSelectedPayRecord(null);
    alert('FICO payment disbursement executed successfully.');
  };

  const filteredScheduled = scheduledPayments.filter(p =>
    p.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    p.invoiceReference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* AP Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Outstanding AP Amount</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">${outstandingAmount.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Verified invoices scheduled</span>
          </div>
          <div className="p-3 bg-red-500/10 text-danger rounded-xl border border-red-500/20">
            <DollarSign size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Paid Disbursements</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">${totalPaidAmount.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Cleared vendor payments</span>
          </div>
          <div className="p-3 bg-success/10 text-success rounded-xl border border-success/20">
            <CheckSquare size={20} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Upcoming Due Runs</span>
            <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">{dueCount} Runs</span>
            <span className="text-[10px] text-slate-400 mt-1 block font-medium">Pending bank dispatches</span>
          </div>
          <div className="p-3 bg-orange-500/10 text-warning rounded-xl border border-orange-500/20">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled and Paid ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Accounts Payable Schedule */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-700">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accounts Payable schedule runs</h4>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="Filter by vendor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-7 pr-3 py-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] outline-none text-slate-850 dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-700">
                    <th className="py-2">Payment ID</th>
                    <th className="py-2">Vendor</th>
                    <th className="py-2">Invoice Ref</th>
                    <th className="py-2">Scheduled Date</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {filteredScheduled.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-450 font-semibold">
                        No accounts payable runs scheduled.
                      </td>
                    </tr>
                  ) : (
                    filteredScheduled.map((pay) => (
                      <tr key={pay.paymentId} className="text-slate-750 dark:text-slate-350 font-medium">
                        <td className="py-3 font-bold text-slate-800 dark:text-white">{pay.paymentId}</td>
                        <td className="py-3 truncate max-w-[140px] font-bold text-slate-800 dark:text-slate-200">{pay.vendorName}</td>
                        <td className="py-3 font-mono font-bold text-slate-400">{pay.invoiceReference}</td>
                        <td className="py-3">{new Date(pay.scheduledDate).toLocaleDateString()}</td>
                        <td className="py-3 text-right font-extrabold text-slate-850 dark:text-white">${pay.amount.toLocaleString()}</td>
                        <td className="py-3 text-center">
                          {isFinanceMgr ? (
                            <button
                              onClick={() => triggerPaymentModal(pay)}
                              className="px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold rounded cursor-pointer"
                            >
                              Disburse AP
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Blocked</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Disbursement Logs */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Cleared Disbursement Logs</h4>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {paidPayments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No disbursements cleared.
              </div>
            ) : (
              paidPayments.map((pay) => (
                <div key={pay.paymentId} className="p-3 border border-slate-100 dark:border-slate-800 rounded-lg text-xs space-y-1 bg-slate-50/50 dark:bg-slate-850/20">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">{pay.paymentId}</span>
                    <span className="bg-success/15 text-success text-[9px] font-bold px-1.5 py-0.5 rounded">CLEARED</span>
                  </div>
                  <span className="text-slate-450 block font-semibold">{pay.vendorName}</span>
                  <div className="text-[10px] text-slate-400 font-semibold space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-850 mt-1.5">
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="text-slate-700 dark:text-slate-300">{pay.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="text-primary font-bold">${pay.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ref No:</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">{pay.transactionReference}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Disburse AP Modal */}
      {payModalOpen && selectedPayRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPayModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full z-10 overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850/50">
              <div className="flex items-center gap-2 text-slate-850 dark:text-white">
                <CreditCard size={18} className="text-primary" />
                <h3 className="font-bold">Process FICO Payment Run</h3>
              </div>
              <button onClick={() => setPayModalOpen(false)} className="text-slate-400 hover:text-slate-655 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePayExecute} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-750 rounded-lg text-xs space-y-1.5 font-semibold text-slate-600 dark:text-slate-350">
                <div className="flex justify-between">
                  <span>Vendor:</span>
                  <span className="text-slate-800 dark:text-white">{selectedPayRecord.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoice:</span>
                  <span className="text-slate-800 dark:text-white">{selectedPayRecord.invoiceReference}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-slate-200 dark:border-slate-700 pt-1.5 font-extrabold text-slate-800 dark:text-white">
                  <span>Total Amount Due:</span>
                  <span className="text-primary">${selectedPayRecord.amount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Disbursement Channel</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                >
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                  <option value="UPI">UPI Payment Network</option>
                  <option value="Cheque">Corporate Issue Cheque</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  required
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPayModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20"
                >
                  Disburse Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
