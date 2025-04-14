// apps/empress-admin-app/src/services/__tests__/authentication.test.js
import { postLogin, checkAuthentication } from "../../services/authentication";
import backendUrl from "../../utils/backendUrl";

// Mock fetch
global.fetch = jest.fn();
global.sessionStorage = {
  getItem: jest.fn(),
};

describe("Authentication Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("postLogin makes a POST request to the login endpoint", async () => {
    // Mock successful login response
    const mockResponse = {
      status: 200,
      message: "Login successful",
      data: {
        token: "test-token",
        user: { email: "admin@example.com" },
      },
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call postLogin
    const loginData = { email: "admin@example.com", password: "password123" };
    const result = await postLogin(loginData);

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/auth/login/admin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      },
    );

    // Check that the response is returned correctly
    expect(result).toEqual(mockResponse);
  });

  it("postLogin handles errors gracefully", async () => {
    // Setup mock fetch to throw an error
    global.fetch.mockRejectedValueOnce({
      message: "Network error",
      data: null,
    });

    // Call postLogin
    const loginData = { email: "admin@example.com", password: "password123" };
    const result = await postLogin(loginData);

    // Check that the error is handled and returned
    expect(result).toEqual(null);
    expect(console.error).toHaveBeenCalled();
  });

  it("checkAuthentication makes a GET request to the auth check endpoint", async () => {
    // Mock successful auth check response
    const mockResponse = {
      status: 200,
      message: "Authenticated",
      data: {
        user: { email: "admin@example.com" },
      },
    };

    // Setup mock fetch to return success
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call checkAuthentication
    const authData = { token: "test-token" };
    const result = await checkAuthentication(authData);

    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/api/auth/check/auth`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "test-token",
        },
      },
    );

    // Check that the response is returned correctly
    expect(result).toEqual(mockResponse);
  });

  it("checkAuthentication handles errors gracefully", async () => {
    // Setup mock fetch to throw an error
    global.fetch.mockRejectedValueOnce({
      message: "Network error",
      data: null,
    });

    // Call checkAuthentication
    const authData = { token: "test-token" };
    const result = await checkAuthentication(authData);

    // Check that the error is handled and returned
    expect(result).toEqual(null);
    expect(console.error).toHaveBeenCalled();
  });
});
