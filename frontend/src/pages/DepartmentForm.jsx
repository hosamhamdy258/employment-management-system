import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useToaster } from '../components/ToastContainer';

export default function DepartmentForm() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/companies/').then(res => setCompanies(res.data));
    if (id) {
      api.get(`/departments/${id}/`).then(res => {
        setName(res.data.name);
        setCompany(res.data.company);
      }).catch(() => setError('Failed to load department'));
    }
  }, [id]);

  const addToast = useToaster();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (id) {
        await api.put(`/departments/${id}/`, { name, company });
        addToast({ message: 'Department updated successfully', type: 'success' });
      } else {
        await api.post('/departments/', { name, company });
        addToast({ message: 'Department created successfully', type: 'success' });
      }
      navigate('/departments');
    } catch {
      setError('Failed to save department');
      addToast({ message: 'Failed to save department', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2>{id ? 'Edit' : 'Add'} Department</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Company</label>
          <select className="form-select" value={company} onChange={e => setCompany(e.target.value)} required>
            <option value="">Select Company</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label>Department Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" disabled={loading} type="submit">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
