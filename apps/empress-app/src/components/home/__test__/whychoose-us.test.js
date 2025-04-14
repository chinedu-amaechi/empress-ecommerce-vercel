// src/components/home/__test__/whychoose-us.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import WhyChooseUs from "../whychoose-us";

// Mock Lucide React icons
jest.mock("lucide-react", () => ({
  Shield: () => <div data-testid="shield-icon" />,
  Gem: () => <div data-testid="gem-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
}));

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <h2 data-level={level}>{children}</h2>,
}));

describe("WhyChooseUs Component", () => {
  it("renders the section heading", () => {
    render(<WhyChooseUs />);

    expect(screen.getByText("Why")).toBeInTheDocument();
    expect(screen.getByText("Choose Empress")).toBeInTheDocument();
  });

  it("displays all feature cards with correct content", () => {
    render(<WhyChooseUs />);

    // Check all feature titles
    expect(screen.getByText("Uncompromising Quality")).toBeInTheDocument();
    expect(screen.getByText("Unique Design")).toBeInTheDocument();
    expect(screen.getByText("Sustainable Practices")).toBeInTheDocument();
    expect(screen.getByText("Timeless Elegance")).toBeInTheDocument();

    // Check all feature descriptions
    expect(
      screen.getByText(
        /Each piece is meticulously crafted using premium materials/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Our bracelets are more than accessories/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/We're committed to ethical sourcing/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Designs that transcend trends/)
    ).toBeInTheDocument();
  });

  it("includes the appropriate icons for each feature", () => {
    render(<WhyChooseUs />);

    // Check all feature icons are rendered
    expect(screen.getByTestId("shield-icon")).toBeInTheDocument();
    expect(screen.getByTestId("gem-icon")).toBeInTheDocument();
    expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
  });
});
