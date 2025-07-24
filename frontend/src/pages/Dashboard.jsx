import React, { useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import useDashboardStore from '../store/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, icon }) => (
  <div className="col-md-4 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex align-items-center">
        <div className={`fs-1 text-primary me-4`}>{icon}</div>
        <div>
          <h5 className="card-title text-muted">{title}</h5>
          <p className="card-text fs-2 fw-bold">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="col-lg-6 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-muted mb-3">{title}</h5>
        {children}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { data, loading, error, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

    const { stats, chart_data } = data;

  const employeesChartData = {
    labels: chart_data.employees_per_company.map(d => d.name),
    datasets: [
      {
        label: 'Number of Employees',
        data: chart_data.employees_per_company.map(d => d.employee_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const departmentsChartData = {
    labels: chart_data.departments_per_company.map(d => d.name),
    datasets: [
      {
        data: chart_data.departments_per_company.map(d => d.department_count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">
        <StatCard title="Total Companies" value={stats.companies} icon={<i className="bi bi-building"></i>} />
        <StatCard title="Total Departments" value={stats.departments} icon={<i className="bi bi-diagram-3"></i>} />
        <StatCard title="Total Employees" value={stats.employees} icon={<i className="bi bi-people"></i>} />
      </div>

      <div className="row mt-4">
        {chart_data.employees_per_company.length > 0 && (
          <ChartContainer title="Employees per Company">
            <Bar data={employeesChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </ChartContainer>
        )}
        {chart_data.departments_per_company.length > 0 && (
          <ChartContainer title="Departments per Company">
            <Pie data={departmentsChartData} options={{ responsive: true }} />
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
