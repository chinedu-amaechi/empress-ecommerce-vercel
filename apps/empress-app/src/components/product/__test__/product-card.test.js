// src/components/product/__test__/product-card.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../product-card";
import { CartContextProvider } from "../../../app/contexts/cart-context";

// Mock necessary dependencies
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return (
      <img
        src={props.src}
        alt={props.alt || "Product image"}
        data-testid="product-image"
        className={props.className}
      />
    );
  },
}));

jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Sample product data for testing
const sampleProduct = {
  _id: "product123",
  name: "Test Bracelet",
  price: 129.99,
  originalPrice: 159.99,
  rating: 4.5,
  reviews: 24,
  material: "Sterling Silver",
  colors: ["Silver", "Rose Gold", "Gold"],
  description: "A beautiful test bracelet with elegant design.",
  imagesUrl: [
    { optimizeUrl: "/test-image-1.jpg" },
    { optimizeUrl: "/test-image-2.jpg" },
    { optimizeUrl: "/test-image-3.jpg" },
  ],
  isNew: true,
  isBestseller: true,
};

describe("ProductCard Component", () => {
  // Test 1: Renders basic product information correctly
  it("renders the product name, price, and image", () => {
    // ARRANGE: Render the component with sample product data
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // ACT: Find rendered elements
    const nameElement = screen.getByText("Test Bracelet");
    const priceElement = screen.getByText("$129.99");
    const imageElement = screen.getByTestId("product-image");

    // ASSERT: Verify product information is displayed correctly
    expect(nameElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", "/test-image-1.jpg");
  });

  // Test 2: Displays sale price and original price when on sale
  it("displays both original and discounted price when on sale", () => {
    // ARRANGE: Render component with a product that has both prices
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // ACT: Find price elements
    const salePrice = screen.getByText("$129.99");
    const originalPrice = screen.getByText("$159.99");

    // ASSERT: Verify both prices are displayed
    expect(salePrice).toBeInTheDocument();
    expect(originalPrice).toBeInTheDocument();
    // The original price should have line-through styling
    expect(originalPrice).toHaveClass("line-through");
  });

  // Test 3: Displays star rating correctly
  it("renders the correct star rating", () => {
    // ARRANGE: Render component with product that has a rating
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // ACT: Find rating elements (5 stars total, with 4.5 rating)
    const ratingElement = screen.getByText(/4.5/);
    const reviewsElement = screen.getByText(/24/);

    // ASSERT: Verify rating is displayed correctly
    expect(ratingElement).toBeInTheDocument();
    expect(reviewsElement).toBeInTheDocument();

    // Check for stars (implementation dependent)
    const stars = screen
      .getAllByRole("img", { hidden: true })
      .filter(
        (el) =>
          el.parentElement &&
          el.parentElement.getAttribute("aria-label")?.includes("star")
      );
    expect(stars.length).toBeGreaterThan(0);
  });

  // Test 4: Image carousel navigation works
  it("allows navigating between product images", async () => {
    // ARRANGE: Set up user events and render component
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // Get the initial image
    const initialImage = screen.getByTestId("product-image");
    expect(initialImage).toHaveAttribute("src", "/test-image-1.jpg");

    // Hover over the card to show navigation buttons
    fireEvent.mouseEnter(screen.getByText("Test Bracelet").closest("div"));

    // ACT: Click the next button
    const nextButton = screen.getByRole("button", { name: /next image/i });
    await user.click(nextButton);

    // ASSERT: Verify image changed to the next one
    await waitFor(() => {
      const updatedImage = screen.getByTestId("product-image");
      expect(updatedImage).toHaveAttribute("src", "/test-image-2.jpg");
    });

    // ACT: Click next again to go to third image
    await user.click(nextButton);

    // ASSERT: Verify image changed to the third one
    await waitFor(() => {
      const updatedImage = screen.getByTestId("product-image");
      expect(updatedImage).toHaveAttribute("src", "/test-image-3.jpg");
    });

    // ACT: Click previous button to go back
    const prevButton = screen.getByRole("button", { name: /previous image/i });
    await user.click(prevButton);

    // ASSERT: Verify image changed back to the second one
    await waitFor(() => {
      const updatedImage = screen.getByTestId("product-image");
      expect(updatedImage).toHaveAttribute("src", "/test-image-2.jpg");
    });
  });

  // Test 5: Add to cart button works
  it("adds the product to cart when 'Add to Cart' button is clicked", async () => {
    // ARRANGE: Set up a mock for the cart context and render component
    const mockSetCart = jest.fn();
    const user = userEvent.setup();

    // Create a custom wrapper that provides access to the setCart function
    const CartContextWrapper = ({ children }) => {
      return (
        <CartContextProvider value={{ cart: [], setCart: mockSetCart }}>
          {children}
        </CartContextProvider>
      );
    };

    render(
      <CartContextWrapper>
        <ProductCard product={sampleProduct} />
      </CartContextWrapper>
    );

    // ACT: Click the 'Add to Cart' button
    const addToCartButton = screen.getByText("Add to Cart");
    await user.click(addToCartButton);

    // ASSERT: Verify the product was added to cart
    expect(mockSetCart).toHaveBeenCalled();
  });

  // Test 6: Quick view modal opens and closes
  it("opens and closes the quick view modal", async () => {
    // ARRANGE: Set up user events and render component
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // Hover over the card to show quick view button
    fireEvent.mouseEnter(screen.getByText("Test Bracelet").closest("div"));

    // ACT: Click the quick view button
    const quickViewButton = screen.getByText("Quick View");
    await user.click(quickViewButton);

    // ASSERT: Verify the modal is opened
    expect(screen.getByText("Shopping Cart")).toBeInTheDocument();
    expect(screen.getByText("Color")).toBeInTheDocument(); // Modal content

    // ACT: Close the modal by clicking the close button
    const closeButton = screen.getByRole("button", { name: /close modal/i });
    await user.click(closeButton);

    // ASSERT: Verify the modal is closed
    await waitFor(() => {
      expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument();
    });
  });

  // Test 7: Color selection in modal works
  it("allows selecting different colors in the quick view modal", async () => {
    // ARRANGE: Set up user events and render component
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // Open the quick view modal
    fireEvent.mouseEnter(screen.getByText("Test Bracelet").closest("div"));
    await user.click(screen.getByText("Quick View"));

    // ACT: Click on a different color
    const roseGoldOption = screen.getByText("Rose Gold");
    await user.click(roseGoldOption);

    // ASSERT: Verify the color selection changed
    expect(roseGoldOption).toHaveClass("bg-[#11296B]"); // Selected color button has highlight class
    expect(screen.getByText("Silver")).not.toHaveClass("bg-[#11296B]");
  });

  // Test 8: Quantity controls in modal work
  it("allows changing quantity in the quick view modal", async () => {
    // ARRANGE: Set up user events and render component
    const user = userEvent.setup();
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // Open the quick view modal
    fireEvent.mouseEnter(screen.getByText("Test Bracelet").closest("div"));
    await user.click(screen.getByText("Quick View"));

    // Quantity should start at 1
    expect(screen.getByText("1")).toBeInTheDocument();

    // ACT: Click the increase quantity button
    await user.click(screen.getByRole("button", { name: "+" }));

    // ASSERT: Verify quantity increased
    expect(screen.getByText("2")).toBeInTheDocument();

    // ACT: Click decrease button
    await user.click(screen.getByRole("button", { name: "-" }));

    // ASSERT: Verify quantity decreased
    expect(screen.getByText("1")).toBeInTheDocument();

    // ACT: Try to decrease below 1
    await user.click(screen.getByRole("button", { name: "-" }));

    // ASSERT: Verify quantity doesn't go below 1
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  // Test 9: Handles products with missing information gracefully
  it("renders gracefully with missing product information", () => {
    // ARRANGE: Create a product with minimal information
    const minimalProduct = {
      _id: "minimal123",
      name: "Minimal Product",
      // Missing price, images, and other properties
    };

    // Render the component with minimal product
    render(
      <CartContextProvider>
        <ProductCard product={minimalProduct} />
      </CartContextProvider>
    );

    // ASSERT: Component renders without crashing
    expect(screen.getByText("Minimal Product")).toBeInTheDocument();

    // Default price formatting should be applied
    expect(screen.getByText("$0.00")).toBeInTheDocument();

    // Should use default image
    const imageElement = screen.getByTestId("product-image");
    expect(imageElement).toBeInTheDocument();
  });

  // Test 10: Displays badges for new and bestseller products
  it("displays appropriate badges for new and bestseller products", () => {
    // ARRANGE: Render the component with a product that has special flags
    render(
      <CartContextProvider>
        <ProductCard product={sampleProduct} />
      </CartContextProvider>
    );

    // ASSERT: Verify the badges are displayed
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("Bestseller")).toBeInTheDocument();
  });
});
