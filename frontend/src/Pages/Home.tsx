import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#3b30c8",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h2" fontWeight="bold" gutterBottom>
        Employee Management System
      </Typography>
      <Stack spacing={3} direction={{ xs: "column", sm: "row" }} mt={4}>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{ bgcolor: "white", color: "#3b30c8", fontWeight: "bold", px: 5, py: 1.5, borderRadius: 2,
            "&:hover": { bgcolor: "#e0e0e0" } }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/register")}
          sx={{ borderColor: "white", color: "white", fontWeight: "bold", px: 5, py: 1.5, borderRadius: 2,
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "white" } }}
        >
          Register
        </Button>
      </Stack>
    </Box>
  );
};

export default LandingPage;
