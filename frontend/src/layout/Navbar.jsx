import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
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

  return (
    <BSNavbar expand="lg" bg="body-tertiary" className="shadow-sm">
      <Container>
        <BSNavbar.Brand as={NavLink} to="/" className="fw-bold fs-3">
          <Building className="me-2" />
          Employee MS
        </BSNavbar.Brand>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          {token && (
            <Nav className="ms-auto align-items-lg-center">
              <Nav.Item className="mx-1">
                <Nav.Link as={NavLink} to="/companies" className={({ isActive }) => 
                  `px-3 py-2 rounded ${isActive ? "active fw-semibold" : ""}`
                }>
                  <Building className="me-2" />
                  Companies
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item className="mx-1">
                <Nav.Link as={NavLink} to="/departments" className={({ isActive }) => 
                  `px-3 py-2 rounded ${isActive ? "active fw-semibold" : ""}`
                }>
                  <Diagram3 className="me-2" />
                  Departments
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item className="mx-1">
                <Nav.Link as={NavLink} to="/employees" className={({ isActive }) => 
                  `px-3 py-2 rounded ${isActive ? "active fw-semibold" : ""}`
                }>
                  <People className="me-2" />
                  Employees
                </Nav.Link>
              </Nav.Item>
              
              <Nav.Item className="ms-lg-3 mt-2 mt-lg-0">
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  className="w-100"
                  onClick={handleLogout}
                >
                  <BoxArrowRight className="me-2" />
                  Logout
                </Button>
              </Nav.Item>
              
              <Nav.Item className="d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100"
                  onClick={toggleTheme}
                  title="Toggle Theme"
                >
                  {theme === "dark" ? <Sun /> : <Moon />}
                </Button>
              </Nav.Item>
            </Nav>
          )}
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}
