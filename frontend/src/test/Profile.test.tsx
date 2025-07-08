import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../Pages/Profile';
import { BrowserRouter } from 'react-router-dom';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../utils/api', () => ({
  api: {
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

import * as redux from 'react-redux';
import { api } from '../utils/api';
import { toast } from 'react-toastify';

describe('Profile Component', () => {
  const mockUser = {
    name: 'Test User',
    email: 'testuser@gmail.com',
    designation: 'Developer',
    salary: 50000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders no user message when user is null', () => {
    (redux.useSelector as unknown as jest.Mock).mockReturnValue(null);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText(/No user data found/i)).toBeInTheDocument();
  });

  test('renders user info correctly', () => {
    (redux.useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(`Email:`)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(`Designation:`)).toBeInTheDocument();
    expect(screen.getByText(mockUser.designation)).toBeInTheDocument();
    expect(screen.getByText(/Salary:/)).toBeInTheDocument();
    expect(screen.getByText(/₹50,000/)).toBeInTheDocument();
  });

  test('opens and closes edit modal', () => {
    (redux.useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByText(/Edit Profile/i)).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    waitFor(() => {
      expect(screen.queryByText(/Edit Profile/i)).not.toBeInTheDocument();
    });
  });

  test('validates form and shows error toast on invalid submit', async () => {
    (redux.useSelector as unknown as jest.Mock).mockReturnValue(mockUser);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please enter your name.');
    });
  });

  test('updates profile successfully', async () => {
    (redux.useSelector as unknown  as jest.Mock).mockReturnValue(mockUser);
    (api.updateUser as jest.Mock).mockResolvedValue({
      data: { employee: { ...mockUser, name: 'testing user' } },
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'testing user' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(api.updateUser).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'testing user' })
      );
      expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('handles delete user', async () => {
    (redux.useSelector as unknown  as jest.Mock).mockReturnValue(mockUser);
    (api.deleteUser as jest.Mock).mockResolvedValue({});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(api.deleteUser).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled(); 
      expect(toast.success).toHaveBeenCalledWith('User deleted');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
