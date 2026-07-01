import React from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Layers, AlertTriangle, RefreshCcw, PackageCheck, Truck } from 'lucide-react';

const Warehouse = () => {
  const { materials, grns } = useSimulatedDB();

  // Dynamically calculate stock metric totals
  const totalCurrentStock = materials.reduce((sum, m) => sum + m.currentStock, 0);
  const totalReservedStock = materials.reduce((sum, m) => sum + (m.reservedStock || 0), 0);
  const totalIncomingStock = materials.reduce((sum, m) => sum + (m.incomingStock || 0), 0);
  const totalOutgoingStock = materials.reduce((sum, m) => sum + (m.outgoingStock || 0), 0);

  // Math Valuation (Current Stock * average class value)
  const valuationClassRates = { '3000': 120, '7900': 350, '7920': 800 };
  const totalValuation = materials.reduce((sum, m) => {
    const rate = valuationClassRates[m.valuationClass] || 120;
    return sum + (m.currentStock * rate);
  }, 0);

  const materialsChartData = materials.map(m => ({
    name: m.materialId,
    Current: m.currentStock,
    Reorder: m.reorderPoint,
    Safety: m.safetyStock,
  }));

  // Create a Movement Ledger from Goods Receipts logs
  const movementLedger = [];
  grns.forEach(grn => {
    grn.items.forEach(item => {
      movementLedger.push({
        time: grn.createdAt,
        type: 'GRN Receipt',
        doc: grn.grnNumber,
        material: item.materialName,
        materialId: item.materialId,
        qty: `+${item.quantityReceived - (item.quantityDamaged || 0)} PC`,
        loc: item.storageLocation,
        user: grn.inspector,
        color: 'text-success',
      });
    });
  });

  // Supplement with some mock reservations/outgoing logs for a complete ledger
  movementLedger.push({
    time: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    type: 'Stock Reservation',
    doc: 'RES-9901',
    material: 'Raw Steel Plates (10mm)',
    materialId: 'MAT-1001',
    qty: '-10 PC',
    loc: 'SL01',
    user: 'Sarah Jenkins',
    color: 'text-warning',
  });
  movementLedger.push({
    time: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    type: 'Goods Issue (Consumption)',
    doc: 'GI-8802',
    material: 'Electronic Control Modules',
    materialId: 'MAT-1004',
    qty: '-5 PC',
    loc: 'SL03',
    user: 'Assembly Line A',
    color: 'text-danger',
  });

  const reorderAlerts = materials.filter(m => m.currentStock <= m.reorderPoint);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Current Stock Balance', value: totalCurrentStock.toLocaleString() + ' Units', icon: Layers, color: 'text-primary' },
          { name: 'Reserved (Production)', value: totalReservedStock.toLocaleString() + ' Units', icon: PackageCheck, color: 'text-warning' },
          { name: 'Incoming Orders', value: totalIncomingStock.toLocaleString() + ' Units', icon: Truck, color: 'text-success' },
          { name: 'Outgoing Commitments', value: totalOutgoingStock.toLocaleString() + ' Units', icon: RefreshCcw, color: 'text-blue-500' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{item.name}</span>
                <span className="text-xl font-black text-slate-850 dark:text-white mt-1 block">{item.value}</span>
              </div>
              <div className={`p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 ${item.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Stock Levels vs Safety Minimum Thresholds</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialsChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Current" fill="#2563EB" radius={[3, 3, 0, 0]} name="Current Stock" />
                <Bar dataKey="Reorder" fill="#F59E0B" radius={[3, 3, 0, 0]} name="Reorder Point" />
                <Bar dataKey="Safety" fill="#EF4444" radius={[3, 3, 0, 0]} name="Safety Stock" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Valuation & Alerts pane */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Warehouse Valuation</h4>
            <span className="text-2xl font-black text-primary dark:text-primary-light block">${totalValuation.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Valued by FIFO Valuation classes (3000, 7900, 7920).</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Safety Stock Violations</h4>
            <div className="space-y-2">
              {reorderAlerts.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs">
                  All storage bins satisfy safety stock standards.
                </div>
              ) : (
                reorderAlerts.map(m => (
                  <div key={m.materialId} className="flex justify-between items-center p-2.5 bg-red-500/5 border border-red-500/10 rounded-lg text-xs">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-danger flex-shrink-0" size={13} />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{m.materialId}</span>
                    </div>
                    <span className="text-danger font-extrabold">{m.currentStock} / {m.safetyStock} PC</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movement Ledger */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Inventory Movement Ledger (SAP MB51)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-700">
                <th className="py-2.5">Time Log</th>
                <th className="py-2.5">Movement Type</th>
                <th className="py-2.5">Doc ID</th>
                <th className="py-2.5">Material Description</th>
                <th className="py-2.5">Bin Loc</th>
                <th className="py-2.5 text-right">Adjustment Qty</th>
                <th className="py-2.5 text-right">Action Person</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {movementLedger.map((m, idx) => (
                <tr key={idx} className="text-slate-750 dark:text-slate-350 font-medium">
                  <td className="py-3 text-[11px] text-slate-400">{new Date(m.time).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      m.type.includes('Receipt') ? 'bg-success/10 text-success' :
                      m.type.includes('Issue') ? 'bg-danger/10 text-danger' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-slate-400">{m.doc}</td>
                  <td className="py-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{m.material}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{m.materialId}</span>
                  </td>
                  <td className="py-3 font-semibold text-slate-500">{m.loc}</td>
                  <td className={`py-3 text-right font-extrabold ${m.color}`}>{m.qty}</td>
                  <td className="py-3 text-right font-semibold text-slate-600 dark:text-slate-400">{m.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Warehouse;
