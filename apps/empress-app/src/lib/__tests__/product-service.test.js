// src/lib/__test__/product-service.test.js
import {
  getAllProducts,
  getProductsByCollection,
  getProductById,
  searchProducts,
  getProductImages,
  getFeaturedProducts,
  getRelatedProducts,
} from "../product-service";
import backendUrl from "../backend-url";

// Mock global fetch API
global.fetch = jest.fn();

// Mock console.error to avoid polluting test output
console.error = jest.fn();

describe("Product Service", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: getAllProducts fetches and returns all products
  it("fetches all products from the API endpoint", async () => {
    // ARRANGE: Set up mock data and response
    const mockProducts = [
      { _id: "product1", name: "First Product", price: 99.99 },
      { _id: "product2", name: "Second Product", price: 149.99 },
    ];

    const mockResponse = {
      status: 200,
      message: "Products retrieved successfully",
      data: mockProducts,
    };

    // Mock the fetch implementation to return our test data
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // ACT: Call the function under test
    const result = await getAllProducts();

    // ASSERT: Verify it makes the correct API call
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/products`
    );

    // Verify it returns the expected products
    expect(result).toEqual(mockProducts);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe("First Product");
  });

  // Test 2: getAllProducts handles API errors
  it("handles errors when fetching all products fails", async () => {
    // ARRANGE: Set up a failed API response
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    // ACT: Call the function and capture the result
    const result = await getAllProducts();

    // ASSERT: Verify the function returns an empty array on error
    expect(result).toEqual([]);

    // Check that the error was logged
    expect(console.error).toHaveBeenCalledWith(
      "Error fetching all products:",
      expect.any(Error)
    );
  });

  // Test 3: getProductsByCollection fetches products for a specific collection
  it("fetches products by collection ID", async () => {
    // ARRANGE: Set up mock data and response for a collection
    const mockProductsForCollection = [
      { _id: "product1", name: "Collection Product 1", collectionId: "col123" },
      { _id: "product2", name: "Collection Product 2", collectionId: "col123" },
    ];

    // Mock the fetch implementation
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        status: 200,
        data: mockProductsForCollection,
      }),
    });

    // ACT: Call the function with a collection ID
    const result = await getProductsByCollection("col123");

    // ASSERT: Verify it makes the correct API call with collection ID
    expect(global.fetch).toHaveBeenCalledWith("/data/products.json");

    // In a real implementation, it would call:
    // `${backendUrl}/api/admin/collection/col123/products`

    // Verify returned products are from the specified collection
    expect(result.length).toBe(2);
    expect(result[0].collectionId).toBe("col123");
  });

  // Test 4: getProductById fetches a specific product
  it("fetches a specific product by ID and collection ID", async () => {
    // ARRANGE: Set up mock data for a specific product
    const mockProduct = {
      _id: "product123",
      name: "Specific Product",
      price: 129.99,
      description: "A very specific product",
    };

    // Mock the fetch implementation
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: "product123",
            name: "Specific Product",
            price: 129.99,
            description: "A very specific product",
          },
        ],
      }),
    });

    // ACT: Call the function with collection and product IDs
    const result = await getProductById("collection123", "product123");

    // ASSERT: Verify it makes the correct API call
    expect(global.fetch).toHaveBeenCalledWith("/data/products.json");

    // In a real implementation, it would call:
    // `${backendUrl}/api/admin/collection/collection123/product/product123`

    // Verify it returns the specific product
    expect(result).toEqual(
      expect.objectContaining({
        id: "product123",
        name: "Specific Product",
      })
    );
  });

  // Test 5: searchProducts searches across all products
  it("searches for products by query string", async () => {
    // ARRANGE: Set up mock data for all products
    const allProducts = [
      {
        _id: "product1",
        name: "Silver Bracelet",
        description: "Beautiful silver",
      },
      { _id: "product2", name: "Gold Necklace", description: "Elegant gold" },
      { _id: "product3", name: "Diamond Ring", description: "Shiny diamond" },
    ];

    // Mock getAllProducts to return our test data
    jest.spyOn(global, "getAllProducts").mockResolvedValueOnce(allProducts);

    // ACT: Search for products containing 'silver'
    const result = await searchProducts("silver");

    // ASSERT: Verify it filters correctly based on name and description
    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Silver Bracelet");
  });

  // Test 6: getProductImages handles different image formats
  it("returns a consistent array of image paths for a product", () => {
    // ARRANGE: Set up test cases for different image scenarios
    const productWithSingleImage = { image: "/path/to/image.jpg" };
    const productWithImageArray = {
      images: ["/path/to/image1.jpg", "/path/to/image2.jpg"],
    };
    const productWithoutImages = { name: "No Image Product" };

    // ACT: Get images for each product type
    const singleImageResult = getProductImages(productWithSingleImage);
    const arrayImageResult = getProductImages(productWithImageArray);
    const noImageResult = getProductImages(productWithoutImages);

    // ASSERT: Verify each case returns the expected array format
    expect(Array.isArray(singleImageResult)).toBe(true);
    expect(singleImageResult.length).toBe(1);
    expect(singleImageResult[0]).toBe("/path/to/image.jpg");

    expect(Array.isArray(arrayImageResult)).toBe(true);
    expect(arrayImageResult.length).toBe(2);

    expect(Array.isArray(noImageResult)).toBe(true);
    expect(noImageResult[0]).toBe("/products/default-product.jpg"); // Default fallback
  });

  // Test 7: getFeaturedProducts returns a subset of random products
  it("returns a limited number of random featured products", async () => {
    // ARRANGE: Set up mock data with multiple products
    const allProducts = Array(10)
      .fill()
      .map((_, i) => ({
        _id: `product${i}`,
        name: `Product ${i}`,
        price: 99.99 + i,
      }));

    // Mock getAllProducts to return our test data
    jest.spyOn(global, "getAllProducts").mockResolvedValueOnce(allProducts);

    // ACT: Get featured products with a limit of 4
    const result = await getFeaturedProducts(4);

    // ASSERT: Verify it returns the correct number of products
    expect(result.length).toBe(4);

    // Should have 4 unique products (no duplicates)
    const uniqueIds = new Set(result.map((p) => p._id));
    expect(uniqueIds.size).toBe(4);
  });

  // Test 8: getRelatedProducts excludes the current product
  it("returns related products from the same collection, excluding current product", async () => {
    // ARRANGE: Set up mock data for a collection
    const collectionProducts = [
      { id: "product1", name: "Related 1", collectionId: "col123" },
      { id: "product2", name: "Current Product", collectionId: "col123" },
      { id: "product3", name: "Related 2", collectionId: "col123" },
      { id: "product4", name: "Related 3", collectionId: "col123" },
    ];

    // Mock getProductsByCollection to return our test data
    jest
      .spyOn(global, "getProductsByCollection")
      .mockResolvedValueOnce(collectionProducts);

    // ACT: Get related products, excluding product2
    const result = await getRelatedProducts("col123", "product2", 2);

    // ASSERT: Verify it excludes the specified product
    expect(result.length).toBe(2); // Limited to 2 as specified
    expect(result.some((p) => p.id === "product2")).toBe(false); // Shouldn't include product2

    // All returned products should be from specified collection
    expect(result.every((p) => p.collectionId === "col123")).toBe(true);
  });

  // Test 9: searchProducts returns all products when query is empty
  it("returns all products when search query is empty", async () => {
    // ARRANGE: Set up mock data
    const allProducts = [
      { _id: "product1", name: "Product One" },
      { _id: "product2", name: "Product Two" },
    ];

    // Mock getAllProducts to return our test data
    jest.spyOn(global, "getAllProducts").mockResolvedValueOnce(allProducts);

    // ACT: Search with empty query
    const result = await searchProducts("");

    // ASSERT: Should return all products
    expect(result.length).toBe(2);
    expect(result).toEqual(allProducts);
  });

  // Test 10: searchProducts searches by material too
  it("searches products by material as well as name and description", async () => {
    // ARRANGE: Set up mock data including product materials
    const allProducts = [
      {
        _id: "product1",
        name: "Regular Bracelet",
        description: "Standard bracelet",
        materials: ["sterling silver", "gold plating"],
      },
      {
        _id: "product2",
        name: "Regular Necklace",
        description: "Standard necklace",
        materials: ["platinum", "diamond"],
      },
    ];

    // Mock getAllProducts to return our test data
    jest.spyOn(global, "getAllProducts").mockResolvedValueOnce(allProducts);

    // ACT: Search for a material
    const result = await searchProducts("platinum");

    // ASSERT: Should find the product with platinum material
    expect(result.length).toBe(1);
    expect(result[0]._id).toBe("product2");
  });

  // Test 11: searchProducts handles case insensitivity
  it("performs case-insensitive searches", async () => {
    // ARRANGE: Set up mock data with mixed case
    const allProducts = [
      {
        _id: "product1",
        name: "SILVER BRACELET",
        description: "Silver jewelry",
      },
      { _id: "product2", name: "Gold Necklace", description: "gold jewelry" },
    ];

    // Mock getAllProducts to return our test data
    jest.spyOn(global, "getAllProducts").mockResolvedValueOnce(allProducts);

    // ACT: Search with lowercase term that exists in uppercase in data
    const result = await searchProducts("silver");

    // ASSERT: Should find the product regardless of case
    expect(result.length).toBe(1);
    expect(result[0]._id).toBe("product1");
  });

  // Test 12: getProductById returns null for non-existent products
  it("returns null when a product is not found", async () => {
    // ARRANGE: Set up mock data with no matching product
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        status: 200,
        data: [
          {
            id: "existingProduct",
            name: "Existing Product",
          },
        ],
      }),
    });

    // ACT: Try to get a non-existent product
    const result = await getProductById("collection123", "nonexistentProduct");

    // ASSERT: Should return null
    expect(result).toBeNull();
  });

  // Test 13: getProductsByCollection handles collections with no products
  it("returns an empty array when a collection has no products", async () => {
    // ARRANGE: Mock fetch to return no matching collection
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        status: 200,
        data: {},
      }),
    });

    // ACT: Get products for a collection with no products
    const result = await getProductsByCollection("emptyCollection");

    // ASSERT: Should return an empty array
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
