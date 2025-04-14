// apps/empress-admin-app/src/pages/__tests__/ProductPage.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductPage from "../ProductPage";
import useProducts from "../../hooks/useProducts";
import { deleteProduct } from "../../services/products";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("../../hooks/useProducts", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../services/products", () => ({
  deleteProduct: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock components
jest.mock("../../features/product/ProductsTable", () => {
  return function MockProductsTable({ rows, setSelectedRowId }) {
    return (
      <div data-testid="products-table">
        <button onClick={() => setSelectedRowId("1")}>Select Row 1</button>
        <button onClick={() => setSelectedRowId(null)}>Clear Selection</button>
        <div>Products: {rows.length}</div>
      </div>
    );
  };
});

jest.mock("../../ui/Modal", () => {
  const MockModal = ({ children }) => <div data-testid="modal">{children}</div>;
  MockModal.Window = () => <div data-testid="modal-window"></div>;
  MockModal.Open = ({ children, content }) => (
    <div data-testid="modal-open" data-content={content}>
      {children}
    </div>
  );
  MockModal.Close = ({ children }) => (
    <div data-testid="modal-close">{children}</div>
  );
  return MockModal;
});

jest.mock("../../ui/Spinner", () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock("../../features/product/ProductForm", () => {
  return function MockProductForm() {
    return <div data-testid="product-form">Add Product Form</div>;
  };
});

jest.mock("../../ui/ConfirmDelete", () => {
  return function MockConfirmDelete({ onDelete }) {
    return (
      <div data-testid="confirm-delete">
        Confirm Delete
        <button onClick={onDelete}>Delete</button>
      </div>
    );
  };
});

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper function to create a wrapper with QueryClientProvider
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

describe("ProductPage Component", () => {
  // Sample mock data
  const mockProducts = [
    {
      _id: "1",
      id: "1",
      name: "Product 1",
      price: 99.99,
      stock: 10,
      description: "Test description",
    },
    {
      _id: "2",
      id: "2",
      name: "Product 2",
      price: 149.99,
      stock: 5,
      description: "Another test description",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading spinner when products are loading", () => {
    // Mock loading state
    useProducts.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<ProductPage />);

    // Should display spinner
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("displays error message when there is an error loading products", () => {
    // Mock error state
    useProducts.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to load products"),
    });

    renderWithProviders(<ProductPage />);

    // Should display error message
    expect(
      screen.getByText(/Error: Failed to load products/),
    ).toBeInTheDocument();
  });

  it("renders product list when data is loaded", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductPage />);

    // Verify products list title is displayed
    expect(screen.getByText("Products List")).toBeInTheDocument();

    // Verify products table is displayed
    expect(screen.getByTestId("products-table")).toBeInTheDocument();

    // Verify product count
    expect(screen.getByText("Products: 2")).toBeInTheDocument();
  });

  it("handles selecting a product row", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductPage />);

    // Initially no row is selected, so actions should not be visible
    expect(screen.queryByText("View")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    // Select a row
    fireEvent.click(screen.getByText("Select Row 1"));

    // Now action buttons should be visible
    await waitFor(() => {
      expect(screen.getByText("View")).toBeInTheDocument();
      expect(screen.getByText("Delete")).toBeInTheDocument();
    });
  });

  it("navigates to product details when view button is clicked", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductPage />);

    // Select a row
    fireEvent.click(screen.getByText("Select Row 1"));

    // Click view button
    await waitFor(() => {
      fireEvent.click(screen.getByText("View"));
    });

    // Should navigate to product details page
    expect(mockNavigate).toHaveBeenCalledWith("/products/1");
  });

  it("deletes product when delete is confirmed", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    // Mock successful delete
    deleteProduct.mockResolvedValue({
      status: 200,
      message: "Product deleted successfully",
    });

    renderWithProviders(<ProductPage />);

    // Select a row
    fireEvent.click(screen.getByText("Select Row 1"));

    // Click delete button to open confirm dialog
    await waitFor(() => {
      fireEvent.click(screen.getByText("Delete"));
    });

    // Confirm delete dialog should be shown
    expect(screen.getByTestId("confirm-delete")).toBeInTheDocument();

    // Click delete button in confirm dialog
    fireEvent.click(screen.getByText("Delete"));

    // Verify delete API was called
    expect(deleteProduct).toHaveBeenCalledWith("1");

    // Success toast should be shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Product deleted successfully",
      );
    });
  });

  it("shows error toast when delete fails", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    // Mock failed delete
    deleteProduct.mockResolvedValue({
      status: 400,
      message: "Failed to delete product",
    });

    renderWithProviders(<ProductPage />);

    // Select a row
    fireEvent.click(screen.getByText("Select Row 1"));

    // Click delete button to open confirm dialog
    await waitFor(() => {
      fireEvent.click(screen.getByText("Delete"));
    });

    // Confirm delete
    fireEvent.click(screen.getByText("Delete"));

    // Error toast should be shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to delete product");
    });
  });

  it("filters products based on search term", async () => {
    // Mock successful data loading
    useProducts.mockReturnValue({
      data: mockProducts,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<ProductPage />);

    // Enter search term
    fireEvent.change(screen.getByPlaceholderText("Search products..."), {
      target: { value: "Product 1" },
    });

    // After search, filtered products should be displayed
    await waitFor(() => {
      expect(screen.getByText("Products: 1")).toBeInTheDocument();
    });
  });
});
