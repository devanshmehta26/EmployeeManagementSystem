import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/login');
    } catch (error: any) {
      if (error.response) {
        console.error('Error while logging out:', error.response.data);
      } else {
        console.error(error.message);
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        <div className="text-2xl font-semibold tracking-wide">
          Employee Management System
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard"
            className={`transition duration-150 ease-in-out px-3 py-2 rounded-md text-sm font-medium 
              ${location.pathname === '/dashboard' ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600 hover:text-white'}`}
          >
            Dashboard
          </Link>

          <Link
            to="/profile"
            className={`transition duration-150 ease-in-out px-3 py-2 rounded-md text-sm font-medium 
              ${location.pathname === '/profile' ? 'bg-white text-indigo-700 font-semibold' : 'hover:bg-indigo-600 hover:text-white'}`}
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="hover:bg-red-600 transition duration-150 px-4 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-white text-indigo-700 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm"
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsMenuOpen(false)}
            className="block bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm"
          >
            My Profile
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="w-full  hover:bg-red-600 text-left px-4 py-2 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



