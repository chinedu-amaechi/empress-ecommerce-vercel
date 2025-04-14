// apps/empress-admin-app/src/ui/__tests__/AppLayout.test.js
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AppLayout from "../AppLayout";
import { AuthContextProvider } from "../../contexts/AuthContext";

// Mock the SideNav component
jest.mock("../SideNav", () => {
  return function MockSideNav() {
    return <div data-testid="mock-sidenav">SideNav Component</div>;
  };
});

// Mock the ProtectedRoutes component
jest.mock("../ProtectedRoutes", () => {
  return function MockProtectedRoutes({ children }) {
    return <div data-testid="mock-protected-routes">{children}</div>;
  };
});

// Mock the Outlet component from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: () => <div data-testid="mock-outlet">Page Content</div>,
}));

describe("AppLayout Component", () => {
  it("renders the layout with sidebar and content area", () => {
    render(
      <BrowserRouter>
        <AuthContextProvider>
          <AppLayout />
        </AuthContextProvider>
      </BrowserRouter>,
    );

    // Check that ProtectedRoutes is used
    expect(screen.getByTestId("mock-protected-routes")).toBeInTheDocument();

    // Check that SideNav is displayed
    expect(screen.getByTestId("mock-sidenav")).toBeInTheDocument();

    // Check that the content area (Outlet) is displayed
    expect(screen.getByTestId("mock-outlet")).toBeInTheDocument();

    // Verify the content is inside a main element
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toContainElement(screen.getByTestId("mock-outlet"));
  });
});
