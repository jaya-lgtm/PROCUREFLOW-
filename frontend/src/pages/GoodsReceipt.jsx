import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, ClipboardCheck, AlertTriangle, ArrowDownLeft, X, Inbox } from 'lucide-react';

const GoodsReceipt = () => {
  const { pos, grns, createGRN, activeRole } = useSimulatedDB();

  // Search pending orders
  const [search, setSearch] = useState('');
  const [selectedPoNumber, setSelectedPoNumber] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [remarks, setRemarks] = useState('');
  const [itemsData, setItemsData] = useState([]); // holds array of { materialId, materialName, quantityOrdered, quantityReceived, quantityDamaged, storageLocation }

  const isWarehouseMgr = activeRole === 'Warehouse Manager' || activeRole === 'Admin';

  // Filters for POs that are approved and ready to receive (status is Sent or Approved or Partially Delivered)
  const openPOs = pos.filter(po =>
    ['Approved', 'Sent', 'Partially Delivered'].includes(po.status) &&
    (po.poNumber.toLowerCase().includes(search.toLowerCase()) || po.vendorName.toLowerCase().includes(search.toLowerCase()))
  );

  const startReceipt = (po) => {
    setSelectedPoNumber(po.poNumber);
    // Initialize items input values with PO order quantities
    const initializedItems = po.items.map(item => ({
      materialId: item.materialId,
      materialName: item.materialName,
      quantityOrdered: item.quantity,
      quantityReceived: item.quantity, // default to receiving everything
      quantityDamaged: 0,
      storageLocation: 'SL01',
    }));
    setItemsData(initializedItems);
    setRemarks('');
    setModalOpen(true);
  };

  const handleItemFieldChange = (idx, field, value) => {
    const updated = [...itemsData];
    updated[idx][field] = value;
    setItemsData(updated);
  };

  const handleSaveGRN = (e) => {
    e.preventDefault();
    if (!selectedPoNumber || itemsData.length === 0) return;

    createGRN({
      poReference: selectedPoNumber,
      items: itemsData,
      remarks,
    });

    // Reset
    setSelectedPoNumber('');
    setItemsData([]);
    setRemarks('');
    setModalOpen(false);
    alert('Goods Receipt Note (GRN) created successfully. Inventory balances have been adjusted.');
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white">Warehouse Goods Receiving Console (SAP MIGO)</h3>
        <p className="text-xs text-slate-450 mt-1">Select an dispatched or approved Purchase Order below to record incoming inventory receipts.</p>
      </div>

      {/* Main Grid: Pending PO List & Historic GRNs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Dispatched/Open Purchase Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Pending PO Shipments Awaiting Receipt</h4>
            <div className="space-y-3">
              {openPOs.length === 0 ? (
                <div className="text-center py-8 text-slate-450 text-xs font-semibold flex flex-col items-center gap-1.5">
                  <Inbox size={24} strokeWidth={1.5} />
                  <span>No PO shipments currently pending receipt.</span>
                </div>
              ) : (
                openPOs.map((po) => (
                  <div key={po.poNumber} className="p-4 border border-slate-150 dark:border-slate-755 bg-slate-50 dark:bg-slate-850 rounded-xl flex items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">{po.poNumber}</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white block mt-0.5">{po.vendorName}</span>
                      <span className="text-[10px] text-slate-500 block truncate mt-1">
                        {po.items.map(i => `${i.quantity}x ${i.materialName}`).join(', ')}
                      </span>
                    </div>
                    {isWarehouseMgr ? (
                      <button
                        onClick={() => startReceipt(po)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-[10px] font-extrabold shadow-lg shadow-primary/10 transition cursor-pointer"
                      >
                        <ArrowDownLeft size={13} />
                        <span>Receive Goods</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Read-only role</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Historic GRN Receipts log */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Recent GRN Entries</h4>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {grns.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No warehouse GRNs recorded yet.
              </div>
            ) : (
              grns.map((grn) => (
                <div key={grn.grnNumber} className="p-3 border border-slate-100 dark:border-slate-800 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">{grn.grnNumber}</span>
                    <span className="bg-success/15 text-success text-[9px] font-bold px-1.5 py-0.5 rounded">ACCEPTED</span>
                  </div>
                  <span className="text-slate-450 block font-medium">PO Reference: <strong>{grn.poReference}</strong></span>
                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                    {grn.items.map((i, idx) => (
                      <span key={idx} className="block leading-relaxed">
                        • {i.quantityReceived - (i.quantityDamaged || 0)}x {i.materialName} placed at {i.storageLocation}
                        {i.quantityDamaged > 0 && <strong className="text-danger"> ({i.quantityDamaged} damaged rejected)</strong>}
                      </span>
                    ))}
                  </div>
                  <span className="text-[9px] text-slate-400 block pt-1.5 text-right font-semibold">Verified by: {grn.inspector}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Receive Goods Inspection Form Modal */}
      {modalOpen && selectedPoNumber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full z-10 overflow-hidden animate-in zoom-in-95 duration-100">
            <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850/50">
              <div className="flex items-center gap-2 text-slate-850 dark:text-white">
                <ClipboardCheck size={18} className="text-primary" />
                <h3 className="font-bold">
                  Inspection Ledger: PO {selectedPoNumber}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-650 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGRN} className="p-5 space-y-5">
              {/* Line Items Receiving Table */}
              <div className="overflow-x-auto border border-slate-150 dark:border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold border-b border-slate-150 dark:border-slate-850">
                      <th className="py-2.5 px-3">Material Details</th>
                      <th className="py-2.5 px-3 text-right">Ordered</th>
                      <th className="py-2.5 px-3 text-right">Qty Received</th>
                      <th className="py-2.5 px-3 text-right">Qty Damaged</th>
                      <th className="py-2.5 px-3">Storage Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350">
                    {itemsData.map((item, idx) => (
                      <tr key={item.materialId}>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-850 dark:text-white block">{item.materialName}</span>
                          <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{item.materialId}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-550">{item.quantityOrdered} PC</td>
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            max={item.quantityOrdered}
                            required
                            value={item.quantityReceived}
                            onChange={(e) => handleItemFieldChange(idx, 'quantityReceived', parseInt(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 text-right bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-primary text-slate-800 dark:text-white font-bold"
                          />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            max={item.quantityReceived}
                            required
                            value={item.quantityDamaged}
                            onChange={(e) => handleItemFieldChange(idx, 'quantityDamaged', parseInt(e.target.value) || 0)}
                            className="w-16 px-1.5 py-1 text-right bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-md outline-none focus:border-primary text-danger font-bold"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={item.storageLocation}
                            onChange={(e) => handleItemFieldChange(idx, 'storageLocation', e.target.value)}
                            className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md text-xs outline-none text-slate-800 dark:text-white font-semibold"
                          >
                            <option value="SL01">SL01 - Raw Storage</option>
                            <option value="SL02">SL02 - Assembly</option>
                            <option value="SL03">SL03 - Finished Goods</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Receipt Remarks / Inspector Notes</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Delivered on time. Packing seal checked."
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white h-20 resize-none"
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
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20"
                >
                  Save Goods Receipt Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodsReceipt;
