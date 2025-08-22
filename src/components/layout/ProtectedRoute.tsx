import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { hasRole, hasPermission, canAccessAdmin, Permission } from '../../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
  requirePhoneVerification?: boolean;
  requiredRole?: string;
  requiredPermissions?: Permission[];
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireEmailVerification = false, 
  requirePhoneVerification = false,
  requiredRole,
  requiredPermissions,
  adminOnly = false
}) => {
  const { user, loading } = useAppContext();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Please log in to access this page'
        }} 
        replace 
      />
    );
  }

  // Check email verification requirement
  if (requireEmailVerification && !user.emailVerified) {
    return (
      <Navigate 
        to="/email-verification" 
        state={{ 
          method: 'email' as const,
          contact: user.email,
          fromPage: location.pathname,
          message: 'Please verify your email to continue'
        }} 
        replace 
      />
    );
  }

  // Check phone verification requirement
  if (requirePhoneVerification && !user.phoneVerified && user.phone) {
    return (
      <Navigate 
        to="/email-verification" 
        state={{ 
          method: 'phone' as const,
          contact: user.phone,
          fromPage: location.pathname,
          message: 'Please verify your phone number to continue'
        }} 
        replace 
      />
    );
  }

  // If phone verification is required but user has no phone number
  if (requirePhoneVerification && !user.phone) {
    return (
      <Navigate 
        to="/profile" 
        state={{ 
          message: 'Please add a phone number to your profile and verify it to continue',
          requirePhone: true
        }} 
        replace 
      />
    );
  }

  // Check admin-only access
  if (adminOnly && !canAccessAdmin(user.role || 'customer')) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          message: 'Access denied. Admin privileges required.'
        }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole && !hasRole(user.role || 'customer', requiredRole)) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          message: `Access denied. ${requiredRole} role required.`
        }} 
        replace 
      />
    );
  }

  // Check permission-based access
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.some(permission => 
      hasPermission(user.role || 'customer', permission)
    );
    
    if (!hasRequiredPermissions) {
      return (
        <Navigate 
          to="/" 
          state={{ 
            message: 'Access denied. Insufficient permissions.'
          }} 
          replace 
        />
      );
    }
  }

  // User is authenticated and meets all requirements
  return <>{children}</>;
};

export default ProtectedRoute; 