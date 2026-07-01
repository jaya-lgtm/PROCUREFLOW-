import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationsOpen } from '../store/uiSlice';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, BellOff } from 'lucide-react';

const NotificationDrawer = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.notificationDrawerOpen);
  const { notifications } = useSimulatedDB();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setNotificationsOpen(false))}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-80 sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-colors duration-200"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 dark:text-white">Notifications Center</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {notifications.filter(n => !n.read).length} new
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch(setNotificationsOpen(false))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 flex flex-col items-center gap-2">
                  <BellOff size={32} strokeWidth={1.5} />
                  <span className="text-xs font-semibold">Your inbox is clear</span>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-lg border flex gap-3 transition cursor-pointer ${
                      n.read
                        ? 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/50'
                        : 'bg-blue-50/40 dark:bg-primary/5 border-primary/20 dark:border-primary/10 hover:bg-blue-50 dark:hover:bg-primary/10'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {n.text.includes('BLOCK') || n.text.includes('requires') ? (
                        <AlertTriangle className="text-warning" size={16} />
                      ) : n.text.includes('approve') || n.text.includes('complete') ? (
                        <CheckCircle className="text-success" size={16} />
                      ) : (
                        <Info className="text-primary" size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        {n.text}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        {n.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-850/50">
              <button
                onClick={() => alert('All notifications marked as read')}
                className="text-xs font-bold text-primary hover:text-primary-dark dark:text-primary-light"
              >
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
