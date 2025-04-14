// src/app/about-us/__test__/cta.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import CtaSection from "../cta";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  useInView: () => true,
}));

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <div data-level={level}>{children}</div>,
}));

describe("CtaSection Component", () => {
  beforeEach(() => {
    // Reset any runtime handlers
    jest.clearAllMocks();
  });

  it("renders the heading correctly", () => {
    render(<CtaSection />);

    expect(screen.getByText("Discover Your")).toBeInTheDocument();
    expect(screen.getByText("Signature Piece")).toBeInTheDocument();
  });

  it("displays the description text", () => {
    render(<CtaSection />);

    expect(
      screen.getByText(/Explore our collections and find the bracelet/)
    ).toBeInTheDocument();
  });

  it("contains a link to collections", () => {
    render(<CtaSection />);

    const link = screen.getByText("Explore Collections");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/collections");
  });
});
