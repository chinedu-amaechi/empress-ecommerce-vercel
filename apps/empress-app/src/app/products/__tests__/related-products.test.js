// src/app/products/__tests__/related-products.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import RelatedProducts from "../related-products";

// Mock next/link
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

// Mock ProductCard component
jest.mock("@/components/product/product-card", () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.name}</div>;
  };
});

describe("RelatedProducts Component", () => {
  const mockProducts = [
    { id: "1", name: "Bracelet 1" },
    { id: "2", name: "Bracelet 2" },
    { id: "3", name: "Bracelet 3" },
    { id: "4", name: "Bracelet 4" },
  ];

  it("renders the heading properly", () => {
    render(<RelatedProducts products={mockProducts} />);

    expect(screen.getByText("You Might Also")).toBeInTheDocument();
    expect(screen.getByText("Like")).toBeInTheDocument();
  });

  it("shows collection name when provided", () => {
    render(
      <RelatedProducts products={mockProducts} collectionName="Ethereal" />
    );

    expect(
      screen.getByText("More from the Ethereal collection")
    ).toBeInTheDocument();
  });

  it("displays all related products", () => {
    render(<RelatedProducts products={mockProducts} />);

    // Check all product cards are rendered
    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-3")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-4")).toBeInTheDocument();

    // Check product names
    expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 2")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 3")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 4")).toBeInTheDocument();
  });

  it("includes view all link when collection ID is provided", () => {
    render(
      <RelatedProducts
        products={mockProducts}
        collectionName="Ethereal"
        collectionId="ethereal"
      />
    );

    const viewAllLink = screen.getByText("View all");
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink.closest("a")).toHaveAttribute(
      "href",
      "/collections?collection=ethereal"
    );
  });

  it("handles empty products array", () => {
    const { container } = render(<RelatedProducts products={[]} />);

    // Component should return null or empty
    expect(container.firstChild).toBeNull();
  });
});
