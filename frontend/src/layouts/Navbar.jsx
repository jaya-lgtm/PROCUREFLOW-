import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, toggleTheme, toggleNotifications, toggleCommandPalette } from '../store/uiSlice';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Bell, Search, Sun, Moon, Database, ChevronDown, Check, User, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.ui.theme);
  const notificationsOpen = useSelector((state) => state.ui.notificationDrawerOpen);
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);
  
  const {
    activeRole,
    switchRole,
    dbMode,
    toggleDBMode,
    currentUser,
    notifications
  } = useSimulatedDB();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const roles = [
    'Admin',
    'Procurement Manager',
    'Purchase Officer',
    'Finance Manager',
    'Warehouse Manager',
    'Vendor'
  ];

  // Derive page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Executive Dashboard';
    if (path === '/flow') return 'SAP Process Flow';
    if (path === '/materials') return 'Material Master (SAP MM)';
    if (path === '/vendors') return 'Vendor Master Registry';
    if (path === '/prs') return 'Purchase Requisitions';
    if (path === '/rfqs') return 'RFQ & Quotation Collection';
    if (path === '/comparison') return 'Quotation Side-by-Side Comparison';
    if (path === '/pos') return 'Purchase Orders Ledger';
    if (path === '/gr') return 'Goods Receipt Note (GRN)';
    if (path === '/invoice-verification') return 'Invoice 3-Way Match Verification';
    if (path === '/payments') return 'Accounts Payable & Payments (FICO)';
    if (path === '/warehouse') return 'Warehouse Inventory Ledger';
    if (path === '/analytics') return 'Procurement Insights & Analytics';
    if (path === '/ai-copilot') return 'AI Procurement Copilot';
    if (path === '/architecture') return 'System Architecture Diagram';
    if (path === '/settings') return 'Platform Configurations';
    return 'ProcureFlow S/4';
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return ['Home', 'Dashboard'];
    const title = getPageTitle();
    return ['Home', title];
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm transition-colors duration-200">
      {/* Left: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 block md:hidden"
        >
          <Search size={20} />
        </button>

        <div className="hidden sm:block">
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {getBreadcrumbs().map((b, i) => (
              <React.Fragment key={b}>
                {i > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
                <span className={i === getBreadcrumbs().length - 1 ? "text-slate-800 dark:text-slate-200 font-semibold" : ""}>
                  {b}
                </span>
              </React.Fragment>
            ))}
          </nav>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white mt-0.5 tracking-tight leading-none">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Search, DB Mode, Role switcher, Theme, Notifs, Profile */}
      <div className="flex items-center gap-3">
        {/* Ctrl+K Search Trigger */}
        <button
          onClick={() => dispatch(toggleCommandPalette(true))}
          className="hidden md:flex items-center gap-2 text-xs border border-slate-250 dark:border-slate-750 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-lg text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer"
        >
          <Search size={14} />
          <span>Search command...</span>
          <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 rounded text-[10px] font-bold">
            Ctrl+K
          </kbd>
        </button>

        {/* Database Mode Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => toggleDBMode('demo')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              dbMode === 'demo'
                ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Database size={13} />
            <span className="hidden lg:inline">Demo DB</span>
          </button>
          <button
            onClick={() => toggleDBMode('live')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
              dbMode === 'live'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="Connects to standard Node API"
          >
            <Database size={13} />
            <span className="hidden lg:inline">Live Server</span>
          </button>
        </div>

        {/* Role Selector (Demo Tool) */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            onBlur={() => setTimeout(() => setRoleMenuOpen(false), 200)}
            className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-250 dark:border-slate-750 text-xs px-3 py-1.5 rounded-lg font-medium text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 hidden xl:inline">Role:</span>
            <span>{activeRole}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
          {roleMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Simulation Role
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className={r === activeRole ? "font-bold text-primary dark:text-primary-light" : ""}>{r}</span>
                  {r === activeRole && <Check size={14} className="text-primary dark:text-primary-light" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg border border-slate-250 dark:border-slate-750 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => dispatch(toggleNotifications())}
          className="p-2 rounded-lg border border-slate-250 dark:border-slate-750 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors cursor-pointer"
        >
          <Bell size={18} />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            onBlur={() => setTimeout(() => setProfileMenuOpen(false), 200)}
            className="flex items-center gap-2 hover:opacity-85 transition"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-primary-light flex items-center justify-center font-bold text-sm border border-primary/20">
              {currentUser.username[0]}
            </div>
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-800 dark:text-white block truncate">{currentUser.username}</span>
                <span className="text-[10px] text-slate-400 block truncate">{currentUser.email}</span>
              </div>
              <button
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                onClick={() => dispatch(toggleCommandPalette(true))}
              >
                <Search size={14} />
                <span>Command Palette</span>
              </button>
              <button
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs text-danger hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-slate-100 dark:border-slate-700"
                onClick={() => {
                  alert('Logged out from current session. Resetting to default Demo User.');
                  window.location.reload();
                }}
              >
                <LogOut size={14} />
                <span>Logout Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
