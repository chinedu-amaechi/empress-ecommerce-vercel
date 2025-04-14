// src/app/auth/__test__/forget-password.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ForgetPassword from "../forget-password/page";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock UI components
jest.mock("@/components/ui/button", () => {
  return ({ children }) => <button>{children}</button>;
});

jest.mock("@/components/ui/heading", () => {
  return ({ children }) => <h2>{children}</h2>;
});

describe("ForgetPassword Page", () => {
  it("renders the Forgot Password form correctly", () => {
    render(<ForgetPassword />);

    // Check for the heading
    expect(screen.getByText("Forgot Password")).toBeInTheDocument();

    // Check for the form elements
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" })
    ).toBeInTheDocument();
  });

  it("contains a link back to sign in page", () => {
    render(<ForgetPassword />);

    expect(screen.getByText("Remembered your password?")).toBeInTheDocument();

    const signInLink = screen.getByText("Sign in");
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest("a")).toHaveAttribute("href", "/auth/sign-in");
  });

  it("validates email input", () => {
    render(<ForgetPassword />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("required");
  });
});
