import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useToaster } from '../components/ToastContainer';

export default function EmployeeForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    department: '',
    designation: '',
    status: '',
  });
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/companies/').then(res => setCompanies(res.data));
    if (id) {
      api.get(`/employees/${id}/`).then(res => {
        setForm(res.data);
        api.get(`/departments/?company=${res.data.company}`).then(depRes => setDepartments(depRes.data));
      }).catch(() => setError('Failed to load employee'));
    }
  }, [id]);

  useEffect(() => {
    if (form.company) {
      api.get(`/departments/?company=${form.company}`).then(res => setDepartments(res.data));
    } else {
      setDepartments([]);
    }
  }, [form.company]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addToast = useToaster();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (id) {
        await api.put(`/employees/${id}/`, form);
        addToast({ message: 'Employee updated successfully', type: 'success' });
      } else {
        await api.post('/employees/', form);
        addToast({ message: 'Employee created successfully', type: 'success' });
      }
      navigate('/employees');
    } catch {
      setError('Failed to save employee');
      addToast({ message: 'Failed to save employee', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <h2>{id ? 'Edit' : 'Add'} Employee</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Company</label>
          <select className="form-select" name="company" value={form.company} onChange={handleChange} required>
            <option value="">Select Company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Department</label>
          <select className="form-select" name="department" value={form.department} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Designation</label>
          <input className="form-control" name="designation" value={form.designation} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Status</label>
          <input className="form-control" name="status" value={form.status} onChange={handleChange} required />
        </div>
        <button className="btn btn-primary w-100" disabled={loading} type="submit">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
