import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuthStore();
  const location = useLocation();

  if (isGuest || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check user_role strictly: if not admin, redirect to home
  if (user.user_role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
