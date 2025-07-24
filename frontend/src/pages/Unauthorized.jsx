import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="display-1 fw-bold text-danger">403</h1>
              <h2 className="fw-bold">Access Forbidden</h2>
              <p className="lead text-muted">
                Sorry, you do not have the necessary permissions to view this page.
              </p>
              <Link to="/dashboard" className="btn btn-primary mt-3">
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
