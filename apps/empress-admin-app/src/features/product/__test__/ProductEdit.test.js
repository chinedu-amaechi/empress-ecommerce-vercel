// apps/empress-admin-app/src/features/product/__tests__/ProductEdit.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductEditPage from "../ProductEdit";
import { updateProduct } from "../../../services/products";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("../../../services/products", () => ({
  updateProduct: jest.fn(),
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

describe("ProductEditPage Component", () => {
  // Sample product data for testing
  const mockProductData = {
    _id: "product123",
    name: "Test Bracelet",
    price: 99.99,
    stock: 10,
    isVisible: true,
    summary: "A beautiful bracelet",
    description: "This is a detailed description of a beautiful bracelet.",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with product data pre-filled", () => {
    renderWithQueryClient(<ProductEditPage productData={mockProductData} />);

    // Check heading
    expect(screen.getByText("Edit Product")).toBeInTheDocument();

    // Check that form fields are pre-filled with product data
    expect(screen.getByLabelText(/Product Name/i)).toHaveValue(
      mockProductData.name,
    );
    expect(screen.getByLabelText(/Price/i)).toHaveValue(
      mockProductData.price.toString(),
    );
    expect(screen.getByLabelText(/Stock/i)).toHaveValue(
      mockProductData.stock.toString(),
    );
    expect(screen.getByLabelText(/Product Visibility/i)).toBeChecked();
    expect(screen.getByLabelText(/Summary/i)).toHaveValue(
      mockProductData.summary,
    );
    expect(screen.getByLabelText(/Description/i)).toHaveValue(
      mockProductData.description,
    );

    // Check for save button
    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
  });

  it("submits updated product data", async () => {
    // Mock successful product update
    updateProduct.mockResolvedValue({
      status: 200,
      message: "Product updated successfully",
      data: { ...mockProductData, name: "Updated Bracelet" },
    });

    renderWithQueryClient(<ProductEditPage productData={mockProductData} />);

    // Change product name
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "Updated Bracelet" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    // Verify that updateProduct was called with correct data
    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith({
        ...mockProductData,
        name: "Updated Bracelet",
        id: mockProductData._id,
      });

      // Verify success toast
      expect(toast.success).toHaveBeenCalledWith(
        "Product updated successfully",
      );
    });
  });

  it("handles validation errors", async () => {
    renderWithQueryClient(<ProductEditPage productData={mockProductData} />);

    // Clear required fields
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText("Product name is required")).toBeInTheDocument();
      expect(screen.getByText("Price is required")).toBeInTheDocument();
    });
  });

  it("handles API error response", async () => {
    // Mock API error response
    updateProduct.mockResolvedValue({
      status: 400,
      message: "Product update failed",
    });

    renderWithQueryClient(<ProductEditPage productData={mockProductData} />);

    // Submit form without changes
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    // Verify error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Product update failed");
    });
  });

  it("validates price format", async () => {
    renderWithQueryClient(<ProductEditPage productData={mockProductData} />);

    // Enter invalid price
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "invalid" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    // Check for price validation error
    await waitFor(() => {
      expect(screen.getByText("Invalid price format")).toBeInTheDocument();
    });
  });

  it("validates stock value", async () => {
    renderWithQueryClient(<ProductEditPage productData={mockProductData} />);

    // Enter negative stock value
    fireEvent.change(screen.getByLabelText(/Stock/i), {
      target: { value: "-5" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    // Check for stock validation error
    await waitFor(() => {
      expect(
        screen.getByText("Stock must be greater than 0"),
      ).toBeInTheDocument();
    });
  });
});
