import React, { useEffect } from 'react';
import GenericListPage from '../components/GenericListPage';
import DepartmentDetails from '../components/details/DepartmentDetails';
import useStore from '../store/store';
import { departmentSchema } from '../utils/formValidation';

const columns = [
  { field: 'name', label: 'Name' },
  { field: 'company_name', label: 'Company' },
  { field: 'num_employees', label: 'Employees' },
];

export default function DepartmentList() {
  const {
    allItems: companies,
    allItemsLoading: companiesLoading,
    fetchAllItems: fetchAllCompanies,
  } = useStore((state) => state.companies);

  useEffect(() => {
    fetchAllCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formCompanies = companies || [];
  const formFields = [
    {
      name: 'name',
      label: 'Department Name',
      type: 'text',
      placeholder: 'Enter department name',
    },
    {
      name: 'company',
      label: 'Company',
      type: 'select',
      options: formCompanies.map(company => ({
        value: String(company.id),
        label: company.name,
      })),
      placeholder: 'Select a company',
      // Do not set disabled here; handle in onFormDataTransform only
    },
  ];

  const initialFormData = { name: '', company: '' };

  const onFormDataTransform = (department) => {
    const hasEmployees = department.num_employees > 0;
    const transformedFields = formFields.map(field => {
      if (field.name === 'company' && hasEmployees) {
        return {
          ...field,
          disabled: true,
          helperText: `Cannot change company as this department has ${department.num_employees} employee(s)`
        };
      }
      return field;
    });

    return {
      id: department.id,
      name: department.name,
      company: String(department.company),
      num_employees: department.num_employees || 0,
      _formFields: transformedFields, // Pass modified fields
    };
  };



  if (companiesLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 200 }}>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading companies...</span>
        </div>
        <div className="text-muted">Loading companies...</div>
      </div>
    );
  }

  // If not loading and no companies, show form but disable select and show helperText
  let finalFormFields = formFields;
  if (!companiesLoading && formCompanies.length === 0) {
    finalFormFields = formFields.map(field =>
      field.name === 'company'
        ? { ...field, disabled: true, helperText: 'No companies found. Please add a company first.' }
        : field
    );
  }

  return (
    <GenericListPage
      title="Departments"
      entityName="Department"
      entityNamePlural="departments"
      columns={columns}
      formFields={finalFormFields}
      initialFormData={initialFormData}
      onFormDataTransform={onFormDataTransform}
      validationSchema={departmentSchema}
      renderViewDetails={(data) => <DepartmentDetails data={data} />}
    />
  );

}
