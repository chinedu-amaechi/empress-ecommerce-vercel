// src/app/about-us/__test__/about-hero.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import AboutHero from "../about-hero";

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
}));

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <div data-level={level}>{children}</div>,
}));

describe("AboutHero Component", () => {
  beforeEach(() => {
    // Reset any runtime handlers
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    render(<AboutHero />);

    expect(screen.getByText("Our")).toBeInTheDocument();
    expect(screen.getByText("Story")).toBeInTheDocument();
    expect(
      screen.getByText(/Empress was born from a passion/)
    ).toBeInTheDocument();
  });

  it("contains the background image", () => {
    render(<AboutHero />);

    const image = screen.getByAltText("Jinhua");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/Empress/Heritage/Jinhua/IMG_1810.JPG"
    );
  });
});
