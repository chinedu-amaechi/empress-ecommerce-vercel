// src/app/auth/__test__/sign-in.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "../sign-in/page";

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

describe("SignIn Page", () => {
  it("renders the Sign In form correctly", () => {
    render(<SignIn />);

    // Check for the heading
    expect(screen.getByText("Sign In")).toBeInTheDocument();

    // Check for the form elements
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Remember me")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("contains links to forgot password and sign up pages", () => {
    render(<SignIn />);

    const forgotPasswordLink = screen.getByText("Forgot password?");
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink.closest("a")).toHaveAttribute(
      "href",
      "/auth/forget-password"
    );

    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();

    const createAccountLink = screen.getByText("Create an Account");
    expect(createAccountLink).toBeInTheDocument();
    expect(createAccountLink.closest("a")).toHaveAttribute(
      "href",
      "/auth/sign-up"
    );
  });

  it("has the correct input fields with placeholders", () => {
    render(<SignIn />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    expect(emailInput).toHaveAttribute("type", "email");

    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
