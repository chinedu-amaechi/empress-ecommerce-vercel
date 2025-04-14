// apps/empress-admin-app/src/pages/__tests__/CollectionPage.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CollectionPage from "../CollectionPage";
import useCollections from "../../hooks/useCollections";

// Mock hooks and components
jest.mock("../../hooks/useCollections", () => ({
  __esModule: true,
  default: jest.fn(),
}));

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

jest.mock("../../ui/CollectionCard", () => {
  return function MockCollectionCard({ collection }) {
    return (
      <div data-testid={`collection-card-${collection._id}`}>
        {collection.name}
      </div>
    );
  };
});

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

jest.mock("../../features/collections/CollectionForm", () => {
  return function MockCollectionForm() {
    return <div data-testid="collection-form">Collection Form</div>;
  };
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

describe("CollectionPage Component", () => {
  // Mock collections data
  const mockCollections = [
    { _id: "1", name: "Collection 1", description: "Description 1" },
    { _id: "2", name: "Collection 2", description: "Description 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading spinner when collections are loading", () => {
    // Mock loading state
    useCollections.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithQueryClient(<CollectionPage />);

    // Check spinner is displayed
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("displays error message when there is an error loading collections", () => {
    // Mock error state
    useCollections.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: "Failed to load collections" },
    });

    renderWithQueryClient(<CollectionPage />);

    // Check error message is displayed
    expect(
      screen.getByText("Error: Failed to load collections"),
    ).toBeInTheDocument();
  });

  it("renders collections when data is loaded", async () => {
    // Mock successful data loading
    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<CollectionPage />);

    // Check page title is rendered
    expect(screen.getByText("Collections")).toBeInTheDocument();

    // Check add collection button is rendered
    expect(screen.getByText("Add Collection")).toBeInTheDocument();

    // Check analysis section is rendered
    expect(screen.getByText("Analysis")).toBeInTheDocument();
    expect(screen.getByText("Total Collections: 2")).toBeInTheDocument();

    // Check search input is rendered
    expect(
      screen.getByPlaceholderText("Search Collections"),
    ).toBeInTheDocument();

    // Check collection cards are rendered
    expect(screen.getByTestId("collection-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("collection-card-2")).toBeInTheDocument();
    expect(screen.getByText("Collection 1")).toBeInTheDocument();
    expect(screen.getByText("Collection 2")).toBeInTheDocument();
  });

  it("filters collections based on search term", async () => {
    // Mock successful data loading
    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<CollectionPage />);

    // Enter search term
    fireEvent.change(screen.getByPlaceholderText("Search Collections"), {
      target: { value: "Collection 1" },
    });

    // Collection 1 should be visible, Collection 2 should not
    expect(screen.getByText("Collection 1")).toBeInTheDocument();
    expect(screen.queryByText("Collection 2")).not.toBeInTheDocument();

    // Clear search
    fireEvent.change(screen.getByPlaceholderText("Search Collections"), {
      target: { value: "" },
    });

    // Both collections should be visible again
    expect(screen.getByText("Collection 1")).toBeInTheDocument();
    expect(screen.getByText("Collection 2")).toBeInTheDocument();
  });

  it('displays "No collections found" message when search has no results', async () => {
    // Mock successful data loading
    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<CollectionPage />);

    // Enter search term that won't match any collection
    fireEvent.change(screen.getByPlaceholderText("Search Collections"), {
      target: { value: "XYZ" },
    });

    // No collection should be visible, and message should be displayed
    expect(screen.queryByText("Collection 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Collection 2")).not.toBeInTheDocument();
    expect(screen.getByText("No collections found")).toBeInTheDocument();
  });

  it("opens modal with CollectionForm when Add Collection button is clicked", async () => {
    // Mock successful data loading
    useCollections.mockReturnValue({
      data: mockCollections,
      isLoading: false,
      error: null,
    });

    renderWithQueryClient(<CollectionPage />);

    // Click Add Collection button
    fireEvent.click(screen.getByText("Add Collection"));

    // Modal content should be rendered (this is simplified due to mocked components)
    expect(screen.getByTestId("modal-open")).toBeInTheDocument();

    // Check collection form is included
    expect(screen.getByTestId("collection-form")).toBeInTheDocument();
  });
});
