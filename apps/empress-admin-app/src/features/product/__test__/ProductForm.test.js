// apps/empress-admin-app/src/features/product/__tests__/ProductForm.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductForm from "../ProductForm";
import { postNewProduct } from "../../../services/products";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("../../../services/products", () => ({
  postNewProduct: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Helper function to create a wrapper with QueryClientProvider
const renderWithQueryClient = (ui) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("ProductForm Component", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all required fields", () => {
    renderWithQueryClient(<ProductForm />);

    // Check heading and form structure
    expect(screen.getByText("Add Product")).toBeInTheDocument();

    // Check for all form fields
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Visibility/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Summary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();

    // Check for submit button
    expect(
      screen.getByRole("button", { name: "Add Product" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    renderWithQueryClient(<ProductForm />);

    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    // Check for validation error messages
    await waitFor(() => {
      expect(screen.getByText("Product name is required")).toBeInTheDocument();
      expect(screen.getByText("Price is required")).toBeInTheDocument();
      expect(screen.getByText("Stock is required")).toBeInTheDocument();
      expect(screen.getByText("Summary is required")).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });
  });

  it("validates price format", async () => {
    renderWithQueryClient(<ProductForm />);

    // Enter invalid price
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "abc" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    // Check for price validation error
    await waitFor(() => {
      expect(screen.getByText("Invalid price format")).toBeInTheDocument();
    });
  });

  it("submits the form with valid data", async () => {
    // Mock successful product creation
    postNewProduct.mockResolvedValue({
      status: 201,
      message: "Product added successfully",
      data: { id: "123", name: "Test Product" },
    });

    renderWithQueryClient(<ProductForm />);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "Test Product" },
    });

    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "99.99" },
    });

    fireEvent.change(screen.getByLabelText(/Stock/i), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByLabelText(/Summary/i), {
      target: { value: "Product summary" },
    });

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Detailed product description" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    // Verify that postNewProduct was called with correct data
    await waitFor(() => {
      expect(postNewProduct).toHaveBeenCalledWith({
        name: "Test Product",
        price: "99.99",
        stock: "10",
        isVisible: true,
        summary: "Product summary",
        description: "Detailed product description",
      });

      // Verify toast message
      expect(toast.success).toHaveBeenCalledWith("Product added successfully");
    });
  });

  it("handles API error response", async () => {
    // Mock API error response
    postNewProduct.mockResolvedValue({
      status: 400,
      message: "Product creation failed",
    });

    renderWithQueryClient(<ProductForm />);

    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "Test Product" },
    });

    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "99.99" },
    });

    fireEvent.change(screen.getByLabelText(/Stock/i), {
      target: { value: "10" },
    });

    fireEvent.change(screen.getByLabelText(/Summary/i), {
      target: { value: "Product summary" },
    });

    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Detailed product description" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Add Product" }));

    // Verify error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Product creation failed");
    });
  });

  it("handles visibility toggle", () => {
    renderWithQueryClient(<ProductForm />);

    // Get the visibility checkbox
    const visibilityCheckbox = screen.getByLabelText(/Product Visibility/i);

    // Should be checked by default
    expect(visibilityCheckbox).toBeChecked();

    // Toggle visibility off
    fireEvent.click(visibilityCheckbox);

    // Should now be unchecked
    expect(visibilityCheckbox).not.toBeChecked();

    // Toggle visibility back on
    fireEvent.click(visibilityCheckbox);

    // Should be checked again
    expect(visibilityCheckbox).toBeChecked();
  });
});
