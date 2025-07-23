import React from 'react';
import GenericListPage from '../components/GenericListPage';

import { companySchema } from '../utils/formValidation';

const columns = [
  { field: 'name', label: 'Name' },
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
    />
  );
}
