import React, { useState } from 'react';
import { Network, Laptop, Server, Database, ShieldCheck, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

const Architecture = () => {
  const [activeLayer, setActiveLayer] = useState('frontend');

  const layers = {
    frontend: {
      title: 'Frontend Client (Vite React)',
      tech: 'React 18, Tailwind CSS, Redux Toolkit, React Router, Recharts, Framer Motion',
      desc: 'Corporate-sleek SPA client compiling instantly. Local Demo DB mode runs a local mock database sync to browser LocalStorage to preview all workflows without MongoDB dependencies. Standard mode routes REST API requests.',
      flow: 'Dispatches UI actions -> Stores auth tokens -> Queries Express endpoints -> Visualizes analytics.',
      security: 'Class-based routing, JWT token cache storage, encrypted localStorage backups.',
      icon: Laptop,
      color: 'border-primary/45 bg-primary/5 text-primary',
    },
    express: {
      title: 'REST API Middleware (Express.js)',
      tech: 'Node.js, Express Router, CORS parser, Body Parser',
      desc: 'API Router handling client requests, registering authentication endpoints, and routing operational procurement transactions. Verifies auth tokens on request headers.',
      flow: 'Validates request token -> Parses queries -> Checks user roles -> Triggers controller logic.',
      security: 'CORS policy compliance, bcrypt password validation, JWT signature verification.',
      icon: Server,
      color: 'border-success/45 bg-success/5 text-success',
    },
    database: {
      title: 'Enterprise Database (MongoDB Mongoose)',
      tech: 'MongoDB, Mongoose ORM, indexing, collections validations',
      desc: 'Document storage representing SAP Material Master, Vendor scorecards, purchase contracts, receipts, and accounts payable invoices. Uses Mongoose pre-save middlewares for audits.',
      flow: 'Fetches collections -> Performs atomic increments (stock logs) -> Stores transaction history.',
      security: 'Unique constraints (PO / GRN number validations), schema level Zod validation equivalence.',
      icon: Database,
      color: 'border-warning/45 bg-warning/5 text-warning',
    },
    ai: {
      title: 'Cognitive Engine & Analytics (AI Copilot)',
      tech: 'Heuristics weights algorithm, spend forecasting Recharts engine, GPT mock agent',
      desc: 'Calculates optimization matrices for vendor bid comparisons. Balances pricing quotation margins with supplier past quality scores and delivery metrics. Predicts future stock-out safety risk triggers.',
      flow: 'Analyzes RFQ quotations -> Computes weighted optimal supplier -> Feeds chat dashboard widgets.',
      security: 'Strict validation of inputs, restricted query access scopes.',
      icon: Cpu,
      color: 'border-purple-500/45 bg-purple-500/5 text-purple-500',
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white">ProcureFlow S/4 System Architecture</h3>
        <p className="text-xs text-slate-450 mt-1">Interactive overview of the enterprise tech stack layers, data flow patterns, and security filters.</p>
      </div>

      {/* Grid diagram flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {Object.entries(layers).map(([key, layer], idx) => {
          const Icon = layer.icon;
          const isActive = activeLayer === key;
          return (
            <React.Fragment key={key}>
              <div
                onClick={() => setActiveLayer(key)}
                className={`p-5 rounded-xl border-2 cursor-pointer shadow-sm hover:shadow-md transition text-center flex flex-col items-center gap-3 relative ${
                  isActive
                    ? layer.color + ' ring-2 ring-primary/20'
                    : 'border-slate-200 dark:border-slate-755 bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                <div className={`p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50`}>
                  <Icon size={24} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tier 0{idx + 1}</span>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-white mt-1">{layer.title.split(' ')[0]} Layer</h4>
                </div>
              </div>
              
              {idx < 3 && (
                <div className="hidden md:flex justify-center text-slate-300 dark:text-slate-700">
                  <ArrowRight size={20} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Layer detailed breakdown pane */}
      {activeLayer && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Detailed Layer Specs: {layers[activeLayer].title}</h3>
            <span className="text-[10px] text-slate-400 block font-semibold mt-1">Tech Stack: {layers[activeLayer].tech}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed font-semibold">
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-750">
              <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1.5">Layer Description</span>
              <p className="text-slate-650 dark:text-slate-350">{layers[activeLayer].desc}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-755">
              <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1.5">Data Flow Direction</span>
              <p className="text-slate-650 dark:text-slate-355">{layers[activeLayer].flow}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 dark:border-slate-755">
              <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1.5 flex items-center gap-1">
                <ShieldCheck size={12} className="text-success" />
                <span>Security Controls</span>
              </span>
              <p className="text-slate-650 dark:text-slate-355">{layers[activeLayer].security}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Architecture;
