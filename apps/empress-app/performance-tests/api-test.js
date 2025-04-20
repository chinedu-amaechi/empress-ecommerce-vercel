// apps/empress-app/performance-tests/api-test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { config } from "./config.js";

export let options = {
  vus: 50,
  duration: "1m",
};

export default function () {
  // Use the config baseUrl instead of hardcoding
  const baseUrl = config.apiUrl; // Use the API URL from config file

  // Test collections API
  let collectionsRes = http.get(`${baseUrl}/api/admin/collections`);
  check(collectionsRes, {
    "collections API status is 200": (r) => r.status === 200,
    "collections API response time < 200ms": (r) => r.timings.duration < 200,
  });

  // Test products API
  let productsRes = http.get(`${baseUrl}/api/admin/products`);
  check(productsRes, {
    "products API status is 200": (r) => r.status === 200,
    "products API response time < 300ms": (r) => r.timings.duration < 300,
  });

  sleep(1);
}