import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EmployeeDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/employees/${id}/`)
      .then(res => setEmployee(res.data))
      .catch(() => setError('Failed to load employee'));
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/employees/${id}/`);
      navigate('/employees');
    } catch {
      setError('Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!employee) return <div className="mt-4">Loading...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <h2>Delete Employee</h2>
      <p>Are you sure you want to delete <b>{employee.name}</b>?</p>
      <button className="btn btn-danger w-100 mb-2" onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      <button className="btn btn-secondary w-100" onClick={() => navigate('/employees')}>Cancel</button>
    </div>
  );
}
