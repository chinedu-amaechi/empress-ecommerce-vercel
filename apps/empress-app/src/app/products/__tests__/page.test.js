// src/app/products/__tests__/page.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import ProductsPage from "../page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({ push: jest.fn() })),
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

// Mock components
jest.mock("@/components/ui/navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar Component</div>;
  };
});

jest.mock("@/components/layout/footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock("@/components/ui/heading", () => ({
  __esModule: true,
  default: ({ children, level }) => <h1 data-level={level}>{children}</h1>,
}));

jest.mock("../product-search", () => {
  return function MockProductSearch() {
    return <div data-testid="product-search">Product Search</div>;
  };
});

jest.mock("@/components/product/product-card", () => {
  return function MockProductCard({ product }) {
    return (
      <div data-testid={`product-card-${product._id}`}>{product.name}</div>
    );
  };
});

// Mock hooks and services
jest.mock("@/hooks/use-collections", () => () => ({
  data: [
    { id: "1", name: "Ethereal" },
    { id: "2", name: "Divine" },
  ],
  isLoading: false,
  error: null,
}));

// Mock product service functions
jest.mock("@/lib/product-service", () => ({
  getAllProducts: jest.fn().mockResolvedValue([
    {
      _id: "p1",
      name: "Product 1",
      price: 99.99,
      collectionId: "1",
      collectionName: "Ethereal",
    },
    {
      _id: "p2",
      name: "Product 2",
      price: 129.99,
      collectionId: "1",
      collectionName: "Ethereal",
    },
    {
      _id: "p3",
      name: "Product 3",
      price: 149.99,
      collectionId: "2",
      collectionName: "Divine",
    },
  ]),
  getProductsByCollection: jest.fn(),
}));

describe("ProductsPage Component", () => {
  beforeEach(() => {
    // Setup mocks
    jest.clearAllMocks();

    // Mock useSearchParams
    useSearchParams.mockReturnValue({
      get: (param) => {
        if (param === "collection") return "1";
        if (param === "q") return "bracelet";
        return null;
      },
    });
  });

  it("renders the products page structure", async () => {
    render(<ProductsPage />);

    // Wait for products to load
    await screen.findByText("Product 1");

    // Check basic structure
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText(/Discover our collection of/)).toBeInTheDocument();
    expect(screen.getByTestId("product-search")).toBeInTheDocument();
  });

  it("renders filter options", async () => {
    render(<ProductsPage />);

    // Check filter selectors
    expect(screen.getByLabelText("Collection")).toBeInTheDocument();
    expect(screen.getByLabelText("Price Range")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();

    // Check for collection options
    expect(screen.getByText("All Collections")).toBeInTheDocument();
    expect(screen.getByText("Ethereal")).toBeInTheDocument();
    expect(screen.getByText("Divine")).toBeInTheDocument();
  });

  it("displays active filters", async () => {
    render(<ProductsPage />);

    // Check active filters
    expect(screen.getByText(/Collection:/)).toBeInTheDocument();
    expect(screen.getByText(/Search: "bracelet"/)).toBeInTheDocument();
  });

  it("renders product cards for filtered products", async () => {
    render(<ProductsPage />);

    // Wait for products to load and filter
    await screen.findByText("Product 1");

    // All products should be initially shown (since we mock the filtering)
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("Product 3")).toBeInTheDocument();
  });

  it("shows loading state while fetching products", async () => {
    // Override the getAllProducts mock for this test
    require("@/lib/product-service").getAllProducts.mockImplementationOnce(
      () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([]);
          }, 10);
        });
      }
    );

    render(<ProductsPage />);

    // Loading spinner should be shown
    expect(screen.getByClass("animate-spin")).toBeInTheDocument();
  });

  it("shows empty state when no products match filters", async () => {
    // Override the getAllProducts mock for this test to return empty array
    require("@/lib/product-service").getAllProducts.mockResolvedValueOnce([]);

    render(<ProductsPage />);

    // Wait for no products message
    await screen.findByText("No products found");

    expect(
      screen.getByText("Try adjusting your filters or search query")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear all filters" })
    ).toBeInTheDocument();
  });
});
