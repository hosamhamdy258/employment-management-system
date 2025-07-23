import React, { useState } from 'react';
import useAuthStore from '../store/auth';
import { Building, ExclamationTriangleFill, Envelope, Lock, BoxArrowInRight } from 'react-bootstrap-icons';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/api/auth/login/', { email, password });
      login(res.data.user, res.data.access,res.data.refresh);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      
      // Extract error message from server response
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response?.data) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.non_field_errors) {
          errorMessage = err.response.data.non_field_errors[0];
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-body-tertiary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4">
            <div className="card shadow-lg">
              <div className="card-body p-4 p-sm-5">
                <div className="text-center mb-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3 p-4">
                    <Building className="text-white" style={{fontSize: '2rem'}} />
                  </div>
                  <h2 className="fw-bold mb-1">Welcome Back</h2>
                  <p className="text-muted">Sign in to Employee Management System</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <ExclamationTriangleFill className="me-2" />
                    <div>{error}</div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <Envelope className="me-2" />
                      Email Address
                    </label>
                    <input 
                      className="form-control form-control-lg" 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="Enter your email"
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <Lock className="me-2" />
                      Password
                    </label>
                    <input 
                      className="form-control form-control-lg" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Enter your password"
                      required 
                    />
                  </div>
                  
                  <button 
                    className="btn btn-primary w-100 btn-lg" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <BoxArrowInRight className="me-2" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>
                
                <div className="text-center mt-4">
                  <small className="text-muted">
                    Secure login powered by Employee MS
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
