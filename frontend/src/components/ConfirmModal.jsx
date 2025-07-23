import React from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import {
  ExclamationCircleFill,
  Trash3Fill,
  ExclamationTriangleFill,
  QuestionCircleFill,
} from 'react-bootstrap-icons';

/**
 * Generic confirmation modal/dialog for delete and other confirmations.
 * Props:
 *   show: boolean (visible or not)
 *   title: string
 *   body: string or React node
 *   confirmLabel: string (e.g., 'Delete')
 *   confirmVariant: string (Bootstrap variant, e.g., 'danger')
 *   onConfirm: function()
 *   onCancel: function()
 *   loading: boolean
 *   error: string
 *   cancelLabel: string (e.g., 'Cancel')
 */
export default function ConfirmModal({
  show,
  title = 'Confirm',
  body = 'Are you sure?',
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
  error = '',
  cancelLabel = 'Cancel',
}) {
  if (!show) return null;

  const Icon = () => {
    if (error) return <ExclamationCircleFill className="me-2 text-danger" />;
    switch (confirmVariant) {
      case 'danger':
        return <Trash3Fill className="me-2 text-danger" />;
      case 'warning':
        return <ExclamationTriangleFill className="me-2 text-warning" />;
      default:
        return <QuestionCircleFill className="me-2 text-primary" />;
    }
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <Icon />
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {body}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />} {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
