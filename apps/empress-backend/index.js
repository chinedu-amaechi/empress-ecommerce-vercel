// 3rd party modules
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Custom modules
import serverResponse from "./utils/serverResponse.js";
import Admin from "./models/admin.js";

// Routes
import adminRoutes from "./routes/admin.js";
import customerRoutes from "./routes/customer.js";
import authRoutes from "./routes/auth.js";
import { checkAuthMiddleware } from "./utils/middleware.js";
import Customer from "./models/customer.js";

/**
 * Initializes and configures the Express application.
 */
const app = express();

// Load environment variables
dotenv.config();

// Database connection handler with connection pooling optimized for serverless
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to MongoDB
  const client = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME,
    // These options help with serverless environments
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  cachedDb = client;
  return client;
}

// Connect to database on startup
connectToDatabase().catch((err) =>
  console.error("Database connection error:", err)
);

// Middleware
app.use(bodyParser.json());

// Enable CORS for specific domains
// This is important for serverless functions to work with Vercel
app.use(
  cors({
    origin: [
      "https://your-admin-app.vercel.app", // Replace with actual domain after deployment
      "https://your-customer-app.vercel.app", // Replace with actual domain after deployment
      "http://localhost:5173", // Admin app dev environment
      "http://localhost:3000", // Customer app dev environment
    ],
    credentials: true,
  })
);

// custom middleware
// route to check if the request is authenticated
app.use(async (req, res, next) => {
  const adminIsAuthenticated = await checkAuthMiddleware(
    req,
    Admin,
    process.env.JWT_SECRET
  );
  const customerIsAuthenticated = await checkAuthMiddleware(
    req,
    Customer,
    process.env.JWT_SECRET
  );

  if (adminIsAuthenticated) {
    req.user = { ...adminIsAuthenticated, role: "admin" };

    return next();
  }

  if (customerIsAuthenticated) {
    req.user = { ...customerIsAuthenticated, role: "customer" };
  }
  next();
});

// Routes
app.get("/", (req, res) => {
  return serverResponse(res, 200, "Welcome to the Empress API", null);
});

app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/auth", authRoutes);

// 404 route
app.use((req, res) => {
  return serverResponse(res, 404, "Route not found", null);
});

// Error handling
app.use((error, req, res, next) => {
  console.error(error);
  return serverResponse(res, 500, "Internal server error", null);
});

// Start server if not in serverless environment
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export for serverless use
export default app;
