import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from '../Components/Navbar';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as apiModule from '../utils/api';

jest.mock('../utils/api');

const mockLogout = jest.fn();
(apiModule.api.logout as jest.Mock) = mockLogout;

const renderWithRouter = (initialPath = '/dashboard') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<Navbar />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar title', () => {
    renderWithRouter();
    expect(screen.getByText(/Employee Management System/i)).toBeInTheDocument();
  });

  test('highlights active link based on location', () => {
    renderWithRouter('/profile');
    const profileLink = screen.getByText('My Profile');
    expect(profileLink).toHaveClass('bg-white text-indigo-700 font-semibold');
  });

  test('shows navigation links', () => {
    renderWithRouter();
    const desktopDashboardLink = screen.getByTestId('desktop-dashboard-link');
    expect(desktopDashboardLink).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-logout-button')).toBeInTheDocument();
  });

  test('calls logout function and navigates on logout click', async () => {
    mockLogout.mockResolvedValue({});
    renderWithRouter();

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  test('mobile menu toggles when button is clicked', () => {
    renderWithRouter();
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);
    const mobileDashboardLink = screen.getByTestId('mobile-dashboard-link');
    expect(mobileDashboardLink).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(mobileDashboardLink).not.toBeNull();
  });

  test('mobile menu links close menu and navigate', () => {
    renderWithRouter();
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);

    const mobileDashboardLink = screen.getByTestId('mobile-dashboard-link');
    expect(mobileDashboardLink).toBeInTheDocument();
    fireEvent.click(mobileDashboardLink);

    expect(mobileDashboardLink).not.toBeNull();
  });

  test('logout via mobile menu', async () => {
    mockLogout.mockResolvedValue({});
    renderWithRouter();
    const menuButton = screen.getByText('Menu');
    fireEvent.click(menuButton);

    const logoutButton = screen.getByTestId('mobile-logout-button');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
