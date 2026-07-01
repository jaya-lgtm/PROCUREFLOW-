import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimulatedDB } from '../../context/SimulatedDBContext';
import { KeyRound, Mail, Sparkles, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useSimulatedDB();

  const [email, setEmail] = useState('manager@procureflow.com');
  const [password, setPassword] = useState('manager123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setErrorMsg(res.message || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMsg('Could not verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleShortcutLogin = (eVal, pVal) => {
    setEmail(eVal);
    setPassword(pVal);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-extrabold text-white text-xl mx-auto shadow-lg shadow-primary/20">
            PF
          </div>
          <h2 className="text-xl font-black text-slate-850 dark:text-white mt-4 tracking-tight">PROCUREFLOW S/4</h2>
          <p className="text-xs text-slate-450 mt-1 font-semibold">Intelligent Procurement. Smarter Decisions.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-danger flex items-center gap-2">
              <AlertCircle size={14} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2 border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/10 transition cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* Quick Sign-in helpers (very helpful for interview / review purposes!) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Simulated Quick Credentials</span>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500">
              <button
                type="button"
                onClick={() => handleShortcutLogin('manager@procureflow.com', 'manager123')}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-750 text-left truncate"
              >
                Procure Manager
              </button>
              <button
                type="button"
                onClick={() => handleShortcutLogin('finance@procureflow.com', 'finance123')}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-755 text-left truncate"
              >
                Finance Manager
              </button>
              <button
                type="button"
                onClick={() => handleShortcutLogin('officer@procureflow.com', 'officer123')}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-755 text-left truncate"
              >
                Purchase Officer
              </button>
              <button
                type="button"
                onClick={() => handleShortcutLogin('warehouse@procureflow.com', 'warehouse123')}
                className="p-1.5 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-755 text-left truncate"
              >
                Warehouse Manager
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-primary hover:underline font-bold">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
