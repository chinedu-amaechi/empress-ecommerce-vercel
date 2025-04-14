// src/components/layout/__test__/header.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../header";

// Mock Navbar component
jest.mock("@/components/ui/navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar Component</div>;
  };
});

describe("Header Component", () => {
  it("renders the navbar component", () => {
    render(<Header />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("displays the hero heading", () => {
    render(<Header />);

    expect(screen.getByText("Rule with")).toBeInTheDocument();
    expect(screen.getByText("Elegance")).toBeInTheDocument();
  });

  it("shows the hero description", () => {
    render(<Header />);

    expect(
      screen.getByText(
        /Handcrafted bracelets designed for timeless sophistication./
      )
    ).toBeInTheDocument();
  });

  it("includes call-to-action button", () => {
    render(<Header />);

    const ctaButton = screen.getByText("Explore Collections");
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton.tagName).toBe("A");
    expect(ctaButton).toHaveAttribute("href", "/collections");
  });

  it("has the correct background image", () => {
    render(<Header />);

    const bgElement = screen.getByText("Rule with").closest("div");
    const style = window.getComputedStyle(bgElement);

    expect(style.backgroundImage).toContain(
      "/Empress/Heritage/Suyan/IMG_1801.JPG"
    );
  });
});
