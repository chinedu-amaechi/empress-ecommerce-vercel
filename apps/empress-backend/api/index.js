import app from "../index.js";

// Export a function that handles API requests
export default async function handler(req, res) {
  // Forward the request to your Express app
  return app(req, res);
}
