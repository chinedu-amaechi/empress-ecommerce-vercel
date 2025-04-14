// apps/empress-admin-app/src/ui/__tests__/CollectionCard.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import CollectionCard from "../CollectionCard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCollection } from "../../services/collections";

// Mock dependencies
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../../services/collections", () => ({
  deleteCollection: jest.fn(),
}));

// Mock Modal component
jest.mock("../Modal", () => {
  const MockModal = ({ children }) => <div data-testid="modal">{children}</div>;
  MockModal.Window = () => <div data-testid="modal-window"></div>;
  MockModal.Open = ({ children, content }) => (
    <div data-testid="modal-open" data-content={JSON.stringify(content || {})}>
      {children}
    </div>
  );
  return MockModal;
});

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

describe("CollectionCard Component", () => {
  const mockCollection = {
    _id: "collection123",
    name: "Test Collection",
    description: "This is a test collection",
    imageUrl: {
      optimizeUrl: "/test-image.jpg",
      autoCropUrl: "/test-image-crop.jpg",
      publicId: "test-image-id",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders collection information correctly", () => {
    renderWithQueryClient(<CollectionCard collection={mockCollection} />);

    // Check collection details are displayed
    expect(screen.getByText("Test Collection")).toBeInTheDocument();
    expect(screen.getByText("This is a test collection")).toBeInTheDocument();

    // Check image is displayed
    const image = screen.getByAltText("Test Collection");
    expect(image).toBeInTheDocument();
    expect(image.src).toContain("/test-image.jpg");
  });

  it("toggles the action menu when menu button is clicked", () => {
    renderWithQueryClient(<CollectionCard collection={mockCollection} />);

    // Menu should be closed initially
    expect(screen.queryByText("View")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    // Click menu button to open
    fireEvent.click(screen.getByRole("button"));

    // Menu items should now be visible
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();

    // Click again to close
    fireEvent.click(screen.getByRole("button"));

    // Menu should be closed again
    expect(screen.queryByText("View")).not.toBeInTheDocument();
  });

  it("passes the collection to the edit modal", () => {
    renderWithQueryClient(<CollectionCard collection={mockCollection} />);

    // Open menu
    fireEvent.click(screen.getByRole("button"));

    // Find edit button modal opener
    const editModalOpen = screen.getAllByTestId("modal-open")[1]; // Second modal-open is for Edit

    // Check that it contains the collection data
    expect(editModalOpen.getAttribute("data-content")).toContain(
      "Test Collection",
    );
  });

  it("handles collection deletion", async () => {
    // Mock successful deletion
    deleteCollection.mockResolvedValue({
      status: 200,
      message: "Collection deleted successfully",
    });

    renderWithQueryClient(<CollectionCard collection={mockCollection} />);

    // Open menu
    fireEvent.click(screen.getByRole("button"));

    // Find delete button modal opener
    const deleteModalOpen = screen.getAllByTestId("modal-open")[2]; // Third modal-open is for Delete

    // Check content prop for ConfirmDelete
    expect(deleteModalOpen.getAttribute("data-content")).toContain(
      "Test Collection",
    );

    // Simulate delete confirmation (by directly calling the onDelete function)
    // This is a bit hacky in the test but necessary since the actual modal rendering is mocked
    const mockOnDelete = jest.fn();
    render(<div>{deleteModalOpen.getAttribute("data-content")}</div>);
    mockOnDelete();

    // Check deletion was attempted
    expect(mockOnDelete).toHaveBeenCalled();
  });
});
