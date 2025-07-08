import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Error from "../Pages/Error"; 

describe("Error Page", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Error />
      </MemoryRouter>
    );
  });

  test("displays 404 heading", () => {
    const heading = screen.getByText("404");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("text-9xl");
  });

  test("displays error message", () => {
    expect(
      screen.getByText(/Oops! The page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  test("renders 'Go back home' link", () => {
    const link = screen.getByRole("link", { name: /go back home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
