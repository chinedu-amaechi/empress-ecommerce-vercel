// src/app/products/__tests__/product-info.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductInfo from "../product-info";

// Mock Next.js Link component
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

describe("ProductInfo Component", () => {
  const mockProduct = {
    name: "Celestial Bracelet",
    price: 129.99,
    originalPrice: 159.99,
    description: "A beautiful bracelet inspired by stars",
    rating: 4.5,
    reviews: 24,
    materials: ["Silver", "Moonstone"],
    colors: ["Silver", "Gold", "Rose Gold"],
    meaning: "Represents harmony and balance",
  };

  it("renders the product name and price", () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText("Celestial Bracelet")).toBeInTheDocument();
    expect(screen.getByText("$129.99")).toBeInTheDocument();
    expect(screen.getByText("$159.99")).toBeInTheDocument();
  });

  it("shows the discount percentage", () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText("Save 19%")).toBeInTheDocument();
  });

  it("displays product description and meaning", () => {
    render(<ProductInfo product={mockProduct} />);

    expect(
      screen.getByText("A beautiful bracelet inspired by stars")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Represents harmony and balance")
    ).toBeInTheDocument();
  });

  it("lists product materials", () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
    expect(screen.getByText("Moonstone")).toBeInTheDocument();
  });

  it("shows color selection options", () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText("Color:")).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();
    expect(screen.getByText("Rose Gold")).toBeInTheDocument();
  });

  it("handles quantity changes", () => {
    render(<ProductInfo product={mockProduct} />);

    // Initial quantity should be 1
    expect(screen.getByText("1")).toBeInTheDocument();

    // Click increase button
    const increaseButton =
      screen.getByLabelText(/increment/i) ||
      screen.getByRole("button", { name: "+" });
    fireEvent.click(increaseButton);

    // Quantity should now be 2
    expect(screen.getByText("2")).toBeInTheDocument();

    // Click decrease button
    const decreaseButton =
      screen.getByLabelText(/decrement/i) ||
      screen.getByRole("button", { name: "-" });
    fireEvent.click(decreaseButton);

    // Quantity should be back to 1
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("shows add to cart button", () => {
    render(<ProductInfo product={mockProduct} />);

    expect(
      screen.getByRole("button", { name: "Add to Cart" })
    ).toBeInTheDocument();
  });

  it("displays star ratings", () => {
    render(<ProductInfo product={mockProduct} />);

    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(24 reviews)")).toBeInTheDocument();
  });

  it("works with missing product data (default values)", () => {
    render(<ProductInfo product={{}} />);

    expect(screen.getByText("Product Name")).toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
    expect(screen.getByText("No description available.")).toBeInTheDocument();
  });
});
