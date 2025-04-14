// src/app/collections/__test__/collection-products.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import CollectionProduct from '../collection-products';

// Mock ProductCard component
jest.mock('@/components/product/product-card', () => {
  return function MockProductCard({ product }) {
    return <div data-testid={`product-card-${product.id}`}>{product.name}</div>;
  };
});

// Mock Heading component
jest.mock('@/components/ui/heading', () => ({
  __esModule: true,
  default: ({ children, level }) => <div data-level={level}>{children}</div>,
}));

describe("CollectionProduct Component", () => {
  const mockCollection = {
    name: "Ethereal",
  };

  const mockProducts = [
    { id: "1", name: "Bracelet 1" },
    { id: "2", name: "Bracelet 2" },
    { id: "3", name: "Bracelet 3" },
  ];

  it("renders the collection name in the heading", () => {
    render(
      <CollectionProduct collection={mockCollection} products={mockProducts} />
    );

    expect(screen.getByText("Explore the")).toBeInTheDocument();
    expect(screen.getByText("Ethereal")).toBeInTheDocument();
    expect(screen.getByText("Collection")).toBeInTheDocument();
  });

  it("displays the collection description", () => {
    
    render(
      <CollectionProduct collection={mockCollection} products={mockProducts} />
    );

    expect(
      screen.getByText(
        /Each piece in this collection has been meticulously crafted/
      )
    ).toBeInTheDocument();
  });

  it("renders all product cards", () => {
    render(
      <CollectionProduct collection={mockCollection} products={mockProducts} />
    );

    // Check each product card is rendered
    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-3")).toBeInTheDocument();

    // Check product names are displayed
    expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 2")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 3")).toBeInTheDocument();
  });
});