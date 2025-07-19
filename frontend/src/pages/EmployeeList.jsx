import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useEmployeeStore from '../store/employee';
import { useToaster } from '../components/ToastContainer';

export default function EmployeeList() {
  const { employees, loading, error, fetchEmployees } = useEmployeeStore();
  const addToast = useToaster();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await fetch(`/api/employees/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      fetchEmployees();
      addToast({ message: 'Employee deleted successfully', type: 'success' });
    } catch {
      addToast({ message: 'Failed to delete employee', type: 'danger' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) { addToast({ message: error, type: 'danger' }); return <div className="alert alert-danger">{error}</div>; }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Employees</h2>
        <Link className="btn btn-success" to="/employees/add">Add Employee</Link>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.company_name || e.company}</td>
              <td>{e.department_name || e.department}</td>
              <td>{e.designation}</td>
              <td>{e.status}</td>
              <td>
                <Link className="btn btn-sm btn-primary me-2" to={`/employees/${e.id}/edit`}>Edit</Link>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
