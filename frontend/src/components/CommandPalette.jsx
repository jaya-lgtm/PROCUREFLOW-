import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCommandPaletteOpen, toggleTheme } from '../store/uiSlice';
import { useNavigate } from 'react-router-dom';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, CornerDownLeft, Sparkles, PlusCircle, ShieldAlert, Laptop } from 'lucide-react';

const CommandPalette = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((state) => state.ui.commandPaletteOpen);
  const { switchRole } = useSimulatedDB();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const commandItems = [
    // Page Links
    { category: 'Navigation', name: 'Go to Dashboard', icon: Laptop, action: () => navigate('/') },
    { category: 'Navigation', name: 'Go to Process Flow', icon: Laptop, action: () => navigate('/flow') },
    { category: 'Navigation', name: 'Go to Material Master (MM)', icon: Laptop, action: () => navigate('/materials') },
    { category: 'Navigation', name: 'Go to Vendor Master', icon: Laptop, action: () => navigate('/vendors') },
    { category: 'Navigation', name: 'Go to Requisitions (PR)', icon: Laptop, action: () => navigate('/prs') },
    { category: 'Navigation', name: 'Go to RFQ Management', icon: Laptop, action: () => navigate('/rfqs') },
    { category: 'Navigation', name: 'Go to Quotation Comparison', icon: Laptop, action: () => navigate('/comparison') },
    { category: 'Navigation', name: 'Go to Purchase Orders (PO)', icon: Laptop, action: () => navigate('/pos') },
    { category: 'Navigation', name: 'Go to Goods Receipt (GRN)', icon: Laptop, action: () => navigate('/gr') },
    { category: 'Navigation', name: 'Go to Invoice Verification', icon: Laptop, action: () => navigate('/invoice-verification') },
    { category: 'Navigation', name: 'Go to Payments AP Ledger', icon: Laptop, action: () => navigate('/payments') },
    { category: 'Navigation', name: 'Go to Warehouse Inventory', icon: Laptop, action: () => navigate('/warehouse') },
    { category: 'Navigation', name: 'Go to Executive Analytics', icon: Laptop, action: () => navigate('/analytics') },
    { category: 'AI Copilot', name: 'Ask AI Copilot Assistant', icon: Sparkles, action: () => navigate('/ai-copilot') },
    
    // Quick Actions
    { category: 'Actions', name: 'Create Purchase Requisition', icon: PlusCircle, action: () => { navigate('/prs'); setTimeout(() => { window.dispatchEvent(new CustomEvent('open-pr-modal')); }, 100); } },
    { category: 'Actions', name: 'Toggle Dark / Light Mode', icon: Laptop, action: () => dispatch(toggleTheme()) },
    
    // Role Switching Shortcuts
    { category: 'Simulation Roles', name: 'Switch Role to Admin', icon: ShieldAlert, action: () => switchRole('Admin') },
    { category: 'Simulation Roles', name: 'Switch Role to Procurement Manager', icon: ShieldAlert, action: () => switchRole('Procurement Manager') },
    { category: 'Simulation Roles', name: 'Switch Role to Purchase Officer', icon: ShieldAlert, action: () => switchRole('Purchase Officer') },
    { category: 'Simulation Roles', name: 'Switch Role to Finance Manager', icon: ShieldAlert, action: () => switchRole('Finance Manager') },
    { category: 'Simulation Roles', name: 'Switch Role to Warehouse Manager', icon: ShieldAlert, action: () => switchRole('Warehouse Manager') },
  ];

  // Filter command items
  const filtered = commandItems.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [open]);

  // Global keyboard listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setCommandPaletteOpen(!open));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, dispatch]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      dispatch(setCommandPaletteOpen(false));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        dispatch(setCommandPaletteOpen(false));
      }
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.childNodes[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={() => dispatch(setCommandPaletteOpen(false))}
      />

      {/* Modal */}
      <div
        onKeyDown={handleKeyDown}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 flex flex-col max-h-[450px] animate-in zoom-in-95 duration-100"
      >
        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder="Type a page or command to trigger..."
            className="w-full bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400"
          />
          <button
            onClick={() => dispatch(setCommandPaletteOpen(false))}
            className="text-[10px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="flex-1 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500">
              No actions found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={`${item.name}-${idx}`}
                  onClick={() => { item.action(); dispatch(setCommandPaletteOpen(false)); }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light font-medium'
                      : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon size={14} className={isSelected ? 'text-primary dark:text-primary-light' : 'text-slate-400'} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {item.category}
                    </span>
                    {isSelected && <CornerDownLeft size={10} className="text-primary dark:text-primary-light" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
