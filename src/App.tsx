import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import ProductListing from './pages/product/ProductListing';
import ProductDetail from './pages/product/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import OrderConfirmation from './pages/cart/OrderConfirmation';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import EmailVerification from './pages/auth/EmailVerification';
import Profile from './pages/user/Profile';
import MyOrders from './pages/cart/MyOrders';
import OrderDetails from './pages/cart/OrderDetails';
import AdminOrderManagement from './pages/admin/AdminOrderManagement';
import ProductManagement from './pages/product/ProductManagement';
import ProductImageManagement from './pages/admin/ProductImageManagement';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/CategoryManagement';

// Placeholder component for non-product pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600">This page is coming soon!</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/product/:productId" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/contact" element={<Layout><PlaceholderPage title="Contact Us" /></Layout>} />
            
            {/* Authentication Routes */}
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/register" element={<Layout><Register /></Layout>} />
            <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
            <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
            <Route path="/email-verification" element={<Layout><EmailVerification /></Layout>} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <Layout><MyOrders /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/order-details/:orderId" element={
              <ProtectedRoute>
                <Layout><OrderDetails /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Layout><Cart /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Layout><Checkout /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation/:orderId" element={
              <ProtectedRoute>
                <Layout><OrderConfirmation /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/products" element={
              <ProtectedRoute>
                <Layout><ProductManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/product-images" element={
              <ProtectedRoute>
                <Layout><ProductImageManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute>
                <Layout><AdminOrderManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <Layout><UserManagement /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute>
                <Layout><CategoryManagement /></Layout>
              </ProtectedRoute>
            } />
            
            {/* Dynamic Menu Routes with Categories */}
            <Route path="/:menuName" element={<Layout><ProductListing /></Layout>} />
            <Route path="/:menuName/:categorySlug" element={<Layout><ProductListing /></Layout>} />
            
            {/* 404 Route */}
            <Route path="*" element={<Layout><PlaceholderPage title="Page Not Found" /></Layout>} />
          </Routes>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
