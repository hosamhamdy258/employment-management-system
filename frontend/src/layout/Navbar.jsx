import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth';

export default function Navbar() {
  const logout = useAuthStore(s => s.logout);
  const token = useAuthStore(s => s.token);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">EMS</Link>
        {token && (
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/companies">Companies</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/departments">Departments</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/employees">Employees</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
