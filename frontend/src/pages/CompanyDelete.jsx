import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function CompanyDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/companies/${id}/`)
      .then(res => setCompany(res.data))
      .catch(() => setError('Failed to load company'));
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/companies/${id}/`);
      navigate('/companies');
    } catch (err) {
      setError('Failed to delete company');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!company) return <div className="mt-4">Loading...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2>Delete Company</h2>
      <p>Are you sure you want to delete <b>{company.name}</b>?</p>
      <button className="btn btn-danger w-100 mb-2" onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      <button className="btn btn-secondary w-100" onClick={() => navigate('/companies')}>Cancel</button>
    </div>
  );
}
