import React from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Mail, FileCheck, ClipboardCheck,
  FileSpreadsheet, CreditCard, ChevronRight, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';

const ProcessFlow = () => {
  const navigate = useNavigate();
  const { prs, rfqs, pos, grns, invoices, payments } = useSimulatedDB();

  // Dynamic calculations for steps
  const prCount = prs.length;
  const prPending = prs.filter(p => p.status === 'Submitted').length;

  const rfqCount = rfqs.length;
  const rfqPending = rfqs.filter(r => r.status === 'Sent').length;

  const selectionCount = rfqs.filter(r => r.status === 'Quotation Received').length;

  const poCount = pos.length;
  const poPending = pos.filter(p => p.status === 'Created').length;

  const grnCount = grns.length;

  const invoiceCount = invoices.length;
  const invoicePending = invoices.filter(i => i.status === 'Pending' || i.status === 'Blocked').length;

  const paymentCount = payments.length;
  const paymentPending = payments.filter(p => p.status === 'Scheduled').length;

  const steps = [
    {
      title: 'Purchase Requisition',
      desc: 'Internal departments request materials.',
      count: prCount,
      pending: prPending,
      pendingLabel: 'Awaiting Approval',
      icon: FileText,
      path: '/prs',
      color: 'bg-blue-500/10 text-primary border-primary/25',
    },
    {
      title: 'Request for Quote (RFQ)',
      desc: 'Inquire pricing from multiple vendors.',
      count: rfqCount,
      pending: rfqPending,
      pendingLabel: 'Open Bids',
      icon: Mail,
      path: '/rfqs',
      color: 'bg-emerald-500/10 text-success border-success/25',
    },
    {
      title: 'Quotation Comparison',
      desc: 'Receive quotes & analyze prices.',
      count: selectionCount,
      pending: selectionCount,
      pendingLabel: 'Quotes to Compare',
      icon: ChevronRight,
      path: '/comparison',
      color: 'bg-purple-500/10 text-aiAccent border-aiAccent/25',
    },
    {
      title: 'Purchase Order (PO)',
      desc: 'Formal commitment issued to supplier.',
      count: poCount,
      pending: poPending,
      pendingLabel: 'Pending Approval',
      icon: FileCheck,
      path: '/pos',
      color: 'bg-orange-500/10 text-warning border-warning/25',
    },
    {
      title: 'Goods Receipt (GRN)',
      desc: 'Acknowledge receiving items in warehouse.',
      count: grnCount,
      pending: 0,
      pendingLabel: '',
      icon: ClipboardCheck,
      path: '/gr',
      color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/25',
    },
    {
      title: 'Invoice Verification',
      desc: 'SAP 3-Way Match validation.',
      count: invoiceCount,
      pending: invoicePending,
      pendingLabel: 'Blocked/Pending',
      icon: FileSpreadsheet,
      path: '/invoice-verification',
      color: 'bg-red-500/10 text-danger border-danger/25',
    },
    {
      title: 'FICO Payment',
      desc: 'Process bank disbursements.',
      count: paymentCount,
      pending: paymentPending,
      pendingLabel: 'Payments Scheduled',
      icon: CreditCard,
      path: '/payments',
      color: 'bg-teal-500/10 text-teal-500 border-teal-500/25',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Procure-to-Pay (P2P) Flow Visualizer</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monitor the progression logs of materials and documents across the entire organization. Click any stage to navigate.
        </p>
      </div>

      {/* Interactive Process Flow Diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate(step.path)}
              className={`cursor-pointer bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group`}
            >
              <div>
                {/* Node icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg border ${step.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Stage 0{idx + 1}</span>
                </div>

                {/* Info */}
                <h4 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
                  {step.desc}
                </p>
              </div>

              {/* Status Metrics */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-slate-800 dark:text-white block">{step.count}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold block">Total Documents</span>
                </div>
                {step.pending > 0 ? (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-warning-hover bg-warning/10 px-2 py-0.5 rounded border border-warning/10">
                    <AlertCircle size={10} />
                    <span>{step.pending} {step.pendingLabel}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded border border-success/10">
                    <CheckCircle2 size={10} />
                    <span>Clear</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Workflow Analytics Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Procurement Stage Completion Analytics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Material Acquisition Rate</span>
                <span>80%</span>
              </div>
              <div className="w-full h-2 bg-slate-150 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>RFQ Bidding Conversion Rate</span>
                <span>65%</span>
              </div>
              <div className="w-full h-2 bg-slate-150 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>PO Delivery Completion</span>
                <span>90%</span>
              </div>
              <div className="w-full h-2 bg-slate-150 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '90%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>3-Way Verification Accuracy</span>
                <span>98%</span>
              </div>
              <div className="w-full h-2 bg-slate-150 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Actionable recommendations card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">P2P Workflow Health</h3>
            <p className="text-xs text-slate-400 mb-4 leading-normal">
              Review systemic recommendations to optimize procurement cycle times.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/5 dark:bg-red-500/5 border border-red-550/10 rounded-lg">
                <span className="text-[10px] font-bold text-danger uppercase block mb-1">Bottleneck Warning</span>
                <span className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                  Invoice verification cycle times have increased by <strong>1.8 days</strong> due to blocked price mismatches on Matrix Metals invoices.
                </span>
              </div>
              <div className="p-3 bg-blue-500/5 dark:bg-blue-500/5 border border-blue-550/10 rounded-lg">
                <span className="text-[10px] font-bold text-primary uppercase block mb-1">Process Optimization</span>
                <span className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">
                  Auto-convert approved high-priority Requisitions directly to RFQs to save administrative routing time.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlow;
