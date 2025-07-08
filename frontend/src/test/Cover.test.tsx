import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Cover from "../Pages/Cover";


jest.mock("../Components/Navbar", () => () => <div data-testid="navbar">Mocked Navbar</div>);

const DummyChild = () => <div data-testid="child">Child Route Content</div>;

describe("Cover Layout", () => {
  test("renders Navbar and Outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<Cover />}>
            <Route path="/dashboard" element={<DummyChild />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
