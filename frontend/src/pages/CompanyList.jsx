import React from 'react';
import GenericListPage from '../components/GenericListPage';
import CompanyDetails from '../components/details/CompanyDetails';
import { companySchema } from '../utils/formValidation';

const columns = [
  { field: 'name', label: 'Name' },
  { field: 'num_departments', label: 'Departments' },
  { field: 'num_employees', label: 'Employees' },
];

const formFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter company name',
  }
];

const initialFormData = { name: '' };

export default function CompanyList() {
  return (
    <GenericListPage
      title="Companies"
      entityName="Company"
      entityNamePlural="companies"
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      validationSchema={companySchema}
      renderViewDetails={(data) => <CompanyDetails data={data} />}
      addRoles={['ADMIN']}
      editRoles={['ADMIN']}
      deleteRoles={['ADMIN']}
    />
  );
}
