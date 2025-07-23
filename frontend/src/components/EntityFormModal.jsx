import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import EntityForm from './EntityForm';
import useThemeStore from '../store/theme';

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
  const { theme } = useThemeStore();

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton className={theme.modalHeader}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={theme.modalContent}>
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
