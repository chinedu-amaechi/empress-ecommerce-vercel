// src/app/about-us/__test__/our-philosophy.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import OurPhilosophy from "../our-philosophy";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  useInView: () => true,
}));

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <div data-level={level}>{children}</div>,
}));

describe("OurPhilosophy Component", () => {
  beforeEach(() => {
    // Reset any runtime handlers
    jest.clearAllMocks();
  });

  it("renders the heading correctly", () => {
    render(<OurPhilosophy />);

    expect(screen.getByText("Our")).toBeInTheDocument();
    expect(screen.getByText("Philosophy")).toBeInTheDocument();
  });

  it("displays the philosophy sections", () => {
    render(<OurPhilosophy />);

    expect(screen.getByText("Timeless Elegance")).toBeInTheDocument();
    expect(screen.getByText("Artisanal Craftsmanship")).toBeInTheDocument();
    expect(screen.getByText("Ethical Sourcing")).toBeInTheDocument();

    expect(
      screen.getByText(
        /At Empress, we believe in the transformative power of jewelry/
      )
    ).toBeInTheDocument();
  });

  it("includes the image", () => {
    render(<OurPhilosophy />);

    const image = screen.getByAltText("Handcrafting jewelry");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/Empress/Ethereal/Sorelle/IMG_1904.JPG"
    );
  });
});
