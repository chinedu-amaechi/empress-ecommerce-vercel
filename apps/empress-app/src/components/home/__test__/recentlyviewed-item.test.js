// src/components/home/__test__/recentlyviewed-item.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import RecentlyViewedItems from "../recentlyviewed-item";

// Mock Heading component
jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <h2 data-level={level}>{children}</h2>,
}));

// Mock ProductCard component
jest.mock("@/components/product/product-card", () => {
  return function MockProductCard({ product, onView }) {
    return (
      <div data-testid={`product-card-${product.id}`} onClick={onView}>
        {product.name}
      </div>
    );
  };
});

describe("RecentlyViewedItems Component", () => {
  // Mock localStorage
  const mockLocalStorage = (items) => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key) => {
          if (key === "recently_viewed_items") {
            return JSON.stringify(items);
          }
          return null;
        }),
        setItem: jest.fn(),
      },
      writable: true,
    });
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it("renders nothing when no items in localStorage", () => {
    mockLocalStorage([]);
    const { container } = render(<RecentlyViewedItems />);

    // Component should return null
    expect(container.firstChild).toBeNull();
  });

  it("displays recently viewed items from localStorage", () => {
    const mockItems = [
      { id: "1", name: "Bracelet 1" },
      { id: "2", name: "Bracelet 2" },
      { id: "3", name: "Bracelet 3" },
    ];

    mockLocalStorage(mockItems);
    render(<RecentlyViewedItems />);

    // Check section heading
    expect(screen.getByText("Recently")).toBeInTheDocument();
    expect(screen.getByText("Viewed")).toBeInTheDocument();

    // Check product cards
    expect(screen.getByTestId("product-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-2")).toBeInTheDocument();
    expect(screen.getByTestId("product-card-3")).toBeInTheDocument();

    // Check product names
    expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 2")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 3")).toBeInTheDocument();
  });

  it("updates localStorage when viewing a product", () => {
    const mockItems = [
      { id: "1", name: "Bracelet 1" },
      { id: "2", name: "Bracelet 2" },
    ];

    mockLocalStorage(mockItems);

    render(<RecentlyViewedItems />);

    // Click on a product to trigger onView
    const productCard = screen.getByTestId("product-card-1");
    productCard.click();

    // Check that localStorage.setItem was called
    expect(window.localStorage.setItem).toHaveBeenCalled();
    expect(window.localStorage.setItem.mock.calls[0][0]).toBe(
      "recently_viewed_items"
    );

    // The item clicked should be moved to the beginning of the array
    const updatedItems = JSON.parse(
      window.localStorage.setItem.mock.calls[0][1]
    );
    expect(updatedItems[0].id).toBe("1");
  });
});
