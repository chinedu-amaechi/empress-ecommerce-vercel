// apps/empress-admin-app/src/features/collections/__tests__/CollectionForm.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CollectionForm from "../CollectionForm";
import {
  postNewCollection,
  updateCollection,
} from "../../../services/collections";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("../../../services/collections", () => ({
  postNewCollection: jest.fn(),
  updateCollection: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock Heading and Spinner components
jest.mock("../../../ui/Heading", () => {
  return function MockHeading({ level, text }) {
    return <h2 data-testid={`heading-${level}`}>{text}</h2>;
  };
});

jest.mock("../../../ui/Spinner", () => {
  return function MockSpinner() {
    return <div data-testid="spinner">Loading...</div>;
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

describe("CollectionForm Component", () => {
  const mockCollection = {
    _id: "collection123",
    name: "Test Collection",
    description: "This is a test collection",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with create collection heading when no collection prop", () => {
    renderWithQueryClient(<CollectionForm />);

    // Check heading
    expect(screen.getByText("Create Collection")).toBeInTheDocument();

    // Check form fields are empty
    expect(screen.getByLabelText("Collection Name")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");

    // Check submit button
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders the form with edit collection heading when collection prop is provided", () => {
    renderWithQueryClient(<CollectionForm collection={mockCollection} />);

    // Check heading
    expect(screen.getByText("Edit Collection")).toBeInTheDocument();

    // Check form fields are pre-filled
    expect(screen.getByLabelText("Collection Name")).toHaveValue(
      "Test Collection",
    );
    expect(screen.getByLabelText("Description")).toHaveValue(
      "This is a test collection",
    );

    // Check submit button
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("shows validation errors for required fields", async () => {
    renderWithQueryClient(<CollectionForm />);

    // Submit form without filling fields
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    // Check for validation errors
    await waitFor(() => {
      expect(
        screen.getByText("Collection name is required"),
      ).toBeInTheDocument();
      expect(screen.getByText("Description is required")).toBeInTheDocument();
    });
  });

  it("calls postNewCollection when creating a new collection", async () => {
    // Mock successful creation
    postNewCollection.mockResolvedValue({
      status: 201,
      message: "Collection added successfully",
    });

    renderWithQueryClient(<CollectionForm />);

    // Fill the form
    fireEvent.change(screen.getByLabelText("Collection Name"), {
      target: { value: "New Collection" },
    });

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New collection description" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    // Should show loading spinner initially
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Check that postNewCollection was called with form data
    await waitFor(() => {
      expect(postNewCollection).toHaveBeenCalledWith({
        name: "New Collection",
        description: "New collection description",
        image: undefined, // Since we can't mock file upload easily in tests
      });

      // Check for success toast
      expect(toast.success).toHaveBeenCalledWith(
        "Collection added successfully",
      );
    });
  });

  it("calls updateCollection when editing an existing collection", async () => {
    // Mock successful update
    updateCollection.mockResolvedValue({
      status: 200,
      message: "Collection updated successfully",
    });

    renderWithQueryClient(<CollectionForm collection={mockCollection} />);

    // Modify the form
    fireEvent.change(screen.getByLabelText("Collection Name"), {
      target: { value: "Updated Collection" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    // Should show loading spinner initially
    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    // Check that updateCollection was called with the updated data
    await waitFor(() => {
      expect(updateCollection).toHaveBeenCalledWith({
        name: "Updated Collection",
        description: "This is a test collection",
        id: "collection123",
        image: undefined, // Since we can't mock file upload easily in tests
      });

      // Check for success toast
      expect(toast.success).toHaveBeenCalledWith(
        "Collection updated successfully 🎉",
      );
    });
  });

  it("handles API errors during form submission", async () => {
    // Mock API error
    postNewCollection.mockResolvedValue({
      status: 400,
      message: "Collection creation failed",
    });

    renderWithQueryClient(<CollectionForm />);

    // Fill the form
    fireEvent.change(screen.getByLabelText("Collection Name"), {
      target: { value: "New Collection" },
    });

    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New collection description" },
    });

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    // Check for error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Collection creation failed");
    });
  });
});
