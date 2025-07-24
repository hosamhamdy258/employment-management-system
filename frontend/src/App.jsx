import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CompanyList from './pages/CompanyList';
import DepartmentList from './pages/DepartmentList';
import EmployeeList from './pages/EmployeeList';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Navbar from './layout/Navbar';
import Layout from './layout/Layout';
import ToastContainer from './components/ToastContainer';
import useAuthStore from './store/auth';
import useThemeStore from './store/theme';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const { theme } = useThemeStore();
  const token = useAuthStore((s) => s.token);
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isAuthLoading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <Suspense fallback={<div className="d-flex justify-content-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<CompanyList />} />
            <Route path="/departments" element={<DepartmentList />} />
            <Route path="/employees" element={<EmployeeList />} />
          </Route>
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
