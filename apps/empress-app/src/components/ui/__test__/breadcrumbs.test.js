// src/components/ui/__test__/breadcrumb.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Breadcrumb from "../breadcrumb";

// Mock dependencies
jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/collections/ethereal"),
  useSearchParams: jest.fn().mockReturnValue({
    get: (param) => {
      if (param === "collection") return "ethereal";
      return null;
    },
  }),
}));

// Mock the Link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock the ChevronRight component
jest.mock("lucide-react", () => ({
  ChevronRight: () => <span data-testid="chevron-icon">/</span>,
}));

describe("Breadcrumb Component", () => {
  // Test 1: Renders default breadcrumb path
  it("renders default breadcrumb items when no specific items are provided", () => {
    // ARRANGE: Render the breadcrumb component without custom items
    render(<Breadcrumb />);

    // ACT: Find breadcrumb elements
    const homeLink = screen.getByText("Home");
    const collectionsLink = screen.getByText("Collections");
    const separators = screen.getAllByTestId("chevron-icon");

    // ASSERT: Verify default breadcrumb structure
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");

    expect(collectionsLink).toBeInTheDocument();
    expect(collectionsLink).toHaveAttribute("href", "/collections");

    // Should have 1 separator between Home and Collections
    expect(separators.length).toBe(1);
  });

  // Test 2: Renders custom breadcrumb items
  it("renders custom breadcrumb items when provided", () => {
    // ARRANGE: Create custom breadcrumb items
    const customItems = [
      { label: "Custom Home", href: "/custom" },
      { label: "Category", href: "/custom/category" },
      { label: "Product", href: "/custom/category/product", active: true },
    ];

    // Render with custom items
    render(<Breadcrumb items={customItems} />);

    // ACT: Find the custom breadcrumb elements
    const homeLink = screen.getByText("Custom Home");
    const categoryLink = screen.getByText("Category");
    const productText = screen.getByText("Product"); // This should not be a link
    const separators = screen.getAllByTestId("chevron-icon");

    // ASSERT: Verify custom breadcrumb structure
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/custom");

    expect(categoryLink).toBeInTheDocument();
    expect(categoryLink).toHaveAttribute("href", "/custom/category");

    expect(productText).toBeInTheDocument();
    expect(productText).not.toHaveAttribute("href"); // Active item should not be a link

    // Should have 2 separators
    expect(separators.length).toBe(2);
  });

  // Test 3: Adds current collection to breadcrumb
  it("adds the current collection to the breadcrumb trail", () => {
    // ARRANGE: Render breadcrumb with a current collection
    render(<Breadcrumb currentCollection="ethereal" />);

    // ACT: Find all breadcrumb items
    const homeLink = screen.getByText("Home");
    const collectionsLink = screen.getByText("Collections");
    const collectionText = screen.getByText("Ethereal"); // Current collection, should be formatted
    const separators = screen.getAllByTestId("chevron-icon");

    // ASSERT: Verify breadcrumb with collection
    expect(homeLink).toBeInTheDocument();
    expect(collectionsLink).toBeInTheDocument();
    expect(collectionText).toBeInTheDocument();

    // Current collection should have the active styling and not be a link
    expect(collectionText).toHaveClass("text-[#11296B]");
    expect(collectionText).toHaveClass("font-medium");

    // Should have 2 separators now
    expect(separators.length).toBe(2);
  });

  // Test 4: Formats collection names correctly
  it("properly formats collection names from different formats", () => {
    // ARRANGE: Test multiple collection name formats
    const { rerender } = render(
      <Breadcrumb currentCollection="celestial-bloom" />
    );

    // ACT & ASSERT: Check kebab-case formatting
    expect(screen.getByText("Celestial Bloom")).toBeInTheDocument();

    // Test camelCase formatting
    rerender(<Breadcrumb currentCollection="celestialBloom" />);
    expect(screen.getByText("CelestialBloom")).toBeInTheDocument();

    // Test simple capitalization
    rerender(<Breadcrumb currentCollection="heritage" />);
    expect(screen.getByText("Heritage")).toBeInTheDocument();
  });

  // Test 5: Handles empty collection name
  it("does not add empty collection name to breadcrumb", () => {
    // ARRANGE: Render with empty currentCollection
    render(<Breadcrumb currentCollection="" />);

    // ACT: Count breadcrumb elements
    const breadcrumbItems = screen.getAllByRole("listitem");
    const separators = screen.getAllByTestId("chevron-icon");

    // ASSERT: Only Home and Collections should be present
    expect(breadcrumbItems.length).toBe(2);
    expect(separators.length).toBe(1);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Collections")).toBeInTheDocument();
  });

  // Test 6: Prevents duplicate breadcrumb items
  it("prevents duplicate items when collection is already in custom items", () => {
    // ARRANGE: Create custom items that include a collection
    const customItems = [
      { label: "Home", href: "/" },
      { label: "Collections", href: "/collections" },
      {
        label: "Ethereal",
        href: "/collections?collection=ethereal",
        active: true,
      },
    ];

    // Render with both custom items and currentCollection
    render(<Breadcrumb items={customItems} currentCollection="ethereal" />);

    // ACT: Get all instances of "Ethereal"
    const etherealElements = screen.getAllByText("Ethereal");

    // ASSERT: Should only be one instance of "Ethereal"
    expect(etherealElements.length).toBe(1);
  });

  // Test 7: Renders breadcrumb with correct ARIA attributes
  it("includes proper ARIA attributes for accessibility", () => {
    // ARRANGE: Render the component
    render(<Breadcrumb />);

    // ACT: Find the navigation element
    const nav = screen.getByLabelText("Breadcrumb");

    // ASSERT: Verify accessibility attributes
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-label", "Breadcrumb");
  });

  // Test 8: Links are clickable
  it("makes breadcrumb links clickable", async () => {
    // ARRANGE: Set up user events and render component
    const user = userEvent.setup();
    render(<Breadcrumb />);

    // Get the Home link
    const homeLink = screen.getByText("Home");

    // ACT: Attempt to click the link
    await user.click(homeLink);

    // ASSERT: The link should have the correct href
    expect(homeLink).toHaveAttribute("href", "/");
    // We can't test navigation in this test environment
  });

  // Test 9: Handles very deep navigation paths
  it("handles deep navigation paths correctly", () => {
    // ARRANGE: Create a deep navigation path
    const deepPath = [
      { label: "Home", href: "/" },
      { label: "Category", href: "/category" },
      { label: "Subcategory", href: "/category/subcategory" },
      { label: "Collection", href: "/category/subcategory/collection" },
      {
        label: "Product",
        href: "/category/subcategory/collection/product",
        active: true,
      },
    ];

    // Render with deep path
    render(<Breadcrumb items={deepPath} />);

    // ACT: Find all list items and separators
    const items = screen.getAllByRole("listitem");
    const separators = screen.getAllByTestId("chevron-icon");

    // ASSERT: Verify deep path structure
    expect(items.length).toBe(5); // All items should be present
    expect(separators.length).toBe(4); // All separators should be present

    // Last item should be active (not a link)
    const productItem = screen.getByText("Product");
    expect(productItem).toHaveClass("text-[#11296B]");
    expect(productItem).toHaveClass("font-medium");
  });

  // Test 10: Applies responsive layout for mobile
  it("applies responsive styling for different screen sizes", () => {
    // ARRANGE: Render the component
    render(<Breadcrumb />);

    // ACT: Get the breadcrumb wrapper elements
    const nav = screen.getByLabelText("Breadcrumb");
    const listItems = screen.getAllByRole("listitem");

    // ASSERT: Check for responsive classes
    expect(nav).toHaveClass("py-4");
    expect(nav).toHaveClass("px-4");
    expect(nav).toHaveClass("sm:px-6");
    expect(nav).toHaveClass("lg:px-0");

    // List items should have flex classes
    expect(listItems[0]).toHaveClass("flex");
    expect(listItems[0]).toHaveClass("items-center");
  });
});
