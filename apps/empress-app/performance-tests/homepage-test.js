// apps/empress-app/performance-tests/homepage-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 10, // Virtual Users (simulated users)
  duration: "30s", // Test duration
};

export default function () {
  // Make a GET request to the homepage
  let res = http.get("http://localhost:3000");

  // Check if the status is 200 OK
  check(res, {
    "homepage status is 200": (r) => r.status === 200,
    "homepage loads in less than 500ms": (r) => r.timings.duration < 500,
  });

  // Wait between requests
  sleep(1);
}
