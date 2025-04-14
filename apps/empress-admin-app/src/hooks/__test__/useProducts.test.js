// apps/empress-admin-app/src/hooks/__tests__/useProducts.test.js
import { renderHook } from "@testing-library/react-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useProducts from "../useProducts";
import { fetchAllProducts } from "../../services/products";

// Mock the products service
jest.mock("../../services/products", () => ({
  fetchAllProducts: jest.fn(),
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

describe("useProducts hook", () => {
  it("returns products data when fetchAllProducts succeeds", async () => {
    const mockProducts = [
      { _id: "1", name: "Product 1", price: 99.99 },
      { _id: "2", name: "Product 2", price: 149.99 },
    ];

    fetchAllProducts.mockResolvedValue(mockProducts);

    const { result, waitFor } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    // Initially should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for query to complete
    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it("returns error when fetchAllProducts fails", async () => {
    const error = new Error("Failed to fetch products");
    fetchAllProducts.mockRejectedValue(error);

    const { result, waitFor } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    });

    // Wait for query to complete
    await waitFor(() => !result.current.isLoading);

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });
});
