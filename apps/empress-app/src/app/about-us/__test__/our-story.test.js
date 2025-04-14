// src/app/about-us/__test__/our-story.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import OurStory from "../our-story";

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

describe("OurStory Component", () => {
  beforeEach(() => {
    // Reset any runtime handlers
    jest.clearAllMocks();
  });

  it("renders the heading", () => {
    render(<OurStory />);

    expect(screen.getByText("The")).toBeInTheDocument();
    expect(screen.getByText("Empress")).toBeInTheDocument();
    expect(screen.getByText("Journey")).toBeInTheDocument();
  });

  it("displays the story paragraphs", () => {
    render(<OurStory />);

    expect(
      screen.getByText(/Empress Canada has launched!/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Founded in 2015 by Ting Ting Yan/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Each collection tells a unique story/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Today, our team of dedicated artisans/)
    ).toBeInTheDocument();
  });

  it("shows the founder information", () => {
    render(<OurStory />);

    expect(screen.getByText("Ting Ting Yan")).toBeInTheDocument();
    expect(screen.getByText("Founder & Creative Director")).toBeInTheDocument();

    const image = screen.getByAltText("Empress founder");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "/Empress/Heritage/Suyan/IMG_2079.JPG"
    );
  });
});
