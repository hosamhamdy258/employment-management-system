import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import EntityForm from './EntityForm';


const EntityFormModal = ({
  show,
  onClose,
  onSubmit,
  title,
  fields,
  formData,
  loading,
  error,
  submitLabel,
  validationSchema,
}) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {formData && (
          <EntityForm
            fields={fields}
            formData={formData}
            onSubmit={(data) => onSubmit(data)}
            loading={loading}
            error={error}
            submitLabel={submitLabel}
            onCancel={onClose}
            validationSchema={validationSchema}
          />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EntityFormModal;
