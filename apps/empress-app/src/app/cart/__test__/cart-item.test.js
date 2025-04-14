// src/app/cart/__test__/cart-item.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import CartItem from "../cart-item";

describe("CartItem Component", () => {
  const mockProduct = {
    name: "Test Bracelet",
    price: 99.99,
    quantity: 2,
  };

  it("renders the product details correctly", () => {
    render(<CartItem product={mockProduct} />);

    expect(screen.getByText("Test Bracelet")).toBeInTheDocument();
    expect(screen.getByText("Price: $99.99")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
  });
});
