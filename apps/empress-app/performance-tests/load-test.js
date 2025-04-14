// apps/empress-app/performance-tests/load-test.js
import http from "k6/http";
import { check, sleep, group } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";
import { randomItem } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

// Custom metrics
const pageLoads = new Counter("page_loads");
const errorRate = new Rate("errors");
const cartAddTime = new Trend("cart_add_time");

export let options = {
  scenarios: {
    browsing: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 50 },
        { duration: "2m", target: 50 },
        { duration: "1m", target: 0 },
      ],
      gracefulRampDown: "30s",
      exec: "browsingJourney",
    },
    shopping: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 20 },
        { duration: "2m", target: 20 },
        { duration: "1m", target: 0 },
      ],
      gracefulRampDown: "30s",
      exec: "shoppingJourney",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    errors: ["rate<0.01"],
    cart_add_time: ["p(95)<400"],
  },
};

// Users who just browse the site
export function browsingJourney() {
  const baseUrl = "http://localhost:3000";

  group("Homepage Visit", function () {
    let res = http.get(baseUrl);
    check(res, {
      "homepage loaded": (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoads.add(1);
    sleep(Math.random() * 3 + 1); // Random sleep between 1-4 seconds
  });

  group("Collection Browsing", function () {
    // Randomly select one of the collections
    const collections = ["Ethereal", "Divine", "Heritage", "Celestial Bloom"];
    const selectedCollection = randomItem(collections);

    let res = http.get(
      `${baseUrl}/collections?collection=${selectedCollection}`
    );
    check(res, {
      "collection page loaded": (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoads.add(1);
    sleep(Math.random() * 5 + 2); // Random sleep between 2-7 seconds
  });
}

// Users who shop and add to cart
export function shoppingJourney() {
  const baseUrl = "http://localhost:3000";

  group("Homepage and Navigation", function () {
    let res = http.get(baseUrl);
    check(res, {
      "homepage loaded": (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoads.add(1);
    sleep(Math.random() * 2 + 1);
  });

  group("Product Browsing", function () {
    let res = http.get(`${baseUrl}/products`);
    check(res, {
      "products page loaded": (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoads.add(1);
    sleep(Math.random() * 3 + 2);
  });

  group("Product Detail and Add to Cart", function () {
    // This would need to be adjusted to use actual product IDs from your system
    let productId = "ethereal-1"; // Example product ID
    let collectionId = "ethereal"; // Example collection ID

    let res = http.get(
      `${baseUrl}/collections/${collectionId}/products/${productId}`
    );
    check(res, {
      "product detail page loaded": (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoads.add(1);
    sleep(Math.random() * 5 + 3);

    // Simulate adding to cart
    let startTime = new Date();
    let addToCartRes = http.post(
      `${baseUrl}/api/cart/add`,
      JSON.stringify({
        productId: productId,
        quantity: 1,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    let addToCartDuration = new Date() - startTime;
    cartAddTime.add(addToCartDuration);

    check(addToCartRes, {
      "product added to cart": (r) => r.status === 200,
    }) || errorRate.add(1);

    sleep(Math.random() * 2 + 1);
  });

  group("View Cart", function () {
    let res = http.get(`${baseUrl}/cart`);
    check(res, {
      "cart page loaded": (r) => r.status === 200,
    }) || errorRate.add(1);
    pageLoads.add(1);
    sleep(Math.random() * 3 + 2);
  });
}
