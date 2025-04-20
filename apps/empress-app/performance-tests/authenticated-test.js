// apps/empress-app/performance-tests/authenticated-test.js
import http from "k6/http";
import { check, sleep } from "k6";
import { config } from "./config.js"; // Adjust the path as necessary

export let options = {
  vus: 5,
  duration: "30s",
};

export default function () {
  const baseUrl = "config.baseUrl"; // Use the base URL from config file

  // Step 1: Visit the login page
  let loginPageRes = http.get(`${baseUrl}/auth/sign-in`);
  check(loginPageRes, {
    "login page loaded": (r) => r.status === 200,
  });

  const apiUrl = config.apiUrl; // Use the API URL from config file

  // Step 2: Submit login form (adjust this to match your actual login process)
  let loginPayload = {
    email: "test@example.com", // Use test accounts for this purpose
    password: "testpassword123",
  };

  let loginRes = http.post(
    `${baseUrl}/api/auth/login`,
    JSON.stringify(loginPayload),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(loginRes, {
    "login successful": (r) => r.status === 200,
  });

  // Extract any cookies or tokens needed for subsequent requests
  let authToken = loginRes.json("token");

  // Step 3: Access authenticated pages with the token
  let cartRes = http.get(`${baseUrl}/cart`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  check(cartRes, {
    "authenticated cart page loaded": (r) => r.status === 200,
  });

  sleep(1);
}
