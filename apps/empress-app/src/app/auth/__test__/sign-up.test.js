// src/app/auth/__test__/sign-up.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SignUp from "../sign-up/page";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock UI components
jest.mock("@/components/ui/button", () => {
  return ({ children, type }) => <button type={type}>{children}</button>;
});

jest.mock("@/components/ui/heading", () => {
  return ({ children }) => <h2>{children}</h2>;
});

describe("SignUp Page", () => {
  it("renders the Sign Up form correctly", () => {
    render(<SignUp />);

    // Check for the heading
    expect(screen.getByText("Sign Up")).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Street Address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Province")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Postcode")).toBeInTheDocument();

    // Check for the submit button
    expect(
      screen.getByRole("button", { name: "Create Account" })
    ).toBeInTheDocument();
  });

  it("contains a link to sign in page", () => {
    render(<SignUp />);

    expect(screen.getByText("Already have an account?")).toBeInTheDocument();

    const signInLink = screen.getByText("Sign in");
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest("a")).toHaveAttribute("href", "/auth/sign-in");
  });

  it("handles form input changes", () => {
    render(<SignUp />);

    // Get form inputs
    const emailInput = screen.getByPlaceholderText("your@email.com");
    const password = screen.getAllByPlaceholderText("••••••••")[0];
    const confirmPassword = screen.getAllByPlaceholderText("••••••••")[1];

    // Type into inputs
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(password, { target: { value: "password123" } });
    fireEvent.change(confirmPassword, { target: { value: "password123" } });

    // Check the updated values
    expect(emailInput.value).toBe("test@example.com");
    expect(password.value).toBe("password123");
    expect(confirmPassword.value).toBe("password123");
  });

  it("validates password matching", () => {
    render(<SignUp />);

    // Get password inputs
    const password = screen.getAllByPlaceholderText("••••••••")[0];
    const confirmPassword = screen.getAllByPlaceholderText("••••••••")[1];

    // Set different passwords
    fireEvent.change(password, { target: { value: "password123" } });
    fireEvent.change(confirmPassword, { target: { value: "different" } });

    // Error message should appear
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();

    // Set matching passwords
    fireEvent.change(confirmPassword, { target: { value: "password123" } });

    // Error message should disappear
    expect(
      screen.queryByText("Passwords do not match")
    ).not.toBeInTheDocument();
  });
});
