import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../store/uiSlice';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import {
  LayoutDashboard,
  GitFork,
  Package,
  Users,
  FileText,
  Mail,
  GitCompare,
  FileCheck,
  ClipboardCheck,
  FileSpreadsheet,
  CreditCard,
  Warehouse,
  BarChart3,
  Sparkles,
  Network,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const { activeRole } = useSimulatedDB();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['Admin', 'Procurement Manager', 'Purchase Officer', 'Finance Manager', 'Warehouse Manager'] },
    { name: 'Process Flow', path: '/flow', icon: GitFork, roles: ['All'] },
    { name: 'Material Master', path: '/materials', icon: Package, roles: ['Admin', 'Purchase Officer', 'Warehouse Manager', 'Procurement Manager'] },
    { name: 'Vendor Master', path: '/vendors', icon: Users, roles: ['Admin', 'Procurement Manager', 'Purchase Officer', 'Finance Manager'] },
    { name: 'Purchase Requisitions', path: '/prs', icon: FileText, roles: ['Admin', 'Purchase Officer', 'Procurement Manager'] },
    { name: 'RFQ Management', path: '/rfqs', icon: Mail, roles: ['Admin', 'Purchase Officer', 'Procurement Manager', 'Vendor'] },
    { name: 'Quotation Comparison', path: '/comparison', icon: GitCompare, roles: ['Admin', 'Procurement Manager', 'Purchase Officer'] },
    { name: 'Purchase Orders', path: '/pos', icon: FileCheck, roles: ['Admin', 'Procurement Manager', 'Finance Manager', 'Vendor'] },
    { name: 'Goods Receipt', path: '/gr', icon: ClipboardCheck, roles: ['Admin', 'Warehouse Manager'] },
    { name: 'Invoice Verification', path: '/invoice-verification', icon: FileSpreadsheet, roles: ['Admin', 'Finance Manager', 'Vendor'] },
    { name: 'Payments', path: '/payments', icon: CreditCard, roles: ['Admin', 'Finance Manager'] },
    { name: 'Warehouse', path: '/warehouse', icon: Warehouse, roles: ['Admin', 'Warehouse Manager'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['Admin', 'Procurement Manager', 'Finance Manager'] },
    { name: 'AI Copilot', path: '/ai-copilot', icon: Sparkles, roles: ['All'], isAi: true },
    { name: 'Architecture', path: '/architecture', icon: Network, roles: ['All'] },
    { name: 'Settings', path: '/settings', icon: Settings, roles: ['All'] },
  ];

  // Filter items by role
  const filteredItems = menuItems.filter(item => 
    item.roles.includes('All') || 
    item.roles.includes(activeRole) || 
    activeRole === 'Admin'
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen bg-secondary dark:bg-secondary-dark text-slate-300 transition-all duration-300 border-r border-slate-800 flex flex-col ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              PF
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-sm block">PROCUREFLOW S/4</span>
              <span className="text-[10px] text-slate-400 block font-medium">Enterprise Edition</span>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-bold text-white mx-auto">
            P
          </div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 hidden md:block"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? item.isAi
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-primary text-white shadow-lg shadow-primary/30'
                    : item.isAi
                    ? 'hover:bg-purple-950/40 hover:text-purple-300 text-purple-400'
                    : 'hover:bg-slate-850 hover:text-white text-slate-400'
                }`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
              {item.isAi && !sidebarCollapsed && (
                <span className="ml-auto text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-500/30 font-bold uppercase tracking-wider scale-90">
                  AI
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Role Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary-light">
            <ShieldCheck size={18} />
          </div>
          {!sidebarCollapsed && (
            <div className="truncate">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Active Role</span>
              <span className="text-xs text-white font-semibold block truncate">{activeRole}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
