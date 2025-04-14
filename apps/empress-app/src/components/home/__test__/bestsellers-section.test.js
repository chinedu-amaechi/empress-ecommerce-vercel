// src/components/home/__test__/bestsellers-section.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BestsellersSection from "../bestsellers-section";

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <h2 data-level={level}>{children}</h2>,
}));

// Mock ProductCard component
jest.mock("@/components/product/product-card", () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.name}</div>;
  };
});

describe("BestsellersSection Component", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it("renders the section heading", () => {
    render(<BestsellersSection />);

    expect(screen.getByText("Bestselling")).toBeInTheDocument();
    expect(screen.getByText("Bracelets")).toBeInTheDocument();
  });

  it("displays the section description", () => {
    render(<BestsellersSection />);

    expect(
      screen.getByText(/Explore our most beloved pieces/)
    ).toBeInTheDocument();
  });

  it("renders product cards for bestseller products", () => {
    render(<BestsellersSection />);

    // Check for all bestseller products
    expect(screen.getByText("Aluna")).toBeInTheDocument();
    expect(screen.getByText("Sorelle")).toBeInTheDocument();
    expect(screen.getByText("Jinhua")).toBeInTheDocument();
    expect(screen.getByText("Nyra")).toBeInTheDocument();
    expect(screen.getByText("Azurea")).toBeInTheDocument();
    expect(screen.getByText("Suya")).toBeInTheDocument();
    expect(screen.getByText("Noor")).toBeInTheDocument();
  });

  it("contains navigation buttons", () => {
    render(<BestsellersSection />);

    const prevButton = screen.getByLabelText("Previous image");
    const nextButton = screen.getByLabelText("Next image");

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("includes a link to all bestsellers", () => {
    render(<BestsellersSection />);

    const link = screen.getByText("View All Bestsellers");
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/bestsellers");
  });

  // You can also test scrolling functionality, but that would require more complex mocking
  // since scrollContainerRef is used with DOM methods
});
