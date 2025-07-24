import React from 'react';
import { Card, ListGroup, Badge, Accordion } from 'react-bootstrap';

const CompanyDetails = ({ data }) => (
  <Card>
    <Card.Header as="h4">{data.name}</Card.Header>
    <Card.Body>
      <ListGroup variant="flush" className="mb-4">
        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
          Total Departments
          <Badge bg="primary" pill>
            {data.num_departments}
          </Badge>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
          Total Employees
          <Badge bg="info" pill>
            {data.num_employees}
          </Badge>
        </ListGroup.Item>
      </ListGroup>

      <h5>Departments</h5>
      {data.departments && data.departments.length > 0 ? (
        <Accordion flush>
          {data.departments.map((dept, index) => (
            <Accordion.Item eventKey={String(index)} key={dept.id}>
              <Accordion.Header className="d-flex justify-content-between align-items-center">
                <span className="flex-grow-1">{dept.name}</span>
                <Badge bg="secondary me-2" pill>
                  {dept.num_employees} {dept.num_employees === 1 ? 'Employee' : 'Employees'}
                </Badge>
              </Accordion.Header>
              <Accordion.Body>
                {dept.employees && dept.employees.length > 0 ? (
                  <ListGroup variant="flush">
                    {dept.employees.map(emp => (
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
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        <p className="text-muted">This company has no departments.</p>
      )}
    </Card.Body>
  </Card>
);

export default CompanyDetails;

