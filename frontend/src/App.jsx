import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import CompanyList from './pages/CompanyList';
import CompanyForm from './pages/CompanyForm';
import CompanyDelete from './pages/CompanyDelete';
import DepartmentList from './pages/DepartmentList';
import DepartmentForm from './pages/DepartmentForm';
import DepartmentDelete from './pages/DepartmentDelete';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDelete from './pages/EmployeeDelete';
import Navbar from './layout/Navbar';
import ToastContainer from './components/ToastContainer';
import useAuthStore from './store/auth';

function PrivateRoute({ children }) {
  const token = useAuthStore(s => s.token);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const token = useAuthStore(s => s.token);
  return (
    <>
      <Navbar />
      <ToastContainer />
      <Suspense fallback={<div className="d-flex justify-content-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/companies" element={
            <PrivateRoute>
              <CompanyList />
            </PrivateRoute>
          } />
          <Route path="/companies/add" element={
            <PrivateRoute>
              <CompanyForm />
            </PrivateRoute>
          } />
          <Route path="/companies/:id/edit" element={
            <PrivateRoute>
              <CompanyForm />
            </PrivateRoute>
          } />
          <Route path="/companies/:id/delete" element={
            <PrivateRoute>
              <CompanyDelete />
            </PrivateRoute>
          } />
          <Route path="/departments" element={
            <PrivateRoute>
              <DepartmentList />
            </PrivateRoute>
          } />
          <Route path="/departments/add" element={
            <PrivateRoute>
              <DepartmentForm />
            </PrivateRoute>
          } />
          <Route path="/departments/:id/edit" element={
            <PrivateRoute>
              <DepartmentForm />
            </PrivateRoute>
          } />
          <Route path="/departments/:id/delete" element={
            <PrivateRoute>
              <DepartmentDelete />
            </PrivateRoute>
          } />
          <Route path="/employees" element={
            <PrivateRoute>
              <EmployeeList />
            </PrivateRoute>
          } />
          <Route path="/employees/add" element={
            <PrivateRoute>
              <EmployeeForm />
            </PrivateRoute>
          } />
          <Route path="/employees/:id/edit" element={
            <PrivateRoute>
              <EmployeeForm />
            </PrivateRoute>
          } />
          <Route path="/employees/:id/delete" element={
            <PrivateRoute>
              <EmployeeDelete />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to={token ? "/companies" : "/login"} replace />} />
          <Route path="*" element={
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
              <h1>404 Not Found</h1>
            </div>
          } />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
