import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { SimulatedDBProvider, useSimulatedDB } from './context/SimulatedDBContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Core Business Pages
import Dashboard from './pages/Dashboard';
import ProcessFlow from './pages/ProcessFlow';
import MaterialMaster from './pages/MaterialMaster';
import VendorMaster from './pages/VendorMaster';
import PurchaseRequisitions from './pages/PurchaseRequisitions';
import RFQManagement from './pages/RFQManagement';
import QuotationComparison from './pages/QuotationComparison';
import PurchaseOrders from './pages/PurchaseOrders';
import GoodsReceipt from './pages/GoodsReceipt';
import InvoiceVerification from './pages/InvoiceVerification';
import Payments from './pages/Payments';
import Warehouse from './pages/Warehouse';
import Analytics from './pages/Analytics';
import AICopilot from './pages/AICopilot';
import Architecture from './pages/Architecture';
import SettingsPage from './pages/Settings';

// Route Guard
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSimulatedDB();
  
  if (!currentUser || !currentUser.email) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Provider store={store}>
      <SimulatedDBProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Core Workspace Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="flow" element={<ProcessFlow />} />
              <Route path="materials" element={<MaterialMaster />} />
              <Route path="vendors" element={<VendorMaster />} />
              <Route path="prs" element={<PurchaseRequisitions />} />
              <Route path="rfqs" element={<RFQManagement />} />
              <Route path="comparison" element={<QuotationComparison />} />
              <Route path="pos" element={<PurchaseOrders />} />
              <Route path="gr" element={<GoodsReceipt />} />
              <Route path="invoice-verification" element={<InvoiceVerification />} />
              <Route path="payments" element={<Payments />} />
              <Route path="warehouse" element={<Warehouse />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="ai-copilot" element={<AICopilot />} />
              <Route path="architecture" element={<Architecture />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SimulatedDBProvider>
    </Provider>
  );
};

export default App;
