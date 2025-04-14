// src/app/collections/__test__/page.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import Collections from "../page";

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

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
  },
  AnimatePresence: ({ children }) => <div>{children}</div>,
}));

// Mock components
jest.mock("../collection-navigator", () => {
  return function MockCollectionNavigator() {
    return <div data-testid="collection-navigator">Collection Navigator</div>;
  };
});

jest.mock("../scroll-progress", () => {
  return function MockScrollProgress() {
    return <div data-testid="scroll-progress">Scroll Progress</div>;
  };
});

jest.mock("../collection-navigation-header", () => {
  return function MockCollectionNavigationHeader() {
    return (
      <div data-testid="collection-nav-header">
        Collection Navigation Header
      </div>
    );
  };
});

jest.mock("../collection-introduction", () => {
  return function MockCollectionIntroduction({ collection }) {
    return (
      <div data-testid="collection-intro">{collection.name} Introduction</div>
    );
  };
});

jest.mock("../collection-featured-product", () => {
  return function MockCollectionFeaturedProduct({ collection }) {
    return (
      <div data-testid="collection-featured">
        {collection.name} Featured Product
      </div>
    );
  };
});

jest.mock("../collection-products", () => {
  return function MockCollectionProducts({ collection, products }) {
    return (
      <div data-testid="collection-products">
        {collection.name} Products ({products.length})
      </div>
    );
  };
});

jest.mock("@/components/layout/footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

// Mock hooks
jest.mock("@/hooks/use-collections", () => () => ({
  data: [
    {
      _id: "1",
      name: "Ethereal",
      imageUrl: { optimizeUrl: "/ethereal.jpg" },
      products: ["p1", "p2"],
    },
    {
      _id: "2",
      name: "Divine",
      imageUrl: { optimizeUrl: "/divine.jpg" },
      products: ["p3", "p4"],
    },
  ],
  isLoading: false,
  error: null,
}));

jest.mock("@/hooks/use-products", () => () => ({
  data: [
    { _id: "p1", name: "Product 1", collectionId: "1" },
    { _id: "p2", name: "Product 2", collectionId: "1" },
    { _id: "p3", name: "Product 3", collectionId: "2" },
    { _id: "p4", name: "Product 4", collectionId: "2" },
  ],
  isLoading: false,
  error: null,
}));

describe("Collections Page", () => {
  beforeEach(() => {
    // Setup mocks
    jest.clearAllMocks();

    // Mock useSearchParams
    useSearchParams.mockReturnValue({
      get: (param) => (param === "collection" ? "Ethereal" : null),
    });

    // Mock window.scrollTo
    window.scrollTo = jest.fn();

    // Mock window.history.pushState
    window.history.pushState = jest.fn();
  });

  it("renders loading state when collections are loading", () => {
    // Override the useCollections mock for this test
    require("@/hooks/use-collections").default.mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<Collections />);

    expect(screen.getByText("Loading collections...")).toBeInTheDocument();
  });

  it("renders error state when there is an error loading collections", () => {
    // Override the useCollections mock for this test
    require("@/hooks/use-collections").default.mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error("Failed to load"),
    });

    render(<Collections />);

    expect(screen.getByText("Error loading collections")).toBeInTheDocument();
  });

  it("renders the collections page with correct components", () => {
    render(<Collections />);

    // Check navigation and structure components
    expect(screen.getByTestId("scroll-progress")).toBeInTheDocument();
    expect(screen.getByTestId("collection-nav-header")).toBeInTheDocument();
    expect(screen.getByAltText("Empress Logo")).toBeInTheDocument();

    // Check collection content components
    expect(screen.getByTestId("collection-intro")).toBeInTheDocument();
    expect(screen.getByText("Ethereal Introduction")).toBeInTheDocument();

    expect(screen.getByTestId("collection-featured")).toBeInTheDocument();
    expect(screen.getByText("Ethereal Featured Product")).toBeInTheDocument();

    expect(screen.getByTestId("collection-products")).toBeInTheDocument();
    expect(screen.getByText("Ethereal Products (2)")).toBeInTheDocument();

    expect(screen.getByTestId("collection-navigator")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("displays other collections section", () => {
    render(<Collections />);

    expect(screen.getByText("Explore Other")).toBeInTheDocument();
    expect(screen.getByText("Collections")).toBeInTheDocument();
  });
});
