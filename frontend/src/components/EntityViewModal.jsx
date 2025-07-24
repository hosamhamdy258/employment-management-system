import React from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';

const EntityViewModal = ({ show, onHide, entityName, item, loading, error, renderDetails }) => {

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{entityName} Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        {item && !loading && !error && renderDetails(item)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EntityViewModal;
