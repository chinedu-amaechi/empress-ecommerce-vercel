describe("Homepage Navigation", () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit("/");
  });

  it("displays the main hero section with correct content", () => {
    // Test that the hero heading appears
    cy.get("h1")
      .should("be.visible")
      .and("contain", "Elegance for the Modern Empress");

    // Test that the main CTA button exists and has correct text
    cy.get('a[href="/collections"]')
      .should("be.visible")
      .and("contain", "Explore Collection");
  });

  it("navigates to collections page when clicking the CTA button", () => {
    // Click the CTA button
    cy.get('a[href="/collections"]').click();

    // Verify we've navigated to the collections page
    cy.url().should("include", "/collections");

    // Verify collections content is visible
    cy.get("h2").contains("Collections").should("be.visible");
  });

  it("displays the featured collections section", () => {
    // Verify collections section exists
    cy.get("h2").contains("Collections").should("be.visible");

    // Check that we have at least 4 collection cards
    cy.get('a[href^="/collections/"]').should("have.length.at.least", 4);

    // Verify specific collections appear
    cy.contains("Ethereal").should("be.visible");
    cy.contains("Divine").should("be.visible");
    cy.contains("Heritage").should("be.visible");
    cy.contains("Celestial Bloom").should("be.visible");
  });
});
