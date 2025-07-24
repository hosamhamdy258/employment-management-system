import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const DepartmentDetails = ({ data }) => (
  <Card>
    <Card.Header>
      <Card.Title as="h4" className="mb-0">{data.name}</Card.Title>
      <Card.Subtitle className="mt-1 text-muted">Company: {data.company_name}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <ListGroup variant="flush" className="mb-3">
        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
          Total Employees
          <Badge bg="primary" pill>
            {data.num_employees}
          </Badge>
        </ListGroup.Item>
      </ListGroup>

      <h5 className="mt-4">Employee List</h5>
      {data.employees && data.employees.length > 0 ? (
        <ListGroup variant="flush">
          {data.employees.map(emp => (
            <ListGroup.Item key={emp.id} className="ps-0">
              {emp.name} <small className="text-muted">
                {emp.hired_on ? `(Hired: ${new Date(emp.hired_on).toLocaleDateString()})` : '(Not Yet Hired)'}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted mb-0">No employees in this department.</p>
      )}
    </Card.Body>
  </Card>
);

export default DepartmentDetails;

