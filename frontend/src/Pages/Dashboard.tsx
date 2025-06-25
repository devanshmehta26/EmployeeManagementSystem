import { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeTable from '../Components/EmployeeTable';
import { useDispatch, useSelector } from 'react-redux';
import {  toast } from 'react-toastify';
import type { RootState } from '../Store/Store';
import { setEmployees, setTotalPages } from '../Slice/EmployeeSlice';
import { setUser, clearUser } from '../Slice/AuthSlice';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Pagination,
  Stack
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

interface EmployeesResponse {
  employees: Employee[];
  totalEmployees: number;
  noOfPages: number;
  page: number;
  limit: number; 
}

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const { totalPages } = useSelector((state: any) => state.employees);

 useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/api/employees/profile',
          { withCredentials: true }
        );
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load user profile');
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      const fetchEmployees = async () => {
        try {
          const response = await axios.get<EmployeesResponse>(
            `http://localhost:4000/api/employees?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
             {withCredentials: true}
          );
          dispatch(setEmployees(response.data.employees));
          dispatch(setTotalPages(response.data.noOfPages));
        } catch (error) {
          console.error('Error fetching all the employees:', error);
        }
      };
      fetchEmployees();
    }, 100);
    return () => clearTimeout(delay);
  }, [currentPage, limit, searchTerm]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '80vh' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            mb: 3
          }}
        >
          <Typography variant="h5" fontWeight={600} color='#3b30c8'>
           Hi {user?.name} !
          </Typography>
         
          <TextField
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            placeholder="Search by name or email..."
            size="small"
            sx={{ width: { xs: '100%', sm: 300 } }}
            InputProps={{
              endAdornment: searchTerm && (
                <IconButton onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              )
            }}
          />
        </Box>
          
          <Typography
              variant="h5"
              fontWeight={600}
              color="#3b30c8"
              sx={{ textAlign: 'center' }}
            >
              These are the list of Employees
          </Typography>


        <EmployeeTable />

        <Stack spacing={2} mt={4} alignItems="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            shape="rounded"
             sx={{
              '& .MuiPaginationItem-root': {
                color: '#3b30c8',        
                borderColor: '#3b30c8',   
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: '#3b30c8', 
                color: '#fff',             
                '&:hover': {
                  backgroundColor: '#3b30c8',
                },
              }}}
          />
        </Stack>
    </Box>
  );
};

export default Dashboard;
