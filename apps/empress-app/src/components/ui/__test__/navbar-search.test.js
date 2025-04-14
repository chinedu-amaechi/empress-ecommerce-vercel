// src/components/ui/__test__/navbar-search.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavbarSearch from "../navbar-search";
import { searchProducts } from "../../../lib/product-service";

// Mock dependencies
jest.mock("../../../lib/product-service", () => ({
  searchProducts: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    return (
      <img
        src={props.src}
        alt={props.alt}
        data-testid="product-image"
        className={props.className}
      />
    );
  },
}));

describe("NavbarSearch Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Renders the search input correctly
  it("renders the search input with correct placeholder", () => {
    // ARRANGE: Render the component
    render(<NavbarSearch />);

    // ACT: Find the search input
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // ASSERT: Verify input exists with correct attributes
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "text");
    expect(searchInput).toHaveClass("w-full");
  });

  // Test 2: Displays search icon
  it("displays a search icon inside the input", () => {
    // ARRANGE: Render the component
    render(<NavbarSearch />);

    // ACT: Find the search icon
    const searchIcon = document.querySelector("svg");

    // ASSERT: Verify search icon exists
    expect(searchIcon).toBeInTheDocument();
    expect(searchIcon.closest("div")).toHaveClass("pointer-events-none");
  });

  // Test 3: Shows loading state while searching
  it("displays a loading spinner when search is in progress", async () => {
    // ARRANGE: Mock a delayed search response
    searchProducts.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([]), 100);
        })
    );

    // Render the component
    render(<NavbarSearch />);

    // ACT: Type search query
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    fireEvent.change(searchInput, { target: { value: "silver bracelet" } });

    // ASSERT: Verify loading spinner appears
    await waitFor(() => {
      const loadingSpinner = document.querySelector(".animate-spin");
      expect(loadingSpinner).toBeInTheDocument();
    });

    // Wait for search to complete
    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith("silver bracelet");
    });
  });

  // Test 4: Shows search results
  it("displays search results when products are found", async () => {
    // ARRANGE: Mock search results
    const mockResults = [
      {
        id: "product1",
        name: "Silver Bracelet",
        price: 129.99,
        image: "/test-image-1.jpg",
        collectionName: "Ethereal",
      },
      {
        id: "product2",
        name: "Gold Bracelet",
        price: 149.99,
        image: "/test-image-2.jpg",
        collectionName: "Divine",
      },
    ];

    searchProducts.mockResolvedValueOnce(mockResults);

    // Render the component
    render(<NavbarSearch />);

    // ACT: Type search query and trigger results display
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    fireEvent.change(searchInput, { target: { value: "bracelet" } });
    fireEvent.focus(searchInput);

    // ASSERT: Verify results are displayed
    await waitFor(() => {
      expect(screen.getByText("Silver Bracelet")).toBeInTheDocument();
      expect(screen.getByText("Gold Bracelet")).toBeInTheDocument();
      expect(screen.getByText("$129.99")).toBeInTheDocument();
      expect(screen.getByText("Ethereal")).toBeInTheDocument();
      expect(screen.getByText("Divine")).toBeInTheDocument();
      expect(screen.getByText("View all results")).toBeInTheDocument();
    });
  });

  // Test 5: Shows empty state when no results
  it("displays empty state message when no products are found", async () => {
    // ARRANGE: Mock empty search results
    searchProducts.mockResolvedValueOnce([]);

    // Render the component
    render(<NavbarSearch />);

    // ACT: Type search query that won't match any products
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    fireEvent.change(searchInput, { target: { value: "nonexistent product" } });

    // ASSERT: Verify empty state is displayed
    await waitFor(() => {
      expect(screen.getByText("No products found")).toBeInTheDocument();
      expect(
        screen.getByText("Try different keywords or check spelling")
      ).toBeInTheDocument();
    });
  });

  // Test 6: Doesn't search with short queries
  it("doesn't trigger search for queries shorter than 3 characters", async () => {
    // ARRANGE: Render the component
    render(<NavbarSearch />);

    // ACT: Type a short search query
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    fireEvent.change(searchInput, { target: { value: "ab" } });

    // ASSERT: Verify search was not called
    await waitFor(() => {
      expect(searchProducts).not.toHaveBeenCalled();
    });

    // ACT: Now type a longer query
    fireEvent.change(searchInput, { target: { value: "abc" } });

    // ASSERT: Verify search was called this time
    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith("abc");
    });
  });

  // Test 7: Closes results when clicking outside
  it("closes search results when clicking outside", async () => {
    // ARRANGE: Mock search results
    const mockResults = [
      { id: "product1", name: "Test Product", price: 129.99 },
    ];

    searchProducts.mockResolvedValueOnce(mockResults);

    // Render the component
    render(<NavbarSearch />);

    // ACT: Type search query to show results
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    // ACT: Click outside the search component
    fireEvent.mouseDown(document.body);

    // ASSERT: Verify results are hidden
    await waitFor(() => {
      expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
    });
  });

  // Test 8: Form submission behavior
  it("navigates to search results page on form submission", async () => {
    // ARRANGE: Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: jest.fn() };

    // Render the component
    render(<NavbarSearch />);

    // ACT: Type search query and submit the form
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    const searchForm = searchInput.closest("form");

    fireEvent.change(searchInput, { target: { value: "bracelet search" } });
    fireEvent.submit(searchForm);

    // ASSERT: Verify navigation to search results page
    expect(window.location.href).toBe("/products?q=bracelet%20search");

    // Restore window.location
    window.location = originalLocation;
  });

  // Test 9: Handles product selection
  it("navigates to the product page when a search result is clicked", async () => {
    // ARRANGE: Mock search results
    const mockResults = [
      {
        id: "product1",
        name: "Test Product",
        price: 129.99,
        collectionId: "collection1",
        image: "/test-image.jpg",
      },
    ];

    searchProducts.mockResolvedValueOnce(mockResults);

    // Mock window.location.href
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: jest.fn() };

    // Render the component
    render(<NavbarSearch />);

    // ACT: Type search query to show results
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });

    // ACT: Click on a search result
    fireEvent.click(screen.getByText("Test Product"));

    // ASSERT: Verify navigation to product page
    expect(window.location.href).toBe(
      "/collections/collection1/products/product1"
    );

    // Restore window.location
    window.location = originalLocation;
  });

  // Test 10: Debounces search requests
  it("debounces search requests to avoid too many API calls", async () => {
    // ARRANGE: Set up jest fake timers
    jest.useFakeTimers();

    // Mock the search function
    searchProducts.mockResolvedValue([]);

    // Render the component
    render(<NavbarSearch />);

    // ACT: Type search query characters in rapid succession
    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    fireEvent.change(searchInput, { target: { value: "a" } });
    fireEvent.change(searchInput, { target: { value: "ab" } });
    fireEvent.change(searchInput, { target: { value: "abc" } });
    fireEvent.change(searchInput, { target: { value: "abcd" } });

    // ASSERT: Verify search was not called immediately
    expect(searchProducts).not.toHaveBeenCalled();

    // ACT: Fast-forward timers to trigger debounced function
    jest.advanceTimersByTime(300);

    // ASSERT: Verify search was called only once with the final value
    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledTimes(1);
      expect(searchProducts).toHaveBeenCalledWith("abcd");
    });

    // Clean up
    jest.useRealTimers();
  });
});
