import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDepartmentStore from '../store/department';
import { useToaster } from '../components/ToastContainer';

export default function DepartmentList() {
  const { departments, loading, error, fetchDepartments } = useDepartmentStore();
  const addToast = useToaster();

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await fetch(`/api/departments/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      fetchDepartments();
      addToast({ message: 'Department deleted successfully', type: 'success' });
    } catch {
      addToast({ message: 'Failed to delete department', type: 'danger' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) { addToast({ message: error, type: 'danger' }); return <div className="alert alert-danger">{error}</div>; }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Departments</h2>
        <Link className="btn btn-success" to="/departments/add">Add Department</Link>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.company_name || d.company}</td>
              <td>
                <Link className="btn btn-sm btn-primary me-2" to={`/departments/${d.id}/edit`}>Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
