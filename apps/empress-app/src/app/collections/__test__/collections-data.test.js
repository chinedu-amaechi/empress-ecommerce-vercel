// src/app/collections/__test__/collections-data.test.js
import CollectionsData from "../collections-data";

describe("CollectionsData Function", () => {
  it("returns the collection data object", () => {
    const collectionsData = CollectionsData();

    // Check if it's an object
    expect(typeof collectionsData).toBe("object");

    // Check if it has the expected collections
    expect(collectionsData).toHaveProperty("ethereal");
    expect(collectionsData).toHaveProperty("divine");
    expect(collectionsData).toHaveProperty("heritage");
    expect(collectionsData).toHaveProperty("celestial-bloom");
  });

  it("contains the correct structure for each collection", () => {
    const collectionsData = CollectionsData();

    // Check structure of the Ethereal collection
    const ethereal = collectionsData.ethereal;
    expect(ethereal).toHaveProperty("name", "Ethereal");
    expect(ethereal).toHaveProperty("description");
    expect(ethereal).toHaveProperty("heroImage");
    expect(ethereal).toHaveProperty("products");
    expect(Array.isArray(ethereal.products)).toBe(true);

    // Check a product in the collection
    const product = ethereal.products[0];
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("images");
    expect(product).toHaveProperty("description");
  });

  it("has different products for each collection", () => {
    const collectionsData = CollectionsData();

    // Extract product IDs from each collection
    const etherealIds = collectionsData.ethereal.products.map((p) => p.id);
    const divineIds = collectionsData.divine.products.map((p) => p.id);
    const heritageIds = collectionsData.heritage.products.map((p) => p.id);
    const celestialIds = collectionsData["celestial-bloom"].products.map(
      (p) => p.id
    );

    // Check for unique product IDs across collections
    const allIds = [
      ...etherealIds,
      ...divineIds,
      ...heritageIds,
      ...celestialIds,
    ];
    const uniqueIds = new Set(allIds);

    expect(uniqueIds.size).toBe(allIds.length);
  });
});
