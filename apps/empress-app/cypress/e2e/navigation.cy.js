describe("Navigation and Header", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the header with logo and navigation links", () => {
    // Verify logo is visible
    cy.get('img[alt="Empress Logo"]').should("be.visible");

    // Verify main navigation items are visible on desktop
    cy.contains("Collections").should("be.visible");
    cy.contains("Shop").should("be.visible");
    cy.contains("About").should("be.visible");
    cy.contains("Care").should("be.visible");
  });

  it("shows dropdown when clicking Collections link", () => {
    // Click on Collections link
    cy.contains("Collections").click();

    // Verify dropdown appears with collection options
    cy.contains("Ethereal").should("be.visible");
    cy.contains("Divine").should("be.visible");
    cy.contains("Heritage").should("be.visible");
    cy.contains("Celestial Bloom").should("be.visible");
  });

  it("shows search input when clicking search icon", () => {
    // Click search button
    cy.get('button[aria-label="Search"]').click();

    // Verify search input appears
    cy.get('input[placeholder*="Search"]').should("be.visible");

    // Type in search field
    cy.get('input[placeholder*="Search"]').type("bracelet");

    // Close search
    cy.get('button[aria-label*="Close"]').click();

    // Verify search is closed
    cy.get('input[placeholder*="Search"]').should("not.exist");
  });

  it("changes appearance when scrolling down", () => {
    // Get initial header state
    cy.get("nav").invoke("css", "background-color").as("initialBgColor");

    // Scroll down to trigger header change
    cy.scrollTo(0, 500);

    // Verify header background changed
    cy.get("nav")
      .invoke("css", "background-color")
      .should("not.eq", "@initialBgColor");
  });
});
