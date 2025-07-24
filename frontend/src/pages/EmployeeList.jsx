import React, { useEffect, useMemo } from 'react';
import GenericListPage from '../components/GenericListPage';
import EmployeeDetails from '../components/details/EmployeeDetails';
import useStore from '../store/store';
import useChoicesStore from '../store/choices';
import { employeeSchema } from '../utils/formValidation';

const columns = [
  { field: 'name', label: 'Name' },
  { field: 'email', label: 'Email' },
  { field: 'company_name', label: 'Company' },
  { field: 'department_name', label: 'Department' },
  { field: 'designation', label: 'Designation' },
  { field: 'status', label: 'Status' },
];

export default function EmployeeList() {
  const { allItems: companies, fetchAllItems: fetchAllCompanies } = useStore((state) => state.companies);
  const { allItems: departments, fetchAllItems: fetchAllDepartments } = useStore((state) => state.departments);
  const choicesStore = useChoicesStore();

  useEffect(() => {
    fetchAllCompanies();
    fetchAllDepartments();
    choicesStore.fetchStatusChoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formFields = useMemo(() => {
    const statusChoices = choicesStore.statusChoices || [];
    
    return [
      {
        name: 'name',
        label: 'Employee Name',
        type: 'text',
        required: true,
        placeholder: 'Enter employee name',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'Enter email address',
      },
      {
        name: 'mobile',
        label: 'Mobile Number',
        type: 'text',
        required: false,
        placeholder: 'Enter mobile number',
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: false,
        placeholder: 'Enter address',
      },
      {
        name: 'company',
        label: 'Company',
        type: 'select',
        required: true,
        options: companies.map(company => ({
          value: String(company.id),
          label: company.name,
        })),
        placeholder: 'Select a company',
      },
      {
        name: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        options: departments.map(department => ({
          value: String(department.id),
          label: department.name,
          company: String(department.company),
        })),
        placeholder: 'Select a department',
      },
      {
        name: 'designation',
        label: 'Designation',
        type: 'text',
        required: true,
        placeholder: 'Enter designation',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: statusChoices.map(choice => ({
          value: choice.value,
          label: choice.label,
        })),
        placeholder: 'Select status',
      },
    ];
  }, [companies, departments, choicesStore.statusChoices]);

  const initialFormData = {
    name: '',
    email: '',
    mobile: '',
    address: '',
    company: '',
    department: '',
    designation: '',
    status: 'APPLICATION_RECEIVED',
  };


  // Transform employee data for display (convert status values to labels)
  const transformEmployeeDataForDisplay = useMemo(() => {
    const statusChoices = choicesStore.statusChoices || [];
    const statusLabels = statusChoices.reduce((acc, choice) => {
      acc[choice.value] = choice.label;
      return acc;
    }, {});

    return (employees) => {
      return employees.map(employee => ({
        ...employee,
        status: statusLabels[employee.status] || employee.status,
      }));
    };
  }, [choicesStore.statusChoices]);

  const onFormDataTransform = (employee) => {
    // Validate that the department belongs to the selected company
    const employeeCompanyId = employee.company ? String(employee.company) : '';
    const employeeDepartmentId = employee.department ? String(employee.department) : '';
    
    // Check if the department belongs to the company
    const allDepartments = departments || [];
    const departmentBelongsToCompany = employeeCompanyId && employeeDepartmentId && 
      allDepartments.some(d => String(d.id) === employeeDepartmentId && String(d.company) === employeeCompanyId);
    
    return {
      ...employee,
      company: employeeCompanyId,
      department: departmentBelongsToCompany ? employeeDepartmentId : '',
      status: employee.status || 'APPLICATION_RECEIVED',
    };
  };

  return (
    <GenericListPage
      title="Employees"
      entityName="Employee"
      entityNamePlural="employees"
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      onFormDataTransform={onFormDataTransform}
      onDataTransformForDisplay={transformEmployeeDataForDisplay}
      validationSchema={employeeSchema}
      renderViewDetails={(data) => <EmployeeDetails data={data} />}
    />
  );
}
