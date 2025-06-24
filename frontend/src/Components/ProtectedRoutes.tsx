import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {

  const [isAuth, setIsAuth] = useState<boolean | null>(true)
  const navigate = useNavigate()
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          'http://localhost:4000/api/employees/user',
          {},
          {
            withCredentials: true,
          }
        );
        setIsAuth(true)
        console.log('Employee data:', response.data, isAuth);
      } catch {
        setIsAuth(false)
      }
    }
    checkAuth();
  }, [navigate])
  
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
};

export default ProtectedRoute;