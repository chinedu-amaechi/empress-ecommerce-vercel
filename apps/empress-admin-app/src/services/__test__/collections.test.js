// apps/empress-admin-app/src/services/__tests__/collections.test.js
import {
  postNewCollection,
  updateCollection,
  fetchAllCollections,
  fetchCollection,
  deleteCollection,
  addToCollection,
  deleteProductFromCollection,
} from "../../services/collections";
import backendUrl from "../../utils/backendUrl";

// Mock fetch and sessionStorage
global.fetch = jest.fn();
global.sessionStorage = {
  getItem: jest.fn().mockReturnValue("test-token"),
};

describe("Collections Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("postNewCollection makes a POST request to create a new collection", async () => {
    // Mock successful response
    const mockResponse = {
      status: 201,
      message: "Collection added successfully",
      data: { _id: "collection123", name: "Test Collection" },
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Create FormData mock
    const mockFormData = {
      append: jest.fn(),
    };
    global.FormData = jest.fn(() => mockFormData);

    // Call postNewCollection
    const collectionData = {
      name: "Test Collection",
      description: "Test description",
      image: ["test-image.jpg"], // Mock file array
    };
    const result = await postNewCollection(collectionData);

    // Check that FormData was used correctly
    expect(global.FormData).toHaveBeenCalled();
    expect(mockFormData.append).toHaveBeenCalledWith("name", "Test Collection");
    expect(mockFormData.append).toHaveBeenCalledWith(
      "description",
      "Test description",
    );
    expect(mockFormData.append).toHaveBeenCalledWith("image", "test-image.jpg");

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/collection/new`,
      {
        method: "POST",
        headers: {
          authorization: "test-token",
        },
        body: mockFormData,
      },
    );

    // Check that the response is returned correctly
    expect(result).toEqual(mockResponse);
  });

  it("updateCollection makes a PUT request to update a collection", async () => {
    // Mock successful response
    const mockResponse = {
      status: 200,
      message: "Collection updated successfully",
      data: { _id: "collection123", name: "Updated Collection" },
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Create FormData mock
    const mockFormData = {
      append: jest.fn(),
    };
    global.FormData = jest.fn(() => mockFormData);

    // Call updateCollection
    const collectionData = {
      id: "collection123",
      name: "Updated Collection",
      description: "Updated description",
      isVisible: true,
      image: ["updated-image.jpg"], // Mock file array
    };
    const result = await updateCollection(collectionData);

    // Check that FormData was used correctly
    expect(global.FormData).toHaveBeenCalled();
    expect(mockFormData.append).toHaveBeenCalledWith(
      "name",
      "Updated Collection",
    );
    expect(mockFormData.append).toHaveBeenCalledWith(
      "description",
      "Updated description",
    );
    expect(mockFormData.append).toHaveBeenCalledWith("isVisible", true);
    expect(mockFormData.append).toHaveBeenCalledWith(
      "image",
      "updated-image.jpg",
    );

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/collection/update/collection123`,
      {
        method: "PUT",
        headers: {
          authorization: "test-token",
        },
        body: mockFormData,
      },
    );

    // Check that the response is returned correctly
    expect(result).toEqual(mockResponse);
  });

  it("fetchAllCollections makes a GET request to fetch all collections", async () => {
    // Mock successful response
    const mockResponse = {
      status: 200,
      message: "Collections retrieved successfully",
      data: [
        { _id: "collection1", name: "Collection 1" },
        { _id: "collection2", name: "Collection 2" },
      ],
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call fetchAllCollections
    const result = await fetchAllCollections();

    // Check that fetch was called with correct endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/collections`,
    );

    // Check that the data array is returned correctly
    expect(result).toEqual(mockResponse.data);
  });

  it("fetchCollection makes a GET request to fetch a specific collection", async () => {
    // Mock successful response
    const mockResponse = {
      status: 200,
      message: "Collection retrieved successfully",
      data: { _id: "collection123", name: "Test Collection" },
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call fetchCollection
    const collectionId = "collection123";
    const result = await fetchCollection(collectionId);

    // Check that fetch was called with correct endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/collection/${collectionId}`,
    );

    // Check that the data is returned correctly
    expect(result).toEqual(mockResponse.data);
  });

  it("deleteCollection makes a DELETE request to delete a collection", async () => {
    // Mock successful response
    const mockResponse = {
      status: 200,
      message: "Collection deleted successfully",
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call deleteCollection
    const collectionId = "collection123";
    const result = await deleteCollection(collectionId);

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/collection/delete/${collectionId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "test-token",
        },
      },
    );

    // Check that the response is returned correctly
    expect(result).toEqual(mockResponse);
  });

  it("addToCollection makes a POST request to add a product to a collection", async () => {
    // Mock successful response
    const mockResponse = {
      status: 200,
      message: "Product added to collection successfully",
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call addToCollection
    const data = {
      collectionId: "collection123",
      productId: "product123",
    };
    const result = await addToCollection(data);

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/collection/add/product`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "test-token",
        },
        body: JSON.stringify(data),
      },
    );

    // Check that the response is returned correctly
    expect(result).toEqual(mockResponse);
  });

  it("deleteProductFromCollection makes a DELETE request to remove a product from a collection", async () => {
    // Mock successful response
    const mockResponse = {
      status: 200,
      message: "Product removed from collection successfully",
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call deleteProductFromCollection
    const data = {
      collectionId: "collection123",
      productId: "product123",
    };
    const result = await deleteProductFromCollection(data);

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/admin/collection/delete/product`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "test-token",
        },
        body: JSON.stringify(data),
      },
    );

    // Check that the response is returned correctly
    expect(result).toEqual(mockResponse);
  });
});
