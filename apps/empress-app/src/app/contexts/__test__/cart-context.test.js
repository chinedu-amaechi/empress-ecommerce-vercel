// src/app/contexts/__test__/cart-context.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartContextProvider, useCartContext } from "../cart-context";

// Mock component that uses the cart context for testing
const TestComponent = () => {
  const { cart, setCart } = useCartContext();

  // Function to add an item to the cart
  const addItemToCart = () => {
    setCart([
      ...cart,
      {
        _id: "product1",
        name: "Test Product",
        price: 29.99,
        quantity: 1,
      },
    ]);
  };

  // Function to increase quantity of an existing item
  const increaseQuantity = () => {
    setCart(
      cart.map((item) =>
        item._id === "product1"
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Function to remove an item from the cart
  const removeItem = () => {
    setCart(cart.filter((item) => item._id !== "product1"));
  };

  // Calculate the total number of items (accounting for quantities)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      <h1>Shopping Cart</h1>
      <p data-testid="cart-count">Items in cart: {cart.length}</p>
      <p data-testid="total-items">Total items: {totalItems}</p>
      <p data-testid="cart-empty">{cart.length === 0 ? "Cart is empty" : ""}</p>

      <button onClick={addItemToCart}>Add to Cart</button>
      <button onClick={increaseQuantity}>Increase Quantity</button>
      <button onClick={removeItem}>Remove Item</button>

      <ul>
        {cart.map((item) => (
          <li key={item._id} data-testid={`cart-item-${item._id}`}>
            {item.name} - ${item.price} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe("Cart Context", () => {
  // Test 1: Initial state should be an empty cart
  it("provides an empty cart by default", () => {
    // ARRANGE: Render the test component with the CartContextProvider
    render(
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    );

    // ACT: Find elements that display cart state
    const cartCountElement = screen.getByTestId("cart-count");
    const emptyMessageElement = screen.getByTestId("cart-empty");

    // ASSERT: Verify the cart starts empty
    expect(cartCountElement).toHaveTextContent("Items in cart: 0");
    expect(emptyMessageElement).toHaveTextContent("Cart is empty");
  });

  // Test 2: Adding an item to the cart
  it("allows adding items to the cart", async () => {
    // ARRANGE: Set up user event and render components
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    );

    // ACT: Click the "Add to Cart" button
    await user.click(screen.getByText("Add to Cart"));

    // ASSERT: Verify the cart now contains the item
    expect(screen.getByTestId("cart-count")).toHaveTextContent(
      "Items in cart: 1"
    );
    expect(screen.getByTestId("total-items")).toHaveTextContent(
      "Total items: 1"
    );
    expect(screen.getByTestId("cart-empty")).toHaveTextContent("");

    // Check that the cart item is displayed correctly
    const cartItem = screen.getByTestId("cart-item-product1");
    expect(cartItem).toBeInTheDocument();
    expect(cartItem).toHaveTextContent("Test Product");
    expect(cartItem).toHaveTextContent("$29.99");
    expect(cartItem).toHaveTextContent("Quantity: 1");
  });

  // Test 3: Increasing the quantity of an item
  it("allows increasing the quantity of existing items", async () => {
    // ARRANGE: Set up user event and render components
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    );

    // First, add an item to the cart
    await user.click(screen.getByText("Add to Cart"));

    // Verify initial state
    expect(screen.getByTestId("cart-item-product1")).toHaveTextContent(
      "Quantity: 1"
    );
    expect(screen.getByTestId("total-items")).toHaveTextContent(
      "Total items: 1"
    );

    // ACT: Click the "Increase Quantity" button
    await user.click(screen.getByText("Increase Quantity"));

    // ASSERT: Verify the quantity increased but cart item count stays the same
    expect(screen.getByTestId("cart-count")).toHaveTextContent(
      "Items in cart: 1"
    );
    expect(screen.getByTestId("total-items")).toHaveTextContent(
      "Total items: 2"
    );
    expect(screen.getByTestId("cart-item-product1")).toHaveTextContent(
      "Quantity: 2"
    );
  });

  // Test 4: Removing an item from the cart
  it("allows removing items from the cart", async () => {
    // ARRANGE: Set up user event and render components
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    );

    // Add an item to the cart first
    await user.click(screen.getByText("Add to Cart"));

    // Verify item was added
    expect(screen.getByTestId("cart-item-product1")).toBeInTheDocument();

    // ACT: Click the "Remove Item" button
    await user.click(screen.getByText("Remove Item"));

    // ASSERT: Verify the item was removed and cart is empty again
    expect(screen.getByTestId("cart-count")).toHaveTextContent(
      "Items in cart: 0"
    );
    expect(screen.getByTestId("total-items")).toHaveTextContent(
      "Total items: 0"
    );
    expect(screen.getByTestId("cart-empty")).toHaveTextContent("Cart is empty");
    expect(screen.queryByTestId("cart-item-product1")).not.toBeInTheDocument();
  });

  // Test 5: Multiple operations in sequence
  it("correctly handles multiple cart operations in sequence", async () => {
    // ARRANGE: Set up user event and render components
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    );

    // ACT 1: Add an item to the cart
    await user.click(screen.getByText("Add to Cart"));

    // ASSERT 1: Verify item was added
    expect(screen.getByTestId("cart-count")).toHaveTextContent(
      "Items in cart: 1"
    );

    // ACT 2: Increase the quantity
    await user.click(screen.getByText("Increase Quantity"));
    await user.click(screen.getByText("Increase Quantity"));

    // ASSERT 2: Verify quantity increased
    expect(screen.getByTestId("cart-item-product1")).toHaveTextContent(
      "Quantity: 3"
    );
    expect(screen.getByTestId("total-items")).toHaveTextContent(
      "Total items: 3"
    );

    // ACT 3: Remove the item
    await user.click(screen.getByText("Remove Item"));

    // ASSERT 3: Verify cart is empty
    expect(screen.getByTestId("cart-count")).toHaveTextContent(
      "Items in cart: 0"
    );
    expect(screen.getByTestId("cart-empty")).toHaveTextContent("Cart is empty");

    // ACT 4: Add an item again
    await user.click(screen.getByText("Add to Cart"));

    // ASSERT 4: Verify item was added with quantity 1
    expect(screen.getByTestId("cart-count")).toHaveTextContent(
      "Items in cart: 1"
    );
    expect(screen.getByTestId("cart-item-product1")).toHaveTextContent(
      "Quantity: 1"
    );
  });

  // Test 6: Context throws error when used outside provider
  it("throws an error when used outside of CartContextProvider", () => {
    // Suppress console errors for this test
    const originalError = console.error;
    console.error = jest.fn();

    // ARRANGE & ACT: Attempt to render TestComponent without the provider
    expect(() => {
      render(<TestComponent />);
    }).toThrow("useCartContext must be used within a CartContextProvider");

    // Restore console.error
    console.error = originalError;
  });

  // Test 7: Cart persists across component re-renders
  it("maintains cart state across component re-renders", () => {
    // ARRANGE: Create a container for controlling re-renders
    const { rerender } = render(
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    );

    // ACT: Add an item to the cart
    fireEvent.click(screen.getByText("Add to Cart"));

    // ASSERT: Verify item was added
    expect(screen.getByTestId("cart-item-product1")).toBeInTheDocument();

    // ACT: Trigger a re-render of the component
    rerender(
      <CartContextProvider>
        <TestComponent />
      </CartContextProvider>
    );

    // ASSERT: Verify the cart state persists after re-render
    expect(screen.getByTestId("cart-count")).toHaveTextContent(
      "Items in cart: 1"
    );
    expect(screen.getByTestId("cart-item-product1")).toBeInTheDocument();
  });
});
