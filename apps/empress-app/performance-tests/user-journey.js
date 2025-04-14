// apps/empress-app/performance-tests/user-journey.js
import http from "k6/http";
import { check, sleep, group } from "k6";

export let options = {
  stages: [
    { duration: "1m", target: 20 }, // Ramp up to 20 users over 1 minute
    { duration: "3m", target: 20 }, // Stay at 20 users for 3 minutes
    { duration: "1m", target: 0 }, // Ramp down to 0 users over 1 minute
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must complete within 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests can fail
  },
};

export default function () {
  const baseUrl = "http://localhost:3000";

  group("Visit Homepage", function () {
    let homeRes = http.get(baseUrl);
    check(homeRes, {
      "homepage status is 200": (r) => r.status === 200,
    });
    sleep(2);
  });

  group("Browse Collections", function () {
    let collectionsRes = http.get(`${baseUrl}/collections`);
    check(collectionsRes, {
      "collections page status is 200": (r) => r.status === 200,
    });
    sleep(2);
  });

  group("View Product Details", function () {
    // This assumes you have a product with this URL structure
    // Adjust based on your actual URL structure
    let productRes = http.get(`${baseUrl}/products`);
    check(productRes, {
      "product page status is 200": (r) => r.status === 200,
    });
    sleep(3);
  });
}
