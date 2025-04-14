describe("Product Interactions", () => {
  beforeEach(() => {
    // Start on homepage where products are displayed
    cy.visit("/");

    // Scroll to bestsellers section to ensure it's in view
    cy.contains("h2", "Bestselling").scrollIntoView();
  });

  it("displays bestselling products section", () => {
    // Verify bestsellers heading is present
    cy.contains("h2", "Bestselling Bracelets").should("be.visible");

    // Verify we have multiple product cards
    cy.get(".flex-shrink-0").should("have.length.at.least", 4);

    // Verify product information is displayed
    cy.get(".flex-shrink-0")
      .first()
      .within(() => {
        // Product should have a name
        cy.get("h3").should("be.visible");

        // Product should have a price
        cy.contains("$").should("be.visible");

        // Product should have an Add to Cart button
        cy.contains("Add to Cart").should("be.visible");
      });
  });

  it("shows product quick view when clicked", () => {
    // Find and click Quick View on the first product
    cy.get(".flex-shrink-0").first().scrollIntoView().trigger("mouseover");
    cy.contains("Quick View").click({ force: true });

    // Verify modal opens
    cy.get('div[role="dialog"]').should("be.visible");

    // Verify product details in modal
    cy.get('div[role="dialog"]').within(() => {
      // Should contain product name
      cy.get("h2").should("be.visible");

      // Should show product description
      cy.get("p").should("be.visible");

      // Should have color options
      cy.contains("Color").should("be.visible");

      // Should have quantity selector
      cy.contains("Quantity").should("be.visible");

      // Should have Add to Cart button
      cy.contains("Add to Cart").should("be.visible");

      // Close the modal
      cy.get('button[aria-label="Close modal"]').click();
    });

    // Verify modal closed
    cy.get('div[role="dialog"]').should("not.exist");
  });

  it("allows navigating product images in carousel", () => {
    // Get the first product card
    cy.get(".flex-shrink-0")
      .first()
      .scrollIntoView()
      .within(() => {
        // Hover to make navigation buttons visible
        cy.get("img").trigger("mouseover");

        // Store initial image source
        cy.get("img").invoke("attr", "src").as("initialSrc");

        // Click next button
        cy.get('button[aria-label="Next image"]').click({ force: true });

        // Verify image changed
        cy.get("img").invoke("attr", "src").should("not.eq", "@initialSrc");

        // Click previous button
        cy.get('button[aria-label="Previous image"]').click({ force: true });

        // Verify image returned to initial
        cy.get("img").invoke("attr", "src").should("eq", "@initialSrc");
      });
  });
});
