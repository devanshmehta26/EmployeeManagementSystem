import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../Pages/Dashboard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

jest.mock('../utils/api');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

const mockStore = configureStore([]);

describe('Dashboard Component', () => {
  let store: any;

  const mockUser = { name: 'Test User' };
  const mockEmployees = [
    { id: 1, name: 'Aman', email: 'aman@gmail.com', designation: 'Developer', salary: 1000, createdAt: '', updatedAt: '' },
    { id: 2, name: 'Rahul', email: 'rahul@gmail.com', designation: 'QA', salary: 900, createdAt: '', updatedAt: '' },
  ];

  beforeEach(() => {
    store = mockStore({
      auth: { user: mockUser },
      employees: { totalPages: 3, employees: mockEmployees },
    });

    jest.clearAllMocks();

    (api.fetchProfile as jest.Mock).mockResolvedValue({ data: mockUser });
    (api.fetchEmployees as jest.Mock).mockResolvedValue({
      data: { employees: mockEmployees, noOfPages: 3 },
    });
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

  test('renders greeting with user name', () => {
    renderComponent();
    expect(screen.getByText(/Hi Test User/i)).toBeInTheDocument();
  });

  test('displays employees heading', () => {
    renderComponent();
    expect(screen.getByText(/These are the list of Employees/i)).toBeInTheDocument();
  });

  test('fetches user profile on mount and dispatches setUser', async () => {
    renderComponent();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'auth/setUser' }),
        ])
      );
    });
  });

  test('search input updates searchTerm and clears correctly', () => {
    renderComponent();

    const input = screen.getByPlaceholderText(/Search by name or email/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(input).toHaveValue('Alice');

    const clearBtn = screen.getByTestId('clear-search-button');

    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(input).toHaveValue('');
  });

  test('fetches employees and dispatches actions', async () => {
    renderComponent();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'employees/setEmployees' }),
          expect.objectContaining({ type: 'employees/setTotalPages' }),
        ])
      );
    });
  });

  test('pagination changes current page and triggers fetch', async () => {
    renderComponent();

    const pageTwo = screen.getByText('2');
    fireEvent.click(pageTwo);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'employees/setEmployees' }),
          expect.objectContaining({ type: 'employees/setTotalPages' }),
        ])
      );
    });
  });

  test('shows error toast on profile fetch failure', async () => {
    (api.fetchProfile as jest.Mock).mockRejectedValue(new Error('Failed'));

    renderComponent();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load user profile');
    });
  });

  test('logs error on employees fetch failure', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (api.fetchEmployees as jest.Mock).mockRejectedValue(new Error('Failed'));

    renderComponent();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching all the employees:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
