import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSimulatedDB } from '../../context/SimulatedDBContext';
import { KeyRound, Mail, User, ShieldAlert, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useSimulatedDB();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Purchase Officer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await register(username, email, password, role);
      if (res.success || res.hasOwnProperty('data') || !res.message) {
        alert('Account created. Logging in...');
        navigate('/');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Could not register account.');
    } finally {
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
          <h2 className="text-xl font-black text-slate-850 dark:text-white mt-4 tracking-tight">Create Workspace Account</h2>
          <p className="text-xs text-slate-450 mt-1 font-semibold">Join ProcureFlow S/4 procurement network.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs text-danger flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Username / Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-2 border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs outline-none focus:border-primary text-slate-850 dark:text-white"
                />
              </div>
            </div>

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
              <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Select Role</label>
              <div className="relative">
                <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white font-semibold"
                >
                  <option value="Purchase Officer">Purchase Officer</option>
                  <option value="Procurement Manager">Procurement Manager</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block mb-1">Choose Password</label>
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
              {loading ? 'Creating Account...' : 'Sign Up Account'}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-slate-500">
          <span>Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-bold">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
