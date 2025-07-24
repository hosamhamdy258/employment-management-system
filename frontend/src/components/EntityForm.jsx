import React from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Generic entity form using Zod for validation
 * Props:
 * - formData: object (field values)
 * - onFormChange: function(name, value)
 * - fields: array of { name, label, type, required, ... }
 * - onSubmit: function()
 * - onCancel: function()
 * - loading: bool
 * - error: string
 * - submitLabel: string
 * - validationSchema: Zod schema (optional)
 */
const EntityForm = ({
  fields,
  onSubmit,
  onCancel,
  loading,
  error,
  submitLabel,
  validationSchema,
  formData
}) => {
  // Defensive: normalize error prop so only string/object is passed to Alert
  let normalizedError = error;
  if (Array.isArray(error)) {
    normalizedError = error.join(' ');
  }
  // If error is an object with only non_field_errors, flatten to string if possible
  if (
    error &&
    typeof error === 'object' &&
    Object.keys(error).length === 1 &&
    error.non_field_errors
  ) {
    normalizedError = {
      non_field_errors: Array.isArray(error.non_field_errors)
        ? error.non_field_errors.join(' ')
        : String(error.non_field_errors)
    };
  }

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: validationSchema ? zodResolver(validationSchema) : undefined,
    defaultValues: formData || {},
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  // --- Determine form-level error message ---
  let formLevelError = null;
  if (normalizedError) {
    if (typeof normalizedError === 'string') {
      formLevelError = normalizedError;
    } else if (normalizedError.non_field_errors) {
      formLevelError = Array.isArray(normalizedError.non_field_errors)
        ? normalizedError.non_field_errors.join(' ')
        : String(normalizedError.non_field_errors);
    }
  }

  // --- Restore department filtering by selected company ---
  let filteredFields = fields;
  const departmentFieldIndex = fields.findIndex(f => f.name === 'department');
  const companyFieldIndex = fields.findIndex(f => f.name === 'company');
  if (departmentFieldIndex !== -1 && companyFieldIndex !== -1) {
    const selectedCompany = watch('company');
    filteredFields = fields.map((field, idx) => {
      if (idx === departmentFieldIndex) {
        const allOptions = field.options || [];
        // Only filter if company is selected
        const filteredOptions = selectedCompany
          ? allOptions.filter(opt => {
              // opt.value is department.id, need department.company for filtering
              // We need to find the department object for this option
              return String(opt.company) === String(selectedCompany);
            })
          : []; // Show NO departments if no company is selected
        return {
          ...field,
          options: filteredOptions,
        };
      }
      return field;
    });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate className="p-1">
          {filteredFields.map((field) => {
            // Determine error message: prefer react-hook-form error, then backend error
            let fieldError = errors[field.name]?.message;
            if (!fieldError && normalizedError && typeof normalizedError === 'object' && normalizedError[field.name]) {
              fieldError = Array.isArray(normalizedError[field.name]) ? normalizedError[field.name][0] : normalizedError[field.name];
            }
            return (
              <Form.Group className="mb-3" controlId={field.name} key={field.name}>
                <Form.Label>
                  {field.label}
                  {field.required && <span className="text-danger ms-1">*</span>}
                </Form.Label>
                {field.type === 'select' ? (
                  <Form.Select
                    {...register(field.name)}
                    isInvalid={!!fieldError}
                    disabled={loading || field.disabled}
                    defaultValue={formData?.[field.name] || ''}
                  >
                    <option value="">{field.placeholder || 'Select...'}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field.type || 'text'}
                    {...register(field.name)}
                    isInvalid={!!fieldError}
                    disabled={loading || field.disabled}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={formData?.[field.name] || ''}
                  />
                )}
                <Form.Control.Feedback type="invalid">
                  {fieldError}
                </Form.Control.Feedback>
                {field.helperText && (
                  <Form.Text className="text-muted">
                    {field.helperText}
                  </Form.Text>
                )}
              </Form.Group>
            );
          })}

          {/* Show form-level error if not field-specific */}
          {formLevelError && (
            <Alert variant="danger" className="mt-2">
              {formLevelError}
            </Alert>
          )}
          <div className="d-flex justify-content-end mt-4">
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} className="me-2" disabled={loading}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" size="sm" role="status" aria-hidden="true" className="me-2" />
                  <span>Saving...</span>
                </>
              ) : submitLabel}
            </Button>
          </div>
        </Form>
  );
};

export default EntityForm;
