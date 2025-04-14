// src/components/home/__test__/collections-section.test.js (continued)
import React from "react";
import { render, screen } from "@testing-library/react";
import CollectionsSection from "../collections-section";

// Mock Next.js components
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <h2 data-level={level}>{children}</h2>,
}));

describe("CollectionsSection Component", () => {
  it("renders the section heading", () => {
    render(<CollectionsSection />);

    expect(screen.getByText("Our")).toBeInTheDocument();
    expect(screen.getByText("Collections")).toBeInTheDocument();
  });

  it("displays the section description", () => {
    render(<CollectionsSection />);

    expect(
      screen.getByText(/Discover our carefully curated collections/)
    ).toBeInTheDocument();
  });

  it("renders all collection cards", () => {
    render(<CollectionsSection />);

    // Check all collection names are displayed
    expect(screen.getByText("Ethereal")).toBeInTheDocument();
    expect(screen.getByText("Divine")).toBeInTheDocument();
    expect(screen.getByText("Heritage")).toBeInTheDocument();
    expect(screen.getByText("Celestial Bloom")).toBeInTheDocument();

    // Check all collection descriptions are displayed
    expect(
      screen.getByText("Delicate designs that whisper elegance")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Bold statements of inner strength")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Timeless craftsmanship passed down")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Inspired by the cosmic dance of stars")
    ).toBeInTheDocument();
  });

  it("contains links to collection pages", () => {
    render(<CollectionsSection />);

    // Check there are 4 "Explore Collection" links
    const exploreLinks = screen.getAllByText("Explore Collection");
    expect(exploreLinks).toHaveLength(4);

    // Each link should be in an anchor tag
    exploreLinks.forEach((link) => {
      expect(link.closest("a")).toBeInTheDocument();
    });
  });

  it("displays collection images", () => {
    render(<CollectionsSection />);

    // Check for all collection images
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(4);

    // Check image sources
    expect(images[0]).toHaveAttribute("src", "/collections/ethereal-full.jpg");
    expect(images[1]).toHaveAttribute("src", "/collections/divine-full.jpg");
    expect(images[2]).toHaveAttribute("src", "/collections/heritage-full.jpg");
    expect(images[3]).toHaveAttribute("src", "/collections/celestial-full.jpg");
  });
});
