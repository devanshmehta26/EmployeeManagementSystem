import React from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';

interface Employee {
  id: number;
  name: string;
  email: string;
  designation: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
}

const EmployeeTable: React.FC = () => {
  const { employees } = useSelector((state: any) => state.employees);

  return (
    <Box sx={{ mt: 4 }}>
      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="employee table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#3b30c8' }}>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Designation</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((user: Employee) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                    '&:hover': { backgroundColor: '#eef2ff' },
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.designation}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#3b30c8' }}>
                    ₹{user.salary.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="textSecondary" fontStyle="italic" py={2}>
                    No employees found. Please add some employees to view them here.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeTable;
