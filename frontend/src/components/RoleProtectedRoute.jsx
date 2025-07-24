import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/auth';

const RoleProtectedRoute = ({ roles }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  if (isAuthLoading) {
    return <div>Loading...</div>; // Or a spinner
  }

  // The parent PrivateRoute already handles the !user case
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
