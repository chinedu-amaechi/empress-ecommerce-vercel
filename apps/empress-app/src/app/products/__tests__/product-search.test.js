// src/app/products/__tests__/product-search.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProductSearch from '../product-search';
import { searchProducts } from '@/lib/product-service';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock product service
jest.mock('@/lib/product-service', () => ({
  searchProducts: jest.fn(),
}));

describe("ProductSearch Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock router
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the search input", () => {
    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "text");
  });

  it("shows no results initially", () => {
    render(<ProductSearch />);

    // Results dropdown should not be visible initially
    expect(screen.queryByText("No products found")).not.toBeInTheDocument();
    expect(screen.queryByText("View all results")).not.toBeInTheDocument();
  });

  it("triggers search after typing at least 3 characters", async () => {
    searchProducts.mockResolvedValue([]);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type less than 3 characters
    fireEvent.change(searchInput, { target: { value: "br" } });

    // Search should not be triggered yet
    expect(searchProducts).not.toHaveBeenCalled();

    // Type 3 characters
    fireEvent.change(searchInput, { target: { value: "bra" } });

    // Wait for debounce
    await waitFor(() => {
      expect(searchProducts).toHaveBeenCalledWith("bra");
    });
  });

  it("displays search results", async () => {
    const mockResults = [
      {
        id: "1",
        name: "Bracelet 1",
        price: 99.99,
        collectionId: "ethereal",
        collectionName: "Ethereal",
      },
      {
        id: "2",
        name: "Bracelet 2",
        price: 129.99,
        collectionId: "divine",
        collectionName: "Divine",
      },
    ];

    searchProducts.mockResolvedValue(mockResults);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    });

    // Check both results are displayed
    expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 2")).toBeInTheDocument();

    // Check collection names are displayed
    expect(screen.getByText("Ethereal")).toBeInTheDocument();
    expect(screen.getByText("Divine")).toBeInTheDocument();

    // Check prices are displayed
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("$129.99")).toBeInTheDocument();

    // View all results link should be present
    expect(screen.getByText("View all results")).toBeInTheDocument();
  });

  it('shows "no products found" message when search returns no results', async () => {
    searchProducts.mockResolvedValue([]);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "nonexistent" } });

    // Wait for no results message
    await waitFor(() => {
      expect(screen.getByText("No products found")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Try different keywords or check spelling")
    ).toBeInTheDocument();
  });

  it("navigates to product page when clicking a result", async () => {
    const mockResults = [
      {
        id: "1",
        name: "Bracelet 1",
        price: 99.99,
        collectionId: "ethereal",
        collectionName: "Ethereal",
      },
    ];

    searchProducts.mockResolvedValue(mockResults);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    });

    // Click on the result
    fireEvent.click(screen.getByText("Bracelet 1"));

    // Router should have been called to navigate to the product
    expect(mockPush).toHaveBeenCalledWith("/collections/ethereal/products/1");
  });

  it("submits search form when pressing enter", async () => {
    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Submit the form by pressing Enter
    fireEvent.submit(searchInput);

    // Router should have been called to navigate to search results page
    expect(mockPush).toHaveBeenCalledWith("/products/search?q=bracelet");
  });

  it("shows loading indicator while searching", async () => {
    // Make search delay slightly to see loading indicator
    searchProducts.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve([]), 100);
        })
    );
  
    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Loading indicator should appear
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument(); // The loading spinner SVG

    // Wait for search to complete
    await waitFor(() => {
      expect(
        screen.queryByRole("img", { hidden: true })
      ).not.toBeInTheDocument();
    });
  });

  it("clears results when closing the dropdown", async () => {
    const mockResults = [
      {
        id: "1",
        name: "Bracelet 1",
        price: 99.99,
        collectionId: "ethereal",
        collectionName: "Ethereal",
      },
    ];

    searchProducts.mockResolvedValue(mockResults);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    });

    // Click outside to close dropdown (the document)
    fireEvent.mouseDown(document);

    // Results should no longer be visible
    expect(screen.queryByText("Bracelet 1")).not.toBeInTheDocument();
  });
});