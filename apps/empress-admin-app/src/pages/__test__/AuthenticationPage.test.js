// apps/empress-admin-app/src/pages/__tests__/AuthenticationPage.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthenticationPage from '../AuthenticationPage';
import { postLogin } from '../../services/authentication';
import { useAuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../../services/authentication', () => ({
  postLogin: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

// Mock useAuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuthContext: jest.fn()
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe("AuthenticationPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default implementation for useAuthContext
    useAuthContext.mockReturnValue({
      user: null,
      setUser: jest.fn(),
    });
  });

  it("renders the login form", () => {
    render(
      <BrowserRouter>
        <AuthenticationPage />
      </BrowserRouter>,
    );

    // Check heading
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();

    // Check form fields
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    // Check buttons
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register" }),
    ).toBeInTheDocument();

    // Check other elements
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    // Mock setUser function
    const mockSetUser = jest.fn();
    useAuthContext.mockReturnValue({
      user: null,
      setUser: mockSetUser,
    });

    // Mock successful login response
    postLogin.mockResolvedValue({
      status: 200,
      message: "Login successful",
      data: {
        token: "test-token",
        user: { email: "test@example.com" },
      },
    });

    render(
      <BrowserRouter>
        <AuthenticationPage />
      </BrowserRouter>,
    );

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Verify API call
    expect(postLogin).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });

    // Verify success handling
    await waitFor(() => {
      // Check token was stored
      expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
        "token",
        "test-token",
      );

      // Check user was updated in context
      expect(mockSetUser).toHaveBeenCalledWith({ email: "test@example.com" });

      // Check navigation to dashboard
      expect(mockNavigate).toHaveBeenCalledWith("/");

      // Check success toast
      expect(toast.success).toHaveBeenCalledWith("Login successful");
    });
  });

  it("handles failed login", async () => {
    // Mock failed login response
    postLogin.mockResolvedValue({
      status: 400,
      message: "Invalid credentials",
    });

    render(
      <BrowserRouter>
        <AuthenticationPage />
      </BrowserRouter>,
    );

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrong-password" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Verify error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");

      // User should not be set
      expect(window.sessionStorage.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
  it("handles API errors gracefully", async () => {
    // Mock API error
    postLogin.mockRejectedValue(new Error("Network error"));

    render(
      <BrowserRouter>
        <AuthenticationPage />
      </BrowserRouter>,
    );

    // Fill in form
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    // Submit form (shouldn't throw unhandled error)
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Console error should be logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it("redirects to dashboard if already logged in", () => {
    // Mock a logged-in user
    useAuthContext.mockReturnValue({
      user: { email: "user@example.com" },
      setUser: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AuthenticationPage />
      </BrowserRouter>,
    );

    // Should redirect to dashboard immediately
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});