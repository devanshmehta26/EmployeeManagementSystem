import axios from "axios";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { api } from "../utils/api";
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
import { useFormHandler } from "../Hooks/useFormHandler";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {
    values: form,
    handleChange,
    handleSubmit,
  } = useFormHandler({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (form) => {
      if (!form.email || !form.password) {
        return "Please enter both email and password.";
      }
      if (!/\S+@\S+\.\S+/.test(form.email)) {
        return "Please enter a valid email address.";
      }
      return null;
    },
    onSubmit: async (form) => {
      try {
        await api.login(form);
        navigate("/dashboard");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    },
  });

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
          onSubmit={async (e) => {
            try {
              await handleSubmit(e);
            } catch (msg) {
              if (typeof msg === "string") toast.error(msg);
            }
          }}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            required
            fullWidth
            value={form.email}
            onChange={handleChange}
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
            name="password"
            type="password"
            variant="outlined"
            required
            fullWidth
            value={form.password}
            onChange={handleChange}
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
