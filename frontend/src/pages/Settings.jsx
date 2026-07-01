import React from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Settings, ShieldCheck, Database, RefreshCw, User } from 'lucide-react';

const SettingsPage = () => {
  const {
    dbMode,
    toggleDBMode,
    activeRole,
    currentUser
  } = useSimulatedDB();

  const handleResetDB = () => {
    if (window.confirm('Restore initial database seeds? This deletes all custom requisitions, goods receipts, and invoices.')) {
      localStorage.clear();
      alert('Mock database reset completed. Refreshing page...');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* DB Switcher */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <Database className="text-primary" size={20} />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Database Routing Configuration</h3>
        </div>
        
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          Toggle between local simulated browser storage (in-browser DB) and the live enterprise REST API server. 
          Note: to connect to the live database, ensure the Node.js / Express backend server is running on port 5000.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={() => toggleDBMode('demo')}
            className={`p-4 rounded-xl border-2 text-left flex-1 space-y-1 transition ${
              dbMode === 'demo'
                ? 'border-primary bg-primary/5 text-primary shadow'
                : 'border-slate-200 dark:border-slate-755 hover:bg-slate-50 dark:hover:bg-slate-850/50 text-slate-500'
            }`}
          >
            <span className="text-xs font-bold block text-slate-800 dark:text-white">Local Demo Mode (Browser DB)</span>
            <span className="text-[10px] block text-slate-450 leading-relaxed font-semibold">
              Runs fully self-contained. Generates mock workflows and persists data locally using localStorage.
            </span>
          </button>

          <button
            onClick={() => toggleDBMode('live')}
            className={`p-4 rounded-xl border-2 text-left flex-1 space-y-1 transition ${
              dbMode === 'live'
                ? 'border-primary bg-primary/5 text-primary shadow'
                : 'border-slate-200 dark:border-slate-755 hover:bg-slate-50 dark:hover:bg-slate-850/50 text-slate-500'
            }`}
          >
            <span className="text-xs font-bold block text-slate-800 dark:text-white">Connected API Mode (Live Server)</span>
            <span className="text-[10px] block text-slate-450 leading-relaxed font-semibold">
              Connects to <code>http://localhost:5000/api</code>. Requires running the Express + MongoDB backend.
            </span>
          </button>
        </div>
      </div>

      {/* User Session Profile details */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <User className="text-primary" size={20} />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Active Profile Summary</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Email address</span>
            <span className="text-slate-800 dark:text-white block">{currentUser.email}</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Username</span>
            <span className="text-slate-800 dark:text-white block">{currentUser.username}</span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Authorization Role</span>
            <span className="text-slate-800 dark:text-white block">{activeRole}</span>
          </div>
          <div className="space-y-1 mt-2">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Company Scope</span>
            <span className="text-slate-800 dark:text-white block">{currentUser.companyName || 'ProcureFlow S/4 Enterprise'}</span>
          </div>
        </div>
      </div>

      {/* Database Reset Tools */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 pb-3">
          <RefreshCw className="text-danger" size={20} />
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">Danger Zone</h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
          Restore initial database seeds. This deletes all custom requisitions, goods receipts, invoices, and payments, reverting the database to starting samples.
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetDB}
            className="flex items-center gap-2 px-4 py-2 border border-danger/30 text-danger bg-red-500/5 hover:bg-danger/10 text-xs font-bold rounded-lg transition cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Reset Simulated DB</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
