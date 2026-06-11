import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LiveChat from './components/LiveChat.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OrderTracking from './pages/OrderTracking.jsx';
import UploadPrescriptionPage from './pages/UploadPrescriptionPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

// Route guards for protecting sensitive portals
function RequireAuth({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Navigation header */}
      <Navbar />

      {/* Main content body wrapper */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/medicine/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          
          {/* Guest Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer Protected routes */}
          <Route 
            path="/checkout" 
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } 
          />
          <Route 
            path="/order-tracking/:id" 
            element={
              <RequireAuth>
                <OrderTracking />
              </RequireAuth>
            } 
          />
          <Route 
            path="/upload-prescription" 
            element={
              <RequireAuth>
                <UploadPrescriptionPage />
              </RequireAuth>
            } 
          />

          {/* Admin Protected routes */}
          <Route 
            path="/admin" 
            element={
              <RequireAuth adminOnly={true}>
                <AdminDashboard />
              </RequireAuth>
            } 
          />

          {/* Catch-all fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating interactive assistant */}
      <LiveChat />

      {/* Footer disclaimers & information */}
      <Footer />

    </div>
  );
}
