// src/hooks/__test__/use-products.test.js
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useProducts from "../use-products";
import { getAllProducts } from "@/lib/product-service";

// Mock the product service function
jest.mock("@/lib/product-service", () => ({
  getAllProducts: jest.fn(),
}));

// Sample product data for testing
const mockProductsData = [
  {
    _id: "prod1",
    name: "Silver Bracelet",
    price: 129.99,
    collectionId: "col1",
    description: "A beautiful silver bracelet",
  },
  {
    _id: "prod2",
    name: "Gold Necklace",
    price: 199.99,
    collectionId: "col2",
    description: "An elegant gold necklace",
  },
  {
    _id: "prod3",
    name: "Diamond Ring",
    price: 499.99,
    collectionId: "col3",
    description: "A stunning diamond ring",
  },
];

// Create a wrapper for the QueryClientProvider
const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Turn off retries for testing
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProducts Hook", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Hook fetches products data successfully
  it("fetches products data and returns it with loading state", async () => {
    // ARRANGE: Mock successful API response
    getAllProducts.mockResolvedValueOnce(mockProductsData);

    // ACT: Render the hook with query client wrapper
    const { result } = renderHook(() => useProducts(), {
      wrapper: createQueryClientWrapper(),
    });

    // ASSERT: Initial state should be loading with no data
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ASSERT: Data should be loaded and loading state cleared
    expect(result.current.data).toEqual(mockProductsData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    // Verify service function was called
    expect(getAllProducts).toHaveBeenCalledTimes(1);
  });

  // Test 2: Hook handles API errors correctly
  it("handles API errors and returns error state", async () => {
    // ARRANGE: Mock API error
    const testError = new Error("Failed to fetch products");
    getAllProducts.mockRejectedValueOnce(testError);

    // ACT: Render the hook
    const { result } = renderHook(() => useProducts(), {
      wrapper: createQueryClientWrapper(),
    });

    // ASSERT: Initial state should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to fail
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ASSERT: Error state should be populated
    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  // Test 3: Hook uses React Query caching
  it("uses cached data for subsequent calls without refetching", async () => {
    // ARRANGE: Mock successful API response
    getAllProducts.mockResolvedValueOnce(mockProductsData);

    // Create a custom wrapper with persistent query client for this test
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          // Reduce stale time for testing
          staleTime: 1000,
        },
      },
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // ACT: First render of the hook
    const { result, rerender } = renderHook(() => useProducts(), { wrapper });

    // Wait for initial data fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ASSERT: Data is fetched once
    expect(getAllProducts).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockProductsData);

    // ACT: Rerender the hook (simulating component re-render)
    rerender();

    // ASSERT: Service should not be called again (using cached data)
    expect(getAllProducts).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockProductsData);
  });

  // Test 4: Hook refetches data when window is refocused
  it("refetches data when window is refocused if configured to do so", async () => {
    // ARRANGE: Mock successful API response
    getAllProducts.mockResolvedValue(mockProductsData);

    // Create a wrapper with refetchOnWindowFocus enabled
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          refetchOnWindowFocus: true,
        },
      },
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // ACT: Render the hook
    renderHook(() => useProducts(), { wrapper });

    // Wait for initial data fetch
    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledTimes(1);
    });

    // ACT: Simulate window focus event
    window.dispatchEvent(new Event("focus"));

    // ASSERT: Data should be refetched
    await waitFor(() => {
      expect(getAllProducts).toHaveBeenCalledTimes(2);
    });
  });

  // Test 5: Query key is correct
  it("uses the correct query key for caching", async () => {
    // ARRANGE: Create a query client we can inspect
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Spy on queryClient.getQueryData
    const getQueryDataSpy = jest.spyOn(queryClient, "getQueryData");

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    // Mock API response
    getAllProducts.mockResolvedValueOnce(mockProductsData);

    // ACT: Render the hook
    const { result } = renderHook(() => useProducts(), { wrapper });

    // Wait for query completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ASSERT: Verify the correct query key was used
    expect(queryClient.getQueryData(["products"])).toEqual(mockProductsData);
    expect(getQueryDataSpy).toHaveBeenCalledWith(["products"]);
  });

  // Test 6: Hook properly handles empty array return from API
  it("handles empty array from API gracefully", async () => {
    // ARRANGE: Mock API returning empty array
    getAllProducts.mockResolvedValueOnce([]);

    // ACT: Render the hook
    const { result } = renderHook(() => useProducts(), {
      wrapper: createQueryClientWrapper(),
    });

    // Wait for query completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ASSERT: Hook should handle this gracefully
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  // Test 7: The hook integrates correctly with other parts of the app
  it("can be used within components to access products data", async () => {
    // ARRANGE: Mock successful API response
    getAllProducts.mockResolvedValueOnce(mockProductsData);

    // ACT: Render the hook
    const { result } = renderHook(
      () => {
        const { data, isLoading } = useProducts();

        // Simulate what a component might do with the data
        const processedData =
          !isLoading && data
            ? data.map((product) => ({
                ...product,
                formattedPrice: `$${product.price.toFixed(2)}`,
              }))
            : [];

        return { processedData, isLoading };
      },
      {
        wrapper: createQueryClientWrapper(),
      }
    );

    // Wait for query completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ASSERT: Verify the processed data has the expected format
    expect(result.current.processedData).toHaveLength(3);
    expect(result.current.processedData[0].formattedPrice).toBe("$129.99");
    expect(result.current.processedData[1].formattedPrice).toBe("$199.99");
    expect(result.current.processedData[2].formattedPrice).toBe("$499.99");
  });

  // Test 8: The hook allows filtering products by collection
  it("provides data that can be filtered by collection ID", async () => {
    // ARRANGE: Mock successful API response
    getAllProducts.mockResolvedValueOnce(mockProductsData);

    // ACT: Render the hook
    const { result } = renderHook(
      () => {
        const { data, isLoading } = useProducts();

        // Simulate filtering by collection, which would happen in a component
        const filteredByCollection =
          !isLoading && data
            ? data.filter((product) => product.collectionId === "col1")
            : [];

        return { filteredByCollection, isLoading };
      },
      {
        wrapper: createQueryClientWrapper(),
      }
    );

    // Wait for query completion
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // ASSERT: Verify the filtered data contains only products from the specified collection
    expect(result.current.filteredByCollection).toHaveLength(1);
    expect(result.current.filteredByCollection[0].name).toBe("Silver Bracelet");
    expect(result.current.filteredByCollection[0].collectionId).toBe("col1");
  });
});
