// apps/empress-app/performance-tests/config.js
export const config = {
  baseUrl: "http://localhost:3000",
  apiUrl: "http://empress-backend.vercel.app",
  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    http_req_failed: ["rate<0.01"],
  },
  sleep: {
    min: 1,
    max: 5,
  },
};
