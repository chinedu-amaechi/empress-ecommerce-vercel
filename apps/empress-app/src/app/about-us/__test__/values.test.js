// src/app/about-us/__test__/values.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import OurValues from "../values";

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

describe("OurValues Component", () => {
  beforeEach(() => {
    // Reset any runtime handlers
    jest.clearAllMocks();
  });

  it("renders the heading correctly", () => {
    render(<OurValues />);

    expect(screen.getByText("Our")).toBeInTheDocument();
    expect(screen.getByText("Values")).toBeInTheDocument();
  });

  it("contains the description text", () => {
    render(<OurValues />);

    expect(
      screen.getByText(/These core principles guide everything we do/)
    ).toBeInTheDocument();
  });

  it("displays all value cards", () => {
    render(<OurValues />);

    // Check all values are displayed
    expect(screen.getByText("Excellence")).toBeInTheDocument();
    expect(
      screen.getByText(/We pursue perfection in every detail/)
    ).toBeInTheDocument();

    expect(screen.getByText("Authenticity")).toBeInTheDocument();
    expect(
      screen.getByText(/Each piece reflects our genuine passion/)
    ).toBeInTheDocument();

    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText(/While respecting tradition/)).toBeInTheDocument();

    expect(screen.getByText("Sustainability")).toBeInTheDocument();
    expect(
      screen.getByText(/We are committed to ethical practices/)
    ).toBeInTheDocument();
  });
});
