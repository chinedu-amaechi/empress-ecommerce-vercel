// apps/empress-admin-app/src/hooks/__tests__/useCollections.test.js
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useCollections from "../useCollections";
import { fetchAllCollections } from "../../services/collections";

// Mock the collections service
jest.mock("../../services/collections", () => ({
  fetchAllCollections: jest.fn(),
}));

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCollections hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns collections data when fetchAllCollections succeeds", async () => {
    // Mock successful response
    const mockCollections = [
      { _id: "1", name: "Collection 1", description: "Description 1" },
      { _id: "2", name: "Collection 2", description: "Description 2" },
    ];

    fetchAllCollections.mockResolvedValue(mockCollections);

    const { result } = renderHook(() => useCollections(), {
      wrapper: createWrapper(),
    });

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for query to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Check results
    expect(result.current.data).toEqual(mockCollections);
    expect(result.current.error).toBeNull();

    // Verify that fetchAllCollections was called
    expect(fetchAllCollections).toHaveBeenCalled();
  });

  it("returns error when fetchAllCollections fails", async () => {
    // Mock error response
    const error = new Error("Failed to fetch collections");
    fetchAllCollections.mockRejectedValue(error);

    const { result } = renderHook(() => useCollections(), {
      wrapper: createWrapper(),
    });

    // Wait for query to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Check that error is returned
    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBeUndefined();
  });

  it("refetches data when window is focused", async () => {
    // Mock successful response
    const mockCollections = [
      { _id: "1", name: "Collection 1", description: "Description 1" },
    ];

    fetchAllCollections.mockResolvedValue(mockCollections);

    renderHook(() => useCollections(), {
      wrapper: createWrapper(),
    });

    // Wait for initial query to complete
    await waitFor(() => expect(fetchAllCollections).toHaveBeenCalledTimes(1));

    // Simulate window focus event
    window.dispatchEvent(new Event("focus"));

    // Verify that fetchAllCollections was called again
    await waitFor(() => expect(fetchAllCollections).toHaveBeenCalledTimes(2));
  });
});
