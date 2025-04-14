// src/components/product/__test__/product-search.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductSearch from "../product-search";
import { searchProducts } from "@/lib/product-service";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock product service
jest.mock("@/lib/product-service", () => ({
  searchProducts: jest.fn(),
}));

describe("ProductSearch Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the search input", () => {
    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");
    expect(searchInput).toBeInTheDocument();
  });

  it("performs search after typing at least 3 characters", async () => {
    searchProducts.mockResolvedValue([]);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type 2 characters (shouldn't trigger search)
    fireEvent.change(searchInput, { target: { value: "br" } });

    // Wait a bit to ensure no search is triggered
    await new Promise((r) => setTimeout(r, 350));
    expect(searchProducts).not.toHaveBeenCalled();

    // Type a third character
    fireEvent.change(searchInput, { target: { value: "bra" } });

    // Now search should be triggered
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
        collectionName: "Ethereal",
        image: "/bracelet1.jpg",
      },
      {
        id: "2",
        name: "Bracelet 2",
        price: 149.99,
        collectionName: "Divine",
        image: "/bracelet2.jpg",
      },
    ];

    searchProducts.mockResolvedValue(mockResults);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Wait for results to be displayed
    await waitFor(() => {
      expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    });

    // Check that both results are displayed
    expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    expect(screen.getByText("Bracelet 2")).toBeInTheDocument();

    // Check that collection names are displayed
    expect(screen.getByText("Ethereal")).toBeInTheDocument();
    expect(screen.getByText("Divine")).toBeInTheDocument();

    // Check that prices are displayed
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("$149.99")).toBeInTheDocument();

    // Check that images are rendered
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(2);
    expect(images[0]).toHaveAttribute("src", "/bracelet1.jpg");
    expect(images[1]).toHaveAttribute("src", "/bracelet2.jpg");

    // View all results link should be present
    expect(screen.getByText("View all results")).toBeInTheDocument();
    expect(screen.getByText("View all results").closest("a")).toHaveAttribute(
      "href",
      "/products/search?q=bracelet"
    );
  });

  it("shows no results message when search returns empty", async () => {
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

  it("navigates when a search result is clicked", async () => {
    const mockResults = [
      {
        id: "1",
        name: "Bracelet 1",
        price: 99.99,
        collectionId: "ethereal",
        collectionName: "Ethereal",
        image: "/bracelet1.jpg",
      },
    ];

    searchProducts.mockResolvedValue(mockResults);

    const mockNavigate = jest.fn();
    require("next/navigation").useRouter.mockReturnValue({
      push: mockNavigate,
    });

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    });

    // Click on result
    fireEvent.click(screen.getByText("Bracelet 1").closest("li"));

    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith(
      "/collections/ethereal/products/1"
    );
  });

  it("submits search form on enter key", () => {
    const mockNavigate = jest.fn();
    require("next/navigation").useRouter.mockReturnValue({
      push: mockNavigate,
    });

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Submit form
    fireEvent.submit(searchInput);

    // Check that navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/products/search?q=bracelet");
  });

  it("closes dropdown when clicking outside", async () => {
    const mockResults = [
      { id: "1", name: "Bracelet 1", price: 99.99, collectionName: "Ethereal" },
    ];

    searchProducts.mockResolvedValue(mockResults);

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Bracelet 1")).toBeInTheDocument();
    });

    // Click outside search component
    fireEvent.mouseDown(document.body);

    // Results should be hidden
    expect(screen.queryByText("Bracelet 1")).not.toBeInTheDocument();
  });

  it("shows loading state during search", async () => {
    // Make search take some time
    searchProducts.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(<ProductSearch />);

    const searchInput = screen.getByPlaceholderText("Search for bracelets...");

    // Type search query
    fireEvent.change(searchInput, { target: { value: "bracelet" } });

    // Loading spinner should be visible
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();

    // Wait for search to complete
    await waitFor(() => {
      expect(
        screen.queryByRole("img", { hidden: true })
      ).not.toBeInTheDocument();
    });
  });
});
