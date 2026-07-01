import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimulatedDB } from '../../context/SimulatedDBContext';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { dbMode } = useSimulatedDB();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!email || !newPassword) return;

    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      if (dbMode === 'demo') {
        setTimeout(() => {
          setSuccess(true);
          setLoading(false);
        }, 800);
      } else {
        const res = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword }),
        }).then(r => r.json());

        if (res.success) {
          setSuccess(true);
        } else {
          setErrorMsg(res.message || 'Verification failed.');
        }
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg('Server connection failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center font-extrabold text-white text-xl mx-auto shadow-lg shadow-primary/20">
            PF
          </div>
          <h2 className="text-xl font-black text-slate-850 dark:text-white mt-4 tracking-tight">Update Password</h2>
          <p className="text-xs text-slate-450 mt-1 font-semibold font-sans">Set your new procurement portal credentials.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
          {success ? (
            <div className="p-4 bg-success/5 border border-success/15 rounded-xl space-y-3 text-center">
              <CheckCircle className="text-success mx-auto" size={32} />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                Password updated successfully. You can now access your workspace.
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Proceed to Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-danger">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Confirm Email</label>
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
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                {loading ? 'Updating Credentials...' : 'Save New Password'}
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <Link to="/login" className="flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white font-bold transition">
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
