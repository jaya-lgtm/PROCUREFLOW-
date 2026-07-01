import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, MapPin, Building, Percent, Calendar, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

const VendorMaster = () => {
  const { vendors, pos } = useSimulatedDB();

  // Active vendor profile selection
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.vendorId || '');
  const [search, setSearch] = useState('');

  const activeVendor = vendors.find(v => v.vendorId === selectedVendorId) || vendors[0];

  const filteredVendors = vendors.filter(v =>
    v.vendorName.toLowerCase().includes(search.toLowerCase()) ||
    v.vendorId.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch PO history for this vendor
  const vendorPOHistory = pos.filter(po => po.vendorId === activeVendor?.vendorId);

  // Score badge helper
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success bg-success/10 border-success/20';
    if (score >= 80) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-danger bg-danger/10 border-danger/20';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Left Column: Vendor Sidebar Search Directory */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search vendor code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-250 dark:border-slate-755 bg-transparent rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
          {filteredVendors.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold">
              No vendors matching search criteria.
            </div>
          ) : (
            filteredVendors.map((v) => (
              <button
                key={v.vendorId}
                onClick={() => setSelectedVendorId(v.vendorId)}
                className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-850/20 transition-colors flex items-center justify-between ${
                  selectedVendorId === v.vendorId ? 'bg-primary/5 dark:bg-primary/10 border-r-4 border-primary' : ''
                }`}
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">{v.vendorId}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[170px]">
                    {v.vendorName}
                  </span>
                  <span className="text-[10px] text-slate-450 mt-1 block">{v.purchasingOrganization} • {v.paymentTerms}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-750 dark:text-slate-300 block">★ {v.rating.toFixed(1)}</span>
                  <span className="text-[9px] text-slate-400 block uppercase font-medium">{v.currency}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Columns: Vendor Detailed Profile and Scorecard */}
      {activeVendor ? (
        <div className="lg:col-span-2 space-y-6">
          {/* Header Profile Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 dark:bg-primary/5 rounded-full translate-x-8 -translate-y-8" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 font-bold uppercase tracking-wider">
                  {activeVendor.vendorId}
                </span>
                <h2 className="text-xl font-bold text-slate-850 dark:text-white mt-2">{activeVendor.vendorName}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2 font-medium">
                  <span className="flex items-center gap-1"><Building size={14} /> Org: {activeVendor.purchasingOrganization}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} /> {activeVendor.address.split(',').slice(-2).join(',').trim()}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> Terms: {activeVendor.paymentTerms}</span>
                </div>
              </div>
              <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-150 dark:border-slate-750 flex-shrink-0">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Evaluation Class</span>
                <span className="text-2xl font-black text-primary dark:text-primary-light block">★ {activeVendor.rating.toFixed(1)}</span>
                <span className="text-[9px] text-success font-bold block uppercase mt-0.5">Approved Supplier</span>
              </div>
            </div>
          </div>

          {/* Supplier Scorecard Circular Gauges */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Supplier Performance Scorecard
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { name: 'On-Time Delivery', value: activeVendor.performanceMetrics.onTimeDelivery, label: 'Delivery' },
                { name: 'Quality Score', value: activeVendor.performanceMetrics.qualityScore, label: 'Quality' },
                { name: 'Cost Efficiency', value: activeVendor.performanceMetrics.costEfficiency, label: 'Cost' },
                { name: 'Response Time', value: activeVendor.performanceMetrics.responseTime, label: 'Response' },
              ].map((metric) => (
                <div key={metric.name} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-750 flex flex-col items-center">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" stroke="#E2E8F0" strokeWidth="4" fill="transparent" className="dark:stroke-slate-750" />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        stroke={metric.value >= 90 ? '#10B981' : metric.value >= 80 ? '#F59E0B' : '#EF4444'}
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - metric.value / 100)}
                        className="transition-all duration-500 ease-out"
                      />
                    </svg>
                    <span className="absolute text-xs font-extrabold text-slate-800 dark:text-white">{metric.value}%</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-3">{metric.label} Index</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contacts Info */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Corporate Contacts</h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <Mail className="text-slate-450 flex-shrink-0" size={15} />
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Email Address</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeVendor.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-slate-450 flex-shrink-0" size={15} />
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Corporate Contact No</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeVendor.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-slate-450 flex-shrink-0" size={15} />
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Registered Office</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold leading-normal">{activeVendor.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 pb-2">Financial Registry</h4>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">GST registration</span>
                    <span className="text-slate-800 dark:text-white font-semibold font-mono">{activeVendor.gstNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Currency</span>
                    <span className="text-slate-800 dark:text-white font-semibold">{activeVendor.currency}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-bold">Bank Name</span>
                  <span className="text-slate-850 dark:text-slate-200 font-semibold block">{activeVendor.bankDetails.bankName}</span>
                  <span className="text-slate-500 font-semibold font-mono block mt-0.5">Acc: {activeVendor.bankDetails.accountNo} • IFSC: {activeVendor.bankDetails.ifsc}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PO Transactions History */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Transaction History</h4>
            <div className="overflow-x-auto">
              {vendorPOHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No purchase order transaction history found.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold border-b border-slate-100 dark:border-slate-700">
                      <th className="py-2.5">PO Number</th>
                      <th className="py-2.5">Date</th>
                      <th className="py-2.5">Items</th>
                      <th className="py-2.5 text-right">Amount</th>
                      <th className="py-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {vendorPOHistory.map((po) => (
                      <tr key={po.poNumber} className="text-slate-700 dark:text-slate-350 font-medium">
                        <td className="py-3 font-bold text-primary hover:underline cursor-pointer flex items-center gap-1">
                          <span>{po.poNumber}</span>
                          <ExternalLink size={10} />
                        </td>
                        <td className="py-3">{new Date(po.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 truncate max-w-[150px]">{po.items.map(i => i.materialName).join(', ')}</td>
                        <td className="py-3 text-right font-bold text-slate-800 dark:text-white">${po.totalAmount.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            po.status === 'Delivered' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="lg:col-span-2 text-center py-20 text-slate-400 dark:text-slate-500 font-semibold">
          Loading vendor directories...
        </div>
      )}
    </div>
  );
};

export default VendorMaster;
