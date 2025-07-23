import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/auth';

function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token);
  const isRefreshing = useAuthStore(s => s.isRefreshing);
  const location = useLocation();

  // Show loading spinner while refreshing tokens
  if (isRefreshing) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking authentication...</span>
        </div>
      </div>
    );
  }

  // If no token and not refreshing, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
