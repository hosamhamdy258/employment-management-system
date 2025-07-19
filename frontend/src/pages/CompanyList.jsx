import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useToaster } from '../components/ToastContainer';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/companies/')
      .then(res => setCompanies(res.data))
      .catch(() => setError('Failed to load companies'))
      .finally(() => setLoading(false));
  }, []);

  const navigate = useNavigate();
  const addToast = useToaster();

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await api.delete(`/companies/${id}/`);
      setCompanies(companies.filter(c => c.id !== id));
      addToast({ message: 'Company deleted successfully', type: 'success' });
    } catch {
      addToast({ message: 'Failed to delete company', type: 'danger' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) { addToast({ message: error, type: 'danger' }); return <div className="alert alert-danger">{error}</div>; }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Companies</h2>
        <Link className="btn btn-success" to="/companies/add">Add Company</Link>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Departments</th>
            <th>Employees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.num_departments}</td>
              <td>{c.num_employees}</td>
              <td>
                <Link className="btn btn-sm btn-primary me-2" to={`/companies/${c.id}/edit`}>Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
