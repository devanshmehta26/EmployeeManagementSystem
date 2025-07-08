import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Pages/Login";
import { api } from "../utils/api";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

const mockedNavigate = jest.fn() as jest.Mock;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("../utils/api", () => ({
  api: {
    login: jest.fn(),
  },
}));

describe("Login component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setup() {
    render(
      <BrowserRouter>
        <Login />
        <ToastContainer />
      </BrowserRouter>
    );
  }

  test("renders email and password inputs and login button", () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("shows validation error when fields are empty", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText(/please enter both email and password/i)).toBeInTheDocument()
    );
  });

  test("shows validation error for invalid email", async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "validPass123" } });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    );
  });

  test("calls api.login and navigates on successful login", async () => {
    (api.login as jest.Mock).mockResolvedValueOnce({});
    setup();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "validPass123" } });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "validPass123",
      });
      expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows toast error message on login failure", async () => {
    (api.login as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });
    setup();

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@gmail.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "wrongPass" } });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });
});
