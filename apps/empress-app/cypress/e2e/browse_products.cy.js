// apps/empress-app/cypress/e2e/browse_products.cy.js
describe("Browse Products Flow", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("/");
  });

  it("should navigate to collections page", () => {
    // Click on the Collections nav item
    cy.contains("Collections").click();

    // Check that we've navigated to the collections page
    cy.url().should("include", "/collections");

    // Verify that collection items are visible
    cy.contains("Ethereal").should("be.visible");
    cy.contains("Divine").should("be.visible");
    cy.contains("Heritage").should("be.visible");
  });

  it("should view a specific collection", () => {
    // Navigate to collections page
    cy.contains("Collections").click();

    // Click on a specific collection
    cy.contains("Ethereal").click();

    // Verify collection details are displayed
    cy.contains("The Essence of Ethereal").should("be.visible");
    cy.contains("Explore the Ethereal Collection").should("be.visible");
  });

  it("should navigate to product details page", () => {
    // Navigate to collections page
    cy.contains("Collections").click();

    // Click on a specific collection
    cy.contains("Ethereal").click();

    // Click on a product
    cy.get("[data-cy=product-card]").first().click();

    // Verify product details page elements
    cy.get("[data-cy=product-gallery]").should("be.visible");
    cy.get("[data-cy=product-price]").should("be.visible");
    cy.get("[data-cy=add-to-cart-button]").should("be.visible");
  });

  it("should add a product to cart and view cart", () => {
    // Navigate to collections page
    cy.contains("Collections").click();

    // Click on a specific collection
    cy.contains("Ethereal").click();

    // Click on a product
    cy.get("[data-cy=product-card]").first().click();

    // Add to cart
    cy.get("[data-cy=add-to-cart-button]").click();

    // Verify cart notification appears
    cy.contains("Item added to cart").should("be.visible");

    // Navigate to cart
    cy.get("[data-cy=cart-icon]").click();

    // Verify cart page has the product
    cy.url().should("include", "/cart");
    cy.get("[data-cy=cart-item]").should("have.length", 1);

    // Check product details in cart
    cy.get("[data-cy=cart-item-name]").should("contain.text", "Aluna");
    cy.get("[data-cy=cart-item-price]").should("contain.text", "$149.99");
    cy.get("[data-cy=cart-item-quantity]").should("contain.text", "1");
  });

  it("should adjust quantity in cart", () => {
    // Navigate to collections and add a product to cart
    cy.contains("Collections").click();
    cy.contains("Ethereal").click();
    cy.get("[data-cy=product-card]").first().click();
    cy.get("[data-cy=add-to-cart-button]").click();

    // Go to cart
    cy.get("[data-cy=cart-icon]").click();

    // Increase quantity
    cy.get("[data-cy=increase-quantity]").click();
    cy.get("[data-cy=cart-item-quantity]").should("contain.text", "2");

    // Wait for cart total to update
    cy.get("[data-cy=cart-subtotal]").should("contain.text", "$299.98");

    // Decrease quantity
    cy.get("[data-cy=decrease-quantity]").click();
    cy.get("[data-cy=cart-item-quantity]").should("contain.text", "1");

    // Wait for cart total to update again
    cy.get("[data-cy=cart-subtotal]").should("contain.text", "$149.99");
  });

  it("should have a working search function", () => {
    // Focus on search input
    cy.get("[data-cy=search-input]").click().type("silver");

    // Wait for search results
    cy.get("[data-cy=search-results]").should("be.visible");

    // Check if search results contain matching products
    cy.get("[data-cy=search-result-item]").should("have.length.at.least", 1);

    // Click on a search result
    cy.get("[data-cy=search-result-item]").first().click();

    // Verify we navigated to a product page
    cy.url().should("include", "/products/");
  });
});