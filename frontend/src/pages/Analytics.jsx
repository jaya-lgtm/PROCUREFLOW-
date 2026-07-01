import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';
import { FileSpreadsheet, Printer, TrendingUp, DollarSign, Award, Clock } from 'lucide-react';

const Analytics = () => {
  const { pos, vendors, invoices, materials } = useSimulatedDB();
  const [activeTab, setActiveTab] = useState('spend');
  const [reportType, setReportType] = useState('PO');

  // Calculations
  const totalSpend = pos.reduce((sum, po) => sum + (po.status !== 'Closed' ? po.totalAmount : 0), 0);
  const totalSavings = 14250;
  const cycleTime = '4.2 Days';
  const supplierRating = 94.2;

  // Chart datasets
  const monthlyProcurementTrends = [
    { month: 'Jan', orders: 12, spend: 45000 },
    { month: 'Feb', orders: 15, spend: 52000 },
    { month: 'Mar', orders: 18, spend: 49000 },
    { month: 'Apr', orders: 22, spend: 63000 },
    { month: 'May', orders: 25, spend: 71000 },
    { month: 'Jun', orders: 28, spend: totalSpend > 0 ? totalSpend : 82000 },
  ];

  const vendorPerformanceScores = vendors.map(v => ({
    name: v.vendorName,
    onTime: v.performanceMetrics.onTimeDelivery,
    quality: v.performanceMetrics.qualityScore,
    fill: v.vendorId === 'VND-2001' ? '#2563EB' : v.vendorId === 'VND-2002' ? '#10B981' : '#F59E0B',
  }));

  // CSV Report Generator
  const generateReportCSV = () => {
    let headers = [];
    let rows = [];
    
    if (reportType === 'PO') {
      headers = ['PO Number,Vendor,Items,Quantity,Amount,Status,Date'];
      rows = pos.map(p => `"${p.poNumber}","${p.vendorName}","${p.items.map(i => i.materialName).join(';')}",${p.totalQuantity},${p.totalAmount},"${p.status}","${new Date(p.createdAt).toLocaleDateString()}"`);
    } else if (reportType === 'Vendor') {
      headers = ['Vendor ID,Name,Rating,OnTimeDelivery%,Quality%'];
      rows = vendors.map(v => `"${v.vendorId}","${v.vendorName}",${v.rating},${v.performanceMetrics.onTimeDelivery},${v.performanceMetrics.qualityScore}`);
    } else {
      headers = ['Invoice ID,PO Ref,Vendor,Amount,Status,PriceMismatch'];
      rows = invoices.map(i => `"${i.invoiceNumber}","${i.poReference}","${i.vendorName}",${i.totalAmount},"${i.status}",${i.threeWayMatch.priceMismatch}`);
    }

    const content = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encoded = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `procureflow_report_${reportType.toLowerCase()}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 rounded-lg max-w-sm text-xs font-semibold">
        <button
          onClick={() => setActiveTab('spend')}
          className={`flex-1 py-2 text-center rounded-md transition ${
            activeTab === 'spend' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Spend Analytics
        </button>
        <button
          onClick={() => setActiveTab('vendor')}
          className={`flex-1 py-2 text-center rounded-md transition ${
            activeTab === 'vendor' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Vendor Performance
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 text-center rounded-md transition ${
            activeTab === 'reports' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          AP Report Center
        </button>
      </div>

      {activeTab === 'spend' && (
        <div className="space-y-6">
          {/* Analytics Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: 'Spend YTD', value: `$${(totalSpend + 250000).toLocaleString()}`, icon: DollarSign, color: 'text-primary' },
              { name: 'Procure Savings YTD', value: `$${(totalSavings + 45000).toLocaleString()}`, icon: TrendingUp, color: 'text-success' },
              { name: 'Avg Procurement Cycle', value: cycleTime, icon: Clock, color: 'text-warning' },
              { name: 'Supplier Capacity Average', value: `${supplierRating}%`, icon: Award, color: 'text-purple-500' },
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{kpi.name}</span>
                    <Icon size={16} className={kpi.color} />
                  </div>
                  <span className="text-xl font-black text-slate-800 dark:text-white block mt-2">{kpi.value}</span>
                </div>
              );
            })}
          </div>

          {/* Area Chart spend trends */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Monthly Procurement Trends</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProcurementTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="spend" name="Spend ($)" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="orders" name="Order count" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vendor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">On-Time Delivery vs Quality Scores</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vendorPerformanceScores} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                  <Bar dataKey="onTime" fill="#2563EB" radius={[3, 3, 0, 0]} name="On-Time Delivery %" />
                  <Bar dataKey="quality" fill="#10B981" radius={[3, 3, 0, 0]} name="Quality Index %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Vendor Score distribution</h3>
            <div className="space-y-4">
              {vendors.map(v => (
                <div key={v.vendorId} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-750 dark:text-slate-300">
                    <span>{v.vendorName}</span>
                    <span className="text-amber-500">★ {v.rating.toFixed(1)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-750 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${v.rating * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-4 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-550 dark:text-slate-400">Report Type:</span>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-800 dark:text-white font-bold"
              >
                <option value="PO">Purchase Order Ledger Report</option>
                <option value="Vendor">Vendor Capability Directory</option>
                <option value="Invoice">Invoice verified Ledger</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-250 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 print:hidden cursor-pointer"
              >
                <Printer size={13} />
                <span>Export PDF</span>
              </button>
              <button
                onClick={generateReportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-success text-white hover:bg-success-hover rounded-lg text-xs font-bold shadow-lg shadow-success/15 print:hidden cursor-pointer"
              >
                <FileSpreadsheet size={13} />
                <span>Export Excel / CSV</span>
              </button>
            </div>
          </div>

          {/* Printable Report sheet */}
          <div className="space-y-4">
            <div className="hidden print:block text-center border-b pb-4 mb-4">
              <h2 className="text-lg font-bold">PROCUREFLOW S/4 ENTERPRISE REPORT</h2>
              <span className="text-xs text-slate-400">Type: {reportType} Report • Date Generated: {new Date().toLocaleString()}</span>
            </div>

            {reportType === 'PO' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5 px-4">PO Number</th>
                    <th className="py-2.5 px-4">Vendor</th>
                    <th className="py-2.5 px-4 text-right">Items</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {pos.map(p => (
                    <tr key={p.poNumber} className="text-slate-750 dark:text-slate-350">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">{p.poNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{p.vendorName}</td>
                      <td className="py-3 px-4 text-right">{p.totalQuantity} items</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800 dark:text-white">${p.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'Vendor' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5 px-4">Vendor ID</th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4 text-right">Rating</th>
                    <th className="py-2.5 px-4 text-right">On-Time Del. %</th>
                    <th className="py-2.5 px-4 text-right">Quality %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {vendors.map(v => (
                    <tr key={v.vendorId} className="text-slate-755 dark:text-slate-350 font-medium">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">{v.vendorId}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{v.vendorName}</td>
                      <td className="py-3 px-4 text-right font-bold">★ {v.rating.toFixed(1)}</td>
                      <td className="py-3 px-4 text-right font-bold text-primary">{v.performanceMetrics.onTimeDelivery}%</td>
                      <td className="py-3 px-4 text-right font-bold text-success">{v.performanceMetrics.qualityScore}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'Invoice' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-400">
                    <th className="py-2.5 px-4">Invoice Number</th>
                    <th className="py-2.5 px-4">PO Reference</th>
                    <th className="py-2.5 px-4">Vendor Name</th>
                    <th className="py-2.5 px-4 text-right">Total amount</th>
                    <th className="py-2.5 px-4 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {invoices.map(i => (
                    <tr key={i.invoiceNumber} className="text-slate-755 dark:text-slate-350">
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">{i.invoiceNumber}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">{i.poReference}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{i.vendorName}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800 dark:text-white">${i.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          i.status === 'Verified' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                        }`}>
                          {i.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
