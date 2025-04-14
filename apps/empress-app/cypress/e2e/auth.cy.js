// cypress/e2e/auth.cy.js

describe("Authentication Pages", () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: "Password123!",
    firstName: "Test",
    lastName: "User",
    phone: "1234567890",
    street: "123 Test St",
    city: "Test City",
    province: "ON",
    postalCode: "A1A 1A1",
  };

  beforeEach(() => {
    // Clear browser state between tests
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("displays sign-in page with correct form fields", () => {
    // Visit sign-in page
    cy.visit("/auth/sign-in");

    // Verify page title
    cy.contains("h1", "Sign In").should("be.visible");

    // Verify form fields exist
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.get('input[type="checkbox"]').should("be.visible");

    // Verify Remember me label
    cy.contains("Remember me").should("be.visible");

    // Verify Forgot password link
    cy.contains("Forgot password?").should("be.visible");

    // Verify sign-in button
    cy.get("button").contains("Sign In").should("be.visible");

    // Verify create account link
    cy.contains("Create an Account").should("be.visible");
  });

  it("navigates to sign-up page from sign-in", () => {
    // Start at sign-in page
    cy.visit("/auth/sign-in");

    // Click create account link
    cy.contains("Create an Account").click();

    // Verify redirect to sign-up page
    cy.url().should("include", "/auth/sign-up");

    // Verify sign-up form appears
    cy.contains("h1", "Sign Up").should("be.visible");
  });

  it("displays sign-up page with correct form fields", () => {
    // Visit sign-up page directly
    cy.visit("/auth/sign-up");

    // Verify heading
    cy.contains("h1", "Sign Up").should("be.visible");

    // Verify all required form fields exist
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="confirmPassword"]').should("be.visible");
    cy.get('input[name="firstName"]').should("be.visible");
    cy.get('input[name="lastName"]').should("be.visible");
    cy.get('input[name="phone"]').should("be.visible");

    // Verify address fields
    cy.get('input[name="street"]').should("be.visible");
    cy.get('input[name="city"]').should("be.visible");
    cy.get('select[name="province"]').should("be.visible");
    cy.get('input[name="postalCode"]').should("be.visible");

    // Verify terms checkbox
    cy.get('input[id="terms"]').should("be.visible");

    // Verify create account button
    cy.contains("Create Account").should("be.visible");

    // Verify sign in link for existing users
    cy.contains("Sign in").should("be.visible");
  });

  it("shows password validation error on sign-up", () => {
    cy.visit("/auth/sign-up");

    // Enter different passwords
    cy.get('input[name="password"]').type("password123");
    cy.get('input[name="confirmPassword"]').type("differentpassword");

    // Verify error message appears
    cy.contains("Passwords do not match").should("be.visible");

    // Now fix the password to match
    cy.get('input[name="confirmPassword"]').clear().type("password123");

    // Verify error message disappears
    cy.contains("Passwords do not match").should("not.exist");
  });

  it("displays forgot password page", () => {
    // Visit forgot password page
    cy.visit("/auth/forget-password");

    // Verify heading
    cy.contains("Forgot Password").should("be.visible");

    // Verify email field exists
    cy.get('input[type="email"]').should("be.visible");

    // Verify send reset link button
    cy.contains("Send Reset Link").should("be.visible");

    // Verify sign in link
    cy.contains("Sign in").should("be.visible");
  });

  it("validates email format on forgot password page", () => {
    cy.visit("/auth/forget-password");

    // Try invalid email
    cy.get('input[type="email"]').type("invalid-email");
    cy.get('button[type="submit"]').click();

    // Should show validation error
    cy.contains("Please enter a valid email address").should("be.visible");

    // Fix with valid email
    cy.get('input[type="email"]').clear().type("valid@example.com");
    cy.get('button[type="submit"]').click();

    // Should show success state
    cy.contains("Check Your Email").should("be.visible");
  });

  it("displays reset password page with form fields", () => {
    // Mock token parameter
    const mockToken = "mock-reset-token";
    cy.visit(`/auth/reset-password?token=${mockToken}`);

    // Verify heading
    cy.contains("Reset Password").should("be.visible");

    // Verify password fields
    cy.get('input[name="password"]').should("be.visible");
    cy.get('input[name="confirmPassword"]').should("be.visible");

    // Verify reset button
    cy.contains("Reset Password").should("be.visible");
  });

  // Test the complete sign-up flow
  it("allows user to sign up with valid information", () => {
    // Intercept the API call
    cy.intercept("POST", "**/api/auth/sign-up").as("signUpRequest");

    cy.visit("/auth/sign-up");

    // Fill in the form
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="confirmPassword"]').type(testUser.password);
    cy.get('input[name="firstName"]').type(testUser.firstName);
    cy.get('input[name="lastName"]').type(testUser.lastName);
    cy.get('input[name="phone"]').type(testUser.phone);
    cy.get('input[name="street"]').type(testUser.street);
    cy.get('input[name="city"]').type(testUser.city);
    cy.get('select[name="province"]').select(testUser.province);
    cy.get('input[name="postalCode"]').type(testUser.postalCode);

    // Accept terms
    cy.get('input[id="terms"]').check();

    // Submit form
    cy.get('button[type="submit"]').contains("Create Account").click();

    // Wait for the request to complete
    cy.wait("@signUpRequest").then((interception) => {
      // If using mocks, you can add assertions here
      // If testing against real API, just check for success response
      if (interception.response) {
        expect(interception.response.statusCode).to.be.oneOf([200, 201]);
      }
    });

    // Verify redirect to sign-in or success message
    cy.url().should("include", "/auth/sign-in");
  });

  // Test sign-in with valid credentials
  it("allows user to sign in with valid credentials", () => {
    // Intercept the sign-in API call
    cy.intercept("POST", "**/api/auth/sign-in").as("signInRequest");

    cy.visit("/auth/sign-in");

    // Fill in credentials
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);

    // Submit form
    cy.get('button[type="submit"]').contains("Sign In").click();

    // Wait for request to complete
    cy.wait("@signInRequest").then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
      }
    });

    // Verify redirection to products page
    cy.url().should("include", "/products");

    // Verify token in localStorage
    cy.window().its("localStorage.token").should("exist");
  });

  // Test forgot password flow
  it("handles forgot password request successfully", () => {
    // Intercept the forgot password API call
    cy.intercept("POST", "**/api/auth/forgot-password").as(
      "forgotPasswordRequest"
    );

    cy.visit("/auth/forget-password");

    // Enter email
    cy.get('input[name="email"]').type(testUser.email);

    // Submit form
    cy.get('button[type="submit"]').contains("Send Reset Link").click();

    // Wait for request to complete
    cy.wait("@forgotPasswordRequest").then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.eq(200);
      }
    });

    // Verify success state
    cy.contains("Check Your Email").should("be.visible");
    cy.contains(testUser.email).should("be.visible");
  });

  // Test unsuccessful login
  it("shows error message with invalid credentials", () => {
    // Intercept the sign-in API call
    cy.intercept("POST", "**/api/auth/sign-in").as("signInRequest");

    cy.visit("/auth/sign-in");

    // Fill in wrong credentials
    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("WrongPassword123!");

    // Submit form
    cy.get('button[type="submit"]').contains("Sign In").click();

    // Wait for request to complete
    cy.wait("@signInRequest");

    // Verify error toast or message is shown
    cy.get(".Toastify__toast-body, .toast-error")
      .should("be.visible")
      .should("contain", "Sign in failed");
  });
});
