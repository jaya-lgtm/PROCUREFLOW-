import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import NotificationDrawer from './NotificationDrawer';
import CommandPalette from '../components/CommandPalette';
import { initTheme } from '../store/uiSlice';

const MainLayout = () => {
  const dispatch = useDispatch();
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const theme = useSelector((state) => state.ui.theme);

  // Initialize theme on mount
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark transition-colors duration-200">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Panel Wrapper */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        }`}
      >
        {/* Navbar */}
        <Navbar />

        {/* Content Outlet */}
        <main className="flex-1 p-6 relative">
          <Outlet />
        </main>
      </div>

      {/* Overlays & Dialogs */}
      <NotificationDrawer />
      <CommandPalette />
    </div>
  );
};

export default MainLayout;
