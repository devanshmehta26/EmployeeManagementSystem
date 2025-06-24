import axios from "axios";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  InputAdornment,
  Paper,
  useTheme,
} from "@mui/material";

import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/employees/login', {
        email,
        password,
      }, {
        withCredentials: true
      });
      console.log('Login successful:', response.data);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
        maxWidth: 900,
        mx: 'auto',
        mt: 6,
        bgcolor: '#fff',
      }}
    >
      <ToastContainer />
      <Box
        sx={{
          flex: 1,
          backgroundColor: '#3b30c8',
          color: '#fff',
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minWidth: 280,
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Employee
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
         Management System
        </Typography>
      </Box>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: 0,
        }}
      >
        <Typography variant="h5" mb={3} fontWeight="600" align="center">
          Login to Your Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#3b30c8',
              color: '#fff',
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 2,
              transition: 'background-color 0.3s ease',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Log In
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          mt={4}
        >
          Don’t have an account?
          <Link component={RouterLink} to="/register" underline="hover">
          Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
