import React from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, Users, FileCheck, ShieldAlert,
  TrendingDown, TrendingUp, AlertTriangle, ArrowRight, Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    materials,
    vendors,
    prs,
    pos,
    invoices,
    payments,
    activities,
    approvePR
  } = useSimulatedDB();

  // 1. Calculate KPI Values dynamically
  const activeVendors = vendors.length;
  const openPOs = pos.filter(po => ['Created', 'Approved', 'Sent', 'Partially Delivered'].includes(po.status)).length;
  const pendingApprovalsCount = prs.filter(pr => pr.status === 'Submitted').length + invoices.filter(inv => inv.status === 'Pending').length;
  
  // Total Spend from approved POs
  const totalSpend = pos.reduce((sum, po) => sum + (po.status !== 'Closed' ? po.totalAmount : 0), 0);
  
  // Inventory Value
  let inventoryValue = 0;
  materials.forEach(mat => {
    const valRate = mat.valuationClass === '3000' ? 120 : mat.valuationClass === '7900' ? 350 : 800;
    inventoryValue += mat.currentStock * valRate;
  });

  const kpis = [
    { name: 'Total Spend', value: `$${totalSpend.toLocaleString()}`, change: '+12.5%', isUp: true, icon: DollarSign, color: 'text-primary' },
    { name: 'Active Vendors', value: activeVendors.toString(), change: '0%', isUp: null, icon: Users, color: 'text-success' },
    { name: 'Open Purchase Orders', value: openPOs.toString(), change: '+3 new', isUp: true, icon: FileCheck, color: 'text-warning' },
    { name: 'Pending Approvals', value: pendingApprovalsCount.toString(), change: '-12% this week', isUp: false, icon: ShieldAlert, color: 'text-danger' },
    { name: 'Monthly Savings', value: '$14,250', change: '+18.2%', isUp: true, icon: TrendingDown, color: 'text-purple-500' },
    { name: 'Procurement Efficiency', value: '92.4%', change: '+3.1%', isUp: true, icon: TrendingUp, color: 'text-emerald-500' },
    { name: 'Vendor Score Average', value: '94.2%', change: '+1.5%', isUp: true, icon: Users, color: 'text-blue-500' },
    { name: 'Inventory Asset Value', value: `$${inventoryValue.toLocaleString()}`, change: '-5.4%', isUp: false, icon: DollarSign, color: 'text-amber-500' },
  ];

  // 2. Mock Chart Datasets
  const spendData = [
    { month: 'Jan', spend: 45000, savings: 5000 },
    { month: 'Feb', spend: 52000, savings: 7200 },
    { month: 'Mar', spend: 49000, savings: 6000 },
    { month: 'Apr', spend: 63000, savings: 8500 },
    { month: 'May', spend: 71000, savings: 11000 },
    { month: 'Jun', spend: totalSpend > 0 ? totalSpend : 82000, savings: 14250 },
  ];

  const vendorPerformanceData = vendors.map(v => ({
    name: v.vendorName.split(' ')[0],
    delivery: v.performanceMetrics.onTimeDelivery,
    quality: v.performanceMetrics.qualityScore,
  }));

  const departmentSpendData = [
    { name: 'Engineering', value: 34000 },
    { name: 'Operations', value: 28000 },
    { name: 'R&D', value: 15000 },
    { name: 'Logistics', value: 12000 },
  ];

  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6'];

  // Low stock calculation
  const lowStockItems = materials.filter(m => m.currentStock <= m.reorderPoint);

  // Requisitions that need approval (submitted)
  const pendingRequisitions = prs.filter(pr => pr.status === 'Submitted');

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{kpi.name}</span>
                <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 ${kpi.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">{kpi.value}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {kpi.change !== '0%' && (
                    <span className={`text-[10px] font-bold ${kpi.isUp ? 'text-success' : 'text-danger'}`}>
                      {kpi.change}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400">vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Row: Spend and Supplier Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spend Analytics Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Procurement Spend Analytics</h3>
            <span className="text-xs text-slate-400">Jan 2026 - Jun 2026</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendData}>
                <defs>
                  <linearGradient id="spendColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="savingsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="spend" name="Spend ($)" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#spendColor)" />
                <Area type="monotone" dataKey="savings" name="Cost Savings ($)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#savingsColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Spending Pie */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Department-wise Spend</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentSpendData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentSpendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {departmentSpendData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">{d.name} (${d.value.toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Widgets (Left/Middle/Right Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals Widget */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Awaiting Procurement Approvals</h3>
            <span className="text-xs text-primary font-bold">{pendingRequisitions.length} pending</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto max-h-60">
            {pendingRequisitions.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 dark:text-slate-500">
                No pending purchase requisitions.
              </div>
            ) : (
              pendingRequisitions.map((pr) => (
                <div key={pr.prNumber} className="p-3 border border-slate-150 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">{pr.prNumber}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{pr.materialName} ({pr.quantity} units)</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approvePR(pr.prNumber, false, 'Rejected by Manager')}
                      className="px-2 py-1 bg-danger/10 text-danger hover:bg-danger/20 text-[10px] font-bold rounded"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approvePR(pr.prNumber, true)}
                      className="px-2 py-1 bg-success/10 text-success hover:bg-success/20 text-[10px] font-bold rounded"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button
            onClick={() => navigate('/prs')}
            className="w-full text-center text-xs text-primary dark:text-primary-light font-bold mt-4 flex items-center justify-center gap-1.5 group"
          >
            <span>Requisitions Center</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Low Stock & AI Insight Widget */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Inventory Reorder Alerts</h3>
            <div className="space-y-2">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 dark:text-slate-500">
                  All inventory levels are safe.
                </div>
              ) : (
                lowStockItems.map(item => (
                  <div key={item.materialId} className="flex items-center justify-between p-2 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-danger flex-shrink-0" size={14} />
                      <span className="text-xs font-semibold text-slate-750 dark:text-slate-300 truncate max-w-[140px]">{item.materialName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-danger block">{item.currentStock} {item.unitOfMeasure}</span>
                      <span className="text-[9px] text-slate-400 block">Min req: {item.reorderPoint}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 bg-purple-500/5 dark:bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300 mb-1">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">AI Spend Recommendation</span>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
              "Transitioning raw steel orders from Matrix Metals to Apex Industrial Supplies would yield <strong>12% savings</strong> based on latest RFQ bids."
            </p>
          </div>
        </div>

        {/* Recent Activity Timeline Widget */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Recent Activities</h3>
          <div className="space-y-4 overflow-y-auto max-h-60 pr-1 flex-1">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="relative flex gap-3 pb-2 border-l border-slate-150 dark:border-slate-750 ml-2 pl-4 last:pb-0 last:border-l-0">
                <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-400 block leading-none mb-1">{act.time}</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal font-medium">{act.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Vendor Quality Score Chart */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Vendor Capability Index (Quality & On-Time Delivery %)</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vendorPerformanceData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-700" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
              <Bar dataKey="delivery" name="On-Time Delivery %" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quality" name="Quality Rating %" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
