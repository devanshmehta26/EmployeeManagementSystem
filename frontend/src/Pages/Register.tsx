import React, { useState } from "react";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../utils/api";
import { useFormHandler } from "../Hooks/useFormHandler";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  useTheme,
} from "@mui/material";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const {values: form, handleChange, handleSubmit} = useFormHandler({
    initialValues: {
      name: "",
      email: "",
      password: "",
      designation: "",
      salary: "",
    },

  validate: (form) => {

    if (!form.name || !form.email || !form.password || !form.designation || !form.salary) {
      toast.error("Please fill out all the fields.");
      return "Please fill out all the fields.";
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return  "Password must be at least 8 characters.";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Please enter a valid email.");
      return "Please enter a valid email.";
    }

    if (Number(form.salary) <= 0) {
      toast.error("Salary must be greater than 0.");
      return  "Salary must be greater than 0.";
    }
    return null;
  },
  onSubmit: async (form) => {

    try { 
      const payload = {
        ...form,
        salary: Number(form.salary),
      };
      const response = await api.register(payload);
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
    }
  });

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <ToastContainer />
      <Paper
        elevation={3}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 5,
          borderRadius: 3,
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Create Account
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={async (e) => {
            try {
              await handleSubmit(e);
            } catch (msg) {
              if (typeof msg === "string") toast.error(msg);
            }
          }}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            value={form.name}
            onChange={handleChange}
            required
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={form.email}
            onChange={handleChange}
            required
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={form.password}
            onChange={handleChange}
            required
            helperText="Minimum 8 characters"
          />

          <TextField
            label="Designation"
            name="designation"
            variant="outlined"
            fullWidth
            value={form.designation}
            onChange={handleChange}
            required
          />

          <TextField
            label="Salary"
            name="salary"
            type="number"
            variant="outlined"
            fullWidth
            value={form.salary}
            onChange={handleChange}
            required
            inputProps={{ min: 0, step: 100 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#3b30c8",
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 2,
              transition: "background-color 0.3s ease",
              "&:hover": {
                bgcolor: theme.palette.primary.dark,
              },
            }}
          >
            Register
          </Button>
        </Box>

        <Typography variant="body2" align="center" mt={3} color="text.secondary">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;
