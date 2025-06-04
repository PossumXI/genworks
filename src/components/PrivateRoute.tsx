import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: Array<'vibeCoder' | 'client' | 'hubContributor'>;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login\" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/\" replace />;
  }

  return <>{children}</>;
};