import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import EmployeeTable from '../Components/EmployeeTable';


const renderWithStore = (employeesData: any[]) => {
  const store = configureStore({
    reducer: {
      employees: () => ({
        employees: employeesData,
      }),
    },
  });

  return render(
    <Provider store={store}>
      <EmployeeTable />
    </Provider>
  );
};

describe('EmployeeTable Component', () => {
  test('renders table headers', () => {
    renderWithStore([]);
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Designation/i)).toBeInTheDocument();
    expect(screen.getByText(/Salary/i)).toBeInTheDocument();
  });

  test('shows empty state message when no employees are available', () => {
    renderWithStore([]);
    expect(
      screen.getByText(/No employees found. Please add some employees/i)
    ).toBeInTheDocument();
  });

  test('renders employee rows when employees are provided', () => {
    const mockEmployees = [
      {
        id: 1,
        name: 'Test User',
        email: 'testuser@gmail.com',
        designation: 'Software Engineer',
        salary: 75000,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: 2,
        name: 'User Test',
        email: 'usertest@gmail.com',
        designation: 'Product Manager',
        salary: 95000,
        createdAt: '',
        updatedAt: '',
      },
    ];

    renderWithStore(mockEmployees);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('usertest@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Product Manager')).toBeInTheDocument();
    expect(screen.getByText('₹95,000')).toBeInTheDocument();
  });

  test('formats salary correctly', () => {
    const mockEmployees = [
      {
        id: 1,
        name: 'Raj',
        email: 'raj@gmail.com',
        designation: 'Designer',
        salary: 1234567,
        createdAt: '',
        updatedAt: '',
      },
    ];

    renderWithStore(mockEmployees);
    expect(screen.getByText('₹1,234,567')).toBeInTheDocument();
  });
});
