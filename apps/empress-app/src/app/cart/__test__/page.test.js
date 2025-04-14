// src/app/cart/__test__/page.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import CartPage from "../page";

// Mock components and context
jest.mock("@/components/ui/navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar Component</div>;
  };
});

jest.mock("../cart-item", () => {
  return function MockCartItem({ product }) {
    return <div data-testid={`cart-item-${product._id}`}>{product.name}</div>;
  };
});

const mockCartContext = {
  cart: [
    { _id: "1", name: "Bracelet 1", price: 99.99, quantity: 1 },
    { _id: "2", name: "Bracelet 2", price: 129.99, quantity: 2 },
  ],
  setCart: jest.fn(),
};

jest.mock("../../../app/contexts/cart-context", () => ({
  useCartContext: () => mockCartContext,
}));

describe("CartPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn(); // Mock console.log to avoid test output clutter
  });

  it("renders the navbar", () => {
    render(<CartPage />);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("displays the Cart Page heading", () => {
    render(<CartPage />);

    expect(screen.getByText("Cart Page")).toBeInTheDocument();
  });

  it("renders cart items from the cart context", () => {
    render(<CartPage />);

    // Check cart items are rendered
    expect(screen.getByTestId("cart-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("cart-item-2")).toBeInTheDocument();

    // Check product names are displayed
    expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 2")).toBeInTheDocument();
  });

  it("logs the cart contents", () => {
    render(<CartPage />);

    // Check console.log was called with cart contents
    expect(console.log).toHaveBeenCalledWith(mockCartContext.cart);
  });
});
