import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../Pages/Register";
import { api } from "../utils/api";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

const mockedNavigate = jest.fn() as jest.Mock;;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../utils/api", () => ({
  api: {
    register: jest.fn(),
  },
}));

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all input fields and the Register button", () => {
    render(
      <BrowserRouter>
        <Register />
        <ToastContainer />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/designation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salary/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(
      <BrowserRouter>
        <Register />
        <ToastContainer />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/please fill out all the fields/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for invalid email", async () => {
    render(
      <BrowserRouter>
        <Register />
        <ToastContainer />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "User" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: "1000" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for password less than 8 chars", async () => {
    render(
      <BrowserRouter>
        <Register />
        <ToastContainer />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "User" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: "1000" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test("calls api.register and navigates on successful submission", async () => {
    (api.register as jest.Mock).mockResolvedValueOnce({});

    render(
      <BrowserRouter>
        <Register />
        <ToastContainer />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "User" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: "5000" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        name: "User",
        email: "user@gmail.com",
        password: "password123",
        designation: "Manager",
        salary: 5000,
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows error toast on api failure", async () => {
    (api.register as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Email already exists" } },
    });

    render(
      <BrowserRouter>
        <Register />
        <ToastContainer />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "User" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/designation/i), { target: { value: "Manager" } });
    fireEvent.change(screen.getByLabelText(/salary/i), { target: { value: "5000" } });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
