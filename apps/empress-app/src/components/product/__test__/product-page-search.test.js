// src/components/product/__test__/product-page-search.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductPageSearch from "../product-page-search";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({
    get: (param) => {
      if (param === "collection") return "ethereal";
      if (param === "q") return "bracelet";
      return null;
    },
  })),
}));

describe("ProductPageSearch Component", () => {
  const mockCollections = [
    { id: "ethereal", name: "Ethereal" },
    { id: "divine", name: "Divine" },
    { id: "heritage", name: "Heritage" },
  ];

  const mockInitialFilters = {
    collection: "ethereal",
    priceRange: "all",
    sortBy: "featured",
  };

  const mockOnFilterChange = jest.fn();
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with initial query and filters", () => {
    render(
      <ProductPageSearch
        initialQuery="bracelet"
        initialFilters={mockInitialFilters}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    // Check that search input has initial value
    const searchInput = screen.getByPlaceholderText("Filter products...");
    expect(searchInput).toHaveValue("bracelet");

    // Check that collection filter has initial value
    const collectionFilter = screen.getByLabelText("Collection");
    expect(collectionFilter).toHaveValue("ethereal");

    // Check that price range filter has initial value
    const priceFilter = screen.getByLabelText("Price Range");
    expect(priceFilter).toHaveValue("all");

    // Check that sort filter has initial value
    const sortFilter = screen.getByLabelText("Sort By");
    expect(sortFilter).toHaveValue("featured");
  });

  it("displays active filters", () => {
    render(
      <ProductPageSearch
        initialQuery="bracelet"
        initialFilters={mockInitialFilters}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    // Active collection filter should be displayed
    expect(screen.getByText(/Collection: Ethereal/)).toBeInTheDocument();

    // Active search filter should be displayed
    expect(screen.getByText(/Search: "bracelet"/)).toBeInTheDocument();
  });

  it("calls onSearchChange when typing in search input", () => {
    render(
      <ProductPageSearch
        initialQuery=""
        initialFilters={mockInitialFilters}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    const searchInput = screen.getByPlaceholderText("Filter products...");

    // Type in search input
    fireEvent.change(searchInput, { target: { value: "new search" } });

    // onSearchChange should be called with new value
    expect(mockOnSearchChange).toHaveBeenCalledWith("new search");
  });

  it("calls onFilterChange when changing collection filter", () => {
    render(
      <ProductPageSearch
        initialQuery="bracelet"
        initialFilters={mockInitialFilters}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    const collectionFilter = screen.getByLabelText("Collection");

    // Change collection filter
    fireEvent.change(collectionFilter, { target: { value: "divine" } });

    // onFilterChange should be called with updated filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      collection: "divine",
    });
  });

  it("calls onFilterChange when changing price range filter", () => {
    render(
      <ProductPageSearch
        initialQuery="bracelet"
        initialFilters={mockInitialFilters}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    const priceFilter = screen.getByLabelText("Price Range");

    // Change price range filter
    fireEvent.change(priceFilter, { target: { value: "100-200" } });

    // onFilterChange should be called with updated filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      priceRange: "100-200",
    });
  });

  it("calls onFilterChange when changing sort filter", () => {
    render(
      <ProductPageSearch
        initialQuery="bracelet"
        initialFilters={mockInitialFilters}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    const sortFilter = screen.getByLabelText("Sort By");

    // Change sort filter
    fireEvent.change(sortFilter, { target: { value: "price-low" } });

    // onFilterChange should be called with updated filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      sortBy: "price-low",
    });
  });

  it("clears a specific filter when clicking its remove button", () => {
    render(
      <ProductPageSearch
        initialQuery="bracelet"
        initialFilters={mockInitialFilters}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    // Get collection filter remove button
    const removeCollectionButton =
      screen.getByText(/Collection: Ethereal/).nextSibling;

    // Click remove button
    fireEvent.click(removeCollectionButton);

    // onFilterChange should be called with updated filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...mockInitialFilters,
      collection: "all",
    });

    // Get search filter remove button
    const removeSearchButton =
      screen.getByText(/Search: "bracelet"/).nextSibling;

    // Click remove button
    fireEvent.click(removeSearchButton);

    // onSearchChange should be called with empty string
    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });

  it("clears all filters when clicking clear all button", () => {
    // Set a price range to have multiple active filters
    const filtersWithPrice = {
      ...mockInitialFilters,
      priceRange: "100-200",
    };

    render(
      <ProductPageSearch
        initialQuery="bracelet"
        initialFilters={filtersWithPrice}
        collections={mockCollections}
        onFilterChange={mockOnFilterChange}
        onSearchChange={mockOnSearchChange}
      />
    );

    // Clear all button should be visible
    const clearAllButton = screen.getByText("Clear all");
    expect(clearAllButton).toBeInTheDocument();

    // Click clear all button
    fireEvent.click(clearAllButton);

    // onFilterChange should be called with default filters
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      collection: "all",
      priceRange: "all",
      sortBy: "featured",
    });

    // onSearchChange should be called with empty string
    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });
});
