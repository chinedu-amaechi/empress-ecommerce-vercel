// src/app/about-us/__test__/artisans.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import OurArtisans from "../artisans";

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

describe("OurArtisans Component", () => {
  beforeEach(() => {
    // Reset any runtime handlers
    jest.clearAllMocks();
  });

  it("renders the heading correctly", () => {
    render(<OurArtisans />);

    expect(screen.getByText("Our")).toBeInTheDocument();
    expect(screen.getByText("People")).toBeInTheDocument();
  });

  it("displays the team description", () => {
    render(<OurArtisans />);

    expect(
      screen.getByText(/Behind every Empress piece is a dedicated team/)
    ).toBeInTheDocument();
  });

  it("shows all team members", () => {
    render(<OurArtisans />);

    expect(screen.getByText("Ting Ting Yan")).toBeInTheDocument();
    expect(screen.getByText("Founder")).toBeInTheDocument();
    expect(
      screen.getByText(/With over 20 years of experience/)
    ).toBeInTheDocument();

    expect(screen.getByText("Eddie Yang")).toBeInTheDocument();
    expect(screen.getByText("CEO")).toBeInTheDocument();
    expect(screen.getByText(/Eddie's leadership ensures/)).toBeInTheDocument();

    expect(screen.getByText("Isabelle Helbig")).toBeInTheDocument();
    expect(screen.getByText("CTO")).toBeInTheDocument();
    expect(
      screen.getByText(/With a keen eye for innovation/)
    ).toBeInTheDocument();
  });
});
