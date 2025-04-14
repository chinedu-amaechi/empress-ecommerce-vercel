// apps/empress-admin-app/src/features/product/__tests__/ProductOverview.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductOverview from "../ProductOverview";
import {
  switchVisibility,
  addProductImage,
  removeProductImage,
  addMaterialToProduct,
  removeMaterialFromProduct,
  addProductToCollection,
} from "../../../services/products";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("../../../services/products", () => ({
  switchVisibility: jest.fn(),
  addProductImage: jest.fn(),
  removeProductImage: jest.fn(),
  addMaterialToProduct: jest.fn(),
  removeMaterialFromProduct: jest.fn(),
  addProductToCollection: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock MUI components
jest.mock("@mui/material", () => ({
  Switch: (props) => (
    <input type="checkbox" data-testid="mui-switch" {...props} />
  ),
  Rating: (props) => <div data-testid="mui-rating">{props.value} stars</div>,
  Select: (props) => (
    <select data-testid="mui-select" {...props}>
      {props.children}
    </select>
  ),
  MenuItem: (props) => <option value={props.value}>{props.children}</option>,
  Button: (props) => (
    <button data-testid="mui-button" onClick={props.onClick}>
      {props.children}
    </button>
  ),
}));

jest.mock("@mui/icons-material", () => ({
  Add: () => <span data-testid="mui-add-icon">+</span>,
  Delete: () => <span data-testid="mui-delete-icon">×</span>,
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
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

describe("ProductOverview Component", () => {
  const mockProductData = {
    _id: "product123",
    name: "Test Product",
    price: 99.99,
    stock: 10,
    itemsSold: 5,
    revenue: 499.95,
    description: "This is a test product",
    summary: "Product summary",
    materials: ["Silver", "Gold"],
    isVisible: true,
    ratings: [
      { user: "User1", rating: 5, comment: "Great product!" },
      { user: "User2", rating: 4, comment: "Nice product" },
    ],
    imagesUrl: [
      { optimizeUrl: "/test-image-1.jpg", publicId: "image1" },
      { optimizeUrl: "/test-image-2.jpg", publicId: "image2" },
    ],
  };

  const mockCollectionsData = [
    { _id: "collection1", name: "Collection 1" },
    { _id: "collection2", name: "Collection 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.prompt = jest.fn();
  });

  it("renders product information correctly", () => {
    renderWithQueryClient(
      <ProductOverview
        productData={mockProductData}
        collectionsData={mockCollectionsData}
      />,
    );

    // Check product details
    expect(screen.getByText("TEST PRODUCT")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("10 items")).toBeInTheDocument();
    expect(screen.getByText("$499.95")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    // Check product summary and description
    expect(screen.getByText("Product Summary")).toBeInTheDocument();
    expect(screen.getByText("Product summary")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("This is a test product")).toBeInTheDocument();

    // Check materials
    expect(screen.getByText("Materials")).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();

    // Check ratings
    expect(screen.getByText("Reviews & Ratings")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument(); // Average rating
    expect(screen.getByText("User1:")).toBeInTheDocument();
    expect(screen.getByText("Great product!")).toBeInTheDocument();

    // Check images
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("toggles product visibility when switch is clicked", async () => {
    // Mock successful visibility toggle
    switchVisibility.mockResolvedValue({
      status: 200,
      message: "Visibility toggled successfully",
    });

    renderWithQueryClient(
      <ProductOverview
        productData={mockProductData}
        collectionsData={mockCollectionsData}
      />,
    );

    // Find visibility switch
    const visibilitySwitch = screen.getByTestId("mui-switch");
    expect(visibilitySwitch).toBeChecked();

    // Toggle visibility
    fireEvent.click(visibilitySwitch);

    // Check that switchVisibility was called
    expect(switchVisibility).toHaveBeenCalledWith("product123");

    // Check that visibility state was updated
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Visibility toggled successfully",
      );
    });
  });

  it("adds new material when prompted", async () => {
    // Mock prompt response
    global.prompt.mockReturnValue("Platinum");

    // Mock successful add material
    addMaterialToProduct.mockResolvedValue({
      status: 200,
      message: "Material added successfully",
    });

    renderWithQueryClient(
      <ProductOverview
        productData={mockProductData}
        collectionsData={mockCollectionsData}
      />,
    );

    // Find add material button
    const addMaterialButton = screen.getByText("Add Material");

    // Click button
    fireEvent.click(addMaterialButton);

    // Check that prompt was shown
    expect(global.prompt).toHaveBeenCalled();

    // Check that addMaterialToProduct was called with the right params
    expect(addMaterialToProduct).toHaveBeenCalledWith({
      newMaterial: "Platinum",
      id: "product123",
    });

    // Check success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Material added successfully");
    });
  });

  it("removes material when delete button is clicked", async () => {
    // Mock successful remove material
    removeMaterialFromProduct.mockResolvedValue({
      status: 200,
      message: "Material removed successfully",
    });

    renderWithQueryClient(
      <ProductOverview
        productData={mockProductData}
        collectionsData={mockCollectionsData}
      />,
    );

    // Find delete button for a material (using closest parent with the material name)
    const materialItem = screen.getByText("Silver").closest("li");
    const deleteButton = materialItem
      .querySelector('[data-testid="mui-delete-icon"]')
      .closest("button");

    // Click delete button
    fireEvent.click(deleteButton);

    // Check that removeMaterialFromProduct was called with the right params
    expect(removeMaterialFromProduct).toHaveBeenCalledWith({
      id: "product123",
      material: "Silver",
    });

    // Check success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Material removed successfully",
      );
    });
  });

  it("changes collection when selected", async () => {
    // Mock successful add to collection
    addProductToCollection.mockResolvedValue({
      status: 200,
      message: "Collection changed successfully",
    });

    renderWithQueryClient(
      <ProductOverview
        productData={mockProductData}
        collectionsData={mockCollectionsData}
      />,
    );

    // Find collection select
    const collectionSelect = screen.getByTestId("mui-select");

    // Change collection
    fireEvent.change(collectionSelect, { target: { value: "collection2" } });

    // Check that addProductToCollection was called with the right params
    expect(addProductToCollection).toHaveBeenCalledWith({
      id: "product123",
      collectionId: "collection2",
    });

    // Check success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Collection changed successfully",
      );
    });
  });
});
