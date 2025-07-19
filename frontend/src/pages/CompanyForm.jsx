import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useToaster } from '../components/ToastContainer';

export default function CompanyForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const addToast = useToaster();

  useEffect(() => {
    if (id) {
      api.get(`/companies/${id}/`)
        .then(res => setName(res.data.name))
        .catch(() => setError('Failed to load company'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (id) {
        await api.put(`/companies/${id}/`, { name });
        addToast({ message: 'Company updated successfully', type: 'success' });
      } else {
        await api.post('/companies/', { name });
        addToast({ message: 'Company created successfully', type: 'success' });
      }
      navigate('/companies');
    } catch (err) {
      setError('Failed to save company');
      addToast({ message: 'Failed to save company', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2>{id ? 'Edit' : 'Add'} Company</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Company Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100" disabled={loading} type="submit">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
