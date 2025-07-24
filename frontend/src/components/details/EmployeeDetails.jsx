import React from 'react';
import useChoicesStore from '../../store/choices';
import { Card, ListGroup, Badge } from 'react-bootstrap';

const EmployeeDetails = ({ data }) => {
  const { statusChoices } = useChoicesStore();
  const statusLabel = statusChoices.find(c => c.value === data.status)?.label || data.status;

  const getStatusBadgeBg = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'ON_LEAVE':
        return 'warning';
      case 'TERMINATED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4" className="mb-0">{data.name}</Card.Title>
        <Card.Subtitle className="mt-1 text-muted">{data.email}</Card.Subtitle>
      </Card.Header>
      <Card.Body>
        <h5 className="card-title">Employment Details</h5>
        <ListGroup variant="flush" className="mb-4">
          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
            Company <span>{data.company_name}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
            Department <span>{data.department_name}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
            Designation <span>{data.designation}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
            Status <Badge bg={getStatusBadgeBg(data.status)}>{statusLabel}</Badge>
          </ListGroup.Item>
        </ListGroup>

        <h5 className="card-title">Personal Information</h5>
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
            Mobile <span>{data.mobile || 'N/A'}</span>
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
            Address <span>{data.address || 'N/A'}</span>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
      <Card.Footer className="text-muted d-flex justify-content-between align-items-center">
        {data.hired_on ? (
          <>
            <span>Hired on {new Date(data.hired_on).toLocaleDateString()}</span>
            <span><strong>Days Employed:</strong> {data.days_employed}</span>
          </>
        ) : (
          <span>Not Yet Hired</span>
        )}
      </Card.Footer>
    </Card>
  );
};

export default EmployeeDetails;

