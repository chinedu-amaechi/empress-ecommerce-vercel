// apps/empress-admin-app/src/ui/__tests__/SideNav.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SideNav from "../SideNav";
import { AuthContextProvider } from "../../contexts/AuthContext";

// Mock the SideNavList component to simplify testing
jest.mock("../SideNavList", () => {
  return function MockSideNavList({ to, text }) {
    return <div data-testid={`navlink-${text.toLowerCase()}`}>{text} Link</div>;
  };
});

describe("SideNav Component", () => {
  const mockSetUser = jest.fn();
  const mockNavigate = jest.fn();

  // Mock AuthContext
  const renderWithContext = (user = null) => {
    return render(
      <BrowserRouter>
        <AuthContextProvider value={{ user, setUser: mockSetUser }}>
          <SideNav />
        </AuthContextProvider>
      </BrowserRouter>,
    );
  };

  // Mock useNavigate
  jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sidebar with navigation links", () => {
    renderWithContext({ email: "admin@example.com" });

    // Logo should be present
    expect(screen.getByText("Empress")).toBeInTheDocument();

    // Navigation links should be present
    expect(screen.getByTestId("navlink-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-users")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-products")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-collections")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-orders")).toBeInTheDocument();
    expect(screen.getByTestId("navlink-messages")).toBeInTheDocument();

    // Bottom navigation should include settings and logout
    expect(screen.getByTestId("navlink-settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("handles logout correctly", () => {
    renderWithContext({ email: "admin@example.com" });

    // Click logout button
    fireEvent.click(screen.getByText("Logout"));

    // Should call setUser with null
    expect(mockSetUser).toHaveBeenCalledWith(null);

    // Should remove token from sessionStorage
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith("token");

    // Should navigate to login page
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("switches between desktop and mobile view based on window width", () => {
    // Mock window width for mobile
    window.innerWidth = 600;
    renderWithContext();

    // Should show mobile menu button
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument();

    // Mock window width for desktop
    window.innerWidth = 1200;
    renderWithContext();

    // Should not show mobile menu button on desktop
    expect(screen.queryByLabelText("Open menu")).not.toBeInTheDocument();
  });

  it("toggles mobile menu when button is clicked", () => {
    window.innerWidth = 600;
    renderWithContext();

    // Mobile menu should be closed initially
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

    // Click to open mobile menu
    fireEvent.click(screen.getByLabelText("Open menu"));

    // Mobile menu should now be visible
    expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();

    // Button should now be for closing
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();

    // Click to close mobile menu
    fireEvent.click(screen.getByLabelText("Close menu"));

    // Mobile menu should be closed again
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });
});
