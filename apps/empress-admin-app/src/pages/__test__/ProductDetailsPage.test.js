// apps/empress-admin-app/src/pages/__tests__/ProductDetailsPage.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useParams } from "react-router-dom";
import ProductDetailsPage from "../ProductDetailsPage";
import useProducts from "../../hooks/useProducts";
import useCollections from "../../hooks/useCollections";

// Mock hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../hooks/useProducts", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../hooks/useCollections", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock components
jest.mock("../../ui/Heading", () => {
  return function MockHeading({ level, text }) {
    return <h2 data-testid={`heading-${level}`}>{text}</h2>;
  };
});

jest.mock("../../ui/Spinner", () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock("../../features/product/ProductOverview", () => {
  return function MockProductOverview({ productData, collectionsData }) {
    return (
      <div data-testid="product-overview">
        Product Overview: {productData.name}
      </div>
    );
  };
});

jest.mock("../../features/product/ProductEdit", () => {
  return function MockProductEdit({ productData }) {
    return (
      <div data-testid="product-edit">Product Edit: {productData.name}</div>
    );
  };
});

jest.mock("../../features/product/ProductForm", () => {
  return function MockProductForm() {
    return <div data-testid="product-form">Add Product Form</div>;
  };
});

jest.mock("@mui/icons-material", () => ({
  Add: () => <span data-testid="add-icon">+</span>,
  Details: () => <span data-testid="details-icon">i</span>,
  Edit: () => <span data-testid="edit-icon">✎</span>,
}));

jest.mock("../../ui/Modal", () => {
  const MockModal = ({ children }) => <div data-testid="modal">{children}</div>;
  MockModal.Window = () => <div data-testid="modal-window"></div>;
  MockModal.Open = ({ children, content }) => (
    <div data-testid="modal-open" data-content={content ? "true" : "false"}>
      {children}
    </div>
  );
  return MockModal;
});

// Helper function to create a wrapper with QueryClientProvider and BrowserRouter
const renderWithProviders = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>,
  );
};

describe("ProductDetailsPage Component", () => {
  // Mock product and collections data
  const mockProductId = "product123";
  const mockProduct = {
    _id: mockProductId,
    name: "Test Product",
    price: 99.99,
    stock: 10,
    description: "Test description",
  };

  const mockCollections = [
    { _id: "collection1", name: "Collection 1" },
    { _id: "collection2", name: "Collection 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useParams to return the product ID
    useParams.mockReturnValue({ id: mockProductId });
  });

  it("displays loading spinner when data is loading", () => {
    // Mock loading state
    useProducts.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    useCollections.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<ProductDetailsPage />);

    // Check spinner is displayed
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("displays error message when there is an error loading data", () => {
    // Mock error state
    useProducts.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: "Failed to load products" },
    });

    useCollections.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductDetailsPage />);

    // Check error message is displayed
    expect(
      screen.getByText("An error occurred. Please try again later."),
    ).toBeInTheDocument();
  });

  it("renders product details when data is loaded", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: [mockProduct],
      isLoading: false,
      error: null,
    });

    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductDetailsPage />);

    // Check product name is displayed
    expect(screen.getByText("TEST PRODUCT")).toBeInTheDocument();

    // Check overview tab is active by default
    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(screen.queryByTestId("product-edit")).not.toBeInTheDocument();
  });

  it("switches between overview and edit tabs", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: [mockProduct],
      isLoading: false,
      error: null,
    });

    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductDetailsPage />);

    // Overview tab should be active initially
    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(screen.queryByTestId("product-edit")).not.toBeInTheDocument();

    // Click edit tab
    fireEvent.click(screen.getByText("Edit"));

    // Edit tab should now be active
    expect(screen.queryByTestId("product-overview")).not.toBeInTheDocument();
    expect(screen.getByTestId("product-edit")).toBeInTheDocument();

    // Click overview tab again
    fireEvent.click(screen.getByText("Overview"));

    // Overview tab should be active again
    expect(screen.getByTestId("product-overview")).toBeInTheDocument();
    expect(screen.queryByTestId("product-edit")).not.toBeInTheDocument();
  });

  it("opens modal with ProductForm when Add Product button is clicked", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: [mockProduct],
      isLoading: false,
      error: null,
    });

    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductDetailsPage />);

    // Click Add Product button
    fireEvent.click(screen.getByText("Add Product"));

    // Modal content should be rendered
    expect(screen.getByTestId("modal-open")).toBeInTheDocument();

    // Check product form is included
    expect(screen.getByTestId("product-form")).toBeInTheDocument();
  });
});
