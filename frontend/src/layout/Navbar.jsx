import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import useThemeStore from "../store/theme";
import { Building, Diagram3, People, BoxArrowRight, Sun, Moon } from 'react-bootstrap-icons';

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLinkClassName = ({ isActive }) =>
    `nav-link px-3 py-2 rounded ${isActive ? "active fw-semibold" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-3" to="/">
          <Building className="me-2" />
          Employee MS
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarEMS"
          aria-controls="navbarEMS"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarEMS">
          {token && (
            <>
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item mx-1">
                  <NavLink to="/companies" className={getLinkClassName}>
                    <Building className="me-2" />
                    Companies
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink to="/departments" className={getLinkClassName}>
                    <Diagram3 className="me-2" />
                    Departments
                  </NavLink>
                </li>
                <li className="nav-item mx-1">
                  <NavLink to="/employees" className={getLinkClassName}>
                    <People className="me-2" />
                    Employees
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-3">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleLogout}
                  >
                    <BoxArrowRight className="me-2" />
                    Logout
                  </button>
                </li>
                <li className="nav-item d-flex align-items-center ms-lg-3">
                  <button
                    onClick={toggleTheme}
                    className="btn btn-sm btn-outline-secondary"
                    title="Toggle Theme"
                  >
                    {theme === "dark" ? <Sun /> : <Moon />}
                  </button>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
