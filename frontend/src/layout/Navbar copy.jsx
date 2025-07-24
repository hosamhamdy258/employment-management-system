import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import useThemeStore from "../store/theme";
import { Building, Diagram3, People, BoxArrowRight, Sun, Moon, XLg, List } from 'react-bootstrap-icons';

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const token = useAuthStore((s) => s.token);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const getLinkClassName = ({ isActive }) =>
    `nav-link px-3 py-2 rounded ${isActive ? "active fw-semibold" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-3" to="/" onClick={closeMenu}>
          <Building className="me-2" />
          Employee MS
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          {isOpen ? <XLg /> : <List />}
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarEMS">
          {token && (
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item mx-1">
                <NavLink 
                  to="/companies" 
                  className={getLinkClassName}
                  onClick={closeMenu}
                >
                  <Building className="me-2" />
                  Companies
                </NavLink>
              </li>
              <li className="nav-item mx-1">
                <NavLink 
                  to="/departments" 
                  className={getLinkClassName}
                  onClick={closeMenu}
                >
                  <Diagram3 className="me-2" />
                  Departments
                </NavLink>
              </li>
              <li className="nav-item mx-1">
                <NavLink 
                  to="/employees" 
                  className={getLinkClassName}
                  onClick={closeMenu}
                >
                  <People className="me-2" />
                  Employees
                </NavLink>
              </li>
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <button
                  className="btn btn-sm btn-outline-secondary w-100"
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                >
                  <BoxArrowRight className="me-2" />
                  Logout
                </button>
              </li>
              <li className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
                <button
                  onClick={() => {
                    toggleTheme();
                    closeMenu();
                  }}
                  className="btn btn-sm btn-outline-secondary w-100"
                  title="Toggle Theme"
                >
                  {theme === "dark" ? <Sun /> : <Moon />}
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
