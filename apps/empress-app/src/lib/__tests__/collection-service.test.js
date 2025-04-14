// src/lib/__tests__/collection-service.test.js
import { getAllCollections } from "../collection-service";
import backendUrl from "../backend-url";

// Mock fetch
global.fetch = jest.fn();

describe("collection-service", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("getAllCollections fetches collections from the API", async () => {
    // Mock successful response
    const mockCollections = [
      { _id: "1", name: "Ethereal", description: "Ethereal collection" },
      { _id: "2", name: "Divine", description: "Divine collection" },
    ];

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({ data: mockCollections }),
    });

    const result = await getAllCollections();

    // Check fetch was called with correct URL
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`${backendUrl}/api/admin/collections`);

    // Check returned data
    expect(result).toEqual(mockCollections);
  });

  it("getAllCollections handles errors gracefully", async () => {
    // Mock fetch error
    fetch.mockRejectedValueOnce(new Error("Network error"));

    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    const result = await getAllCollections();

    // Check fetch was called
    expect(fetch).toHaveBeenCalledTimes(1);

    // Should return empty array on error
    expect(result).toEqual([]);

    // Should log the error
    expect(console.error).toHaveBeenCalled();

    // Restore console.error
    console.error.mockRestore();
  });
});
