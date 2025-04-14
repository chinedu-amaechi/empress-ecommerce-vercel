// 3rd party modules
import express from "express";
import formidable from "formidable";

// Custom modules
import * as adminControllers from "../controllers/admin.js";
import productValidationRules from "../utils/rules/productRules.js";
import collectionValidationRules from "../utils/rules/collectionRules.js";
import { checkAuthMiddleware } from "../utils/middleware.js";
import Admin from "../models/admin.js";

/*
 * The express.Router class can be used to create modular, mountable route handlers.
 */
const router = express.Router();

// Route to add a new product
router.post(
  "/product/new",
  async (req, res, next) => {
    await checkAuthMiddleware(req, Admin);
    next();
  },
  productValidationRules,
  adminControllers.postNewProduct
);

// Route to get all products
router.get("/products", adminControllers.getAllProducts);

// Route to get a single product
router.get("/product/:productId", adminControllers.getSingleProduct);

// Route to update a product
router.put(
  "/product/update/:productId",
  async (req, res, next) => {
    await checkAuthMiddleware(req, Admin);
    next();
  },
  productValidationRules,
  adminControllers.updateProduct
);

// Route to delete a product
router.delete("/product/delete/:productId", adminControllers.deleteProduct);

// Route to change the visibility of a product
router.put("/product/visibility/:productId", adminControllers.changeVisibility);

// Route to add a new material to a product
router.put("/product/add-material/:productId", adminControllers.addMaterial);

// Route to remove a material from a product
router.delete(
  "/product/remove-material/:productId",
  adminControllers.removeMaterial
);

// Route to add a product to a collection
router.put(
  "/product/add-to-collection/:productId",
  adminControllers.addToCollection
);

// Route to add new images to a product
router.put(
  "/product/add-images/:productId",
  (req, res, next) => {
    // Modified formidable setup for serverless environment
    const form = formidable({
      // Config options
      maxFiles: 5,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      multiples: true,
      keepExtensions: true,

      // Remove disk storage for serverless compatibility
      uploadDir: undefined,

      // Use memory storage instead
      fileWriteStreamHandler: () => {
        const chunks = [];
        return {
          write: (chunk) => {
            chunks.push(chunk);
          },
          end: function () {
            this.buffer = Buffer.concat(chunks);
          },
          destroy: () => {},
        };
      },

      // Only allow image files
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes("image");
      },
    });

    // Parse the form
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return next(err);
      }

      // Store files for access in the controller
      req.files = files;

      // Store additional metadata on each file to make it accessible in the controller
      if (req.files && req.files.images) {
        if (Array.isArray(req.files.images)) {
          req.files.images.forEach((file) => {
            // Ensure we have buffer access
            if (file.filepath && !file.buffer) {
              try {
                // If for some reason we're in dev mode with real files
                const fs = require("fs");
                file.buffer = fs.readFileSync(file.filepath);
              } catch (error) {
                console.error("Error reading file:", error);
              }
            }
          });
        } else {
          // Handle single file case
          const file = req.files.images;
          if (file.filepath && !file.buffer) {
            try {
              const fs = require("fs");
              file.buffer = fs.readFileSync(file.filepath);
            } catch (error) {
              console.error("Error reading file:", error);
            }
          }
        }
      }

      next();
    });
  },
  adminControllers.putProductImage
);

// Route to remove an image from a product
router.delete(
  "/product/remove-image/:productId",
  adminControllers.removeProductImage
);

// Route to add a new collection
router.post(
  "/collection/new",
  (req, res, next) => {
    // Modified formidable setup for serverless environment
    const form = formidable({
      // Config options
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      keepExtensions: true,

      // Remove disk storage for serverless compatibility
      uploadDir: undefined,

      // Use memory storage instead
      fileWriteStreamHandler: () => {
        const chunks = [];
        return {
          write: (chunk) => {
            chunks.push(chunk);
          },
          end: function () {
            this.buffer = Buffer.concat(chunks);
          },
          destroy: () => {},
        };
      },

      // Only allow image files
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes("image");
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return next(err);
      }

      // Process form fields - formidable in newer versions returns arrays
      const cleanReqBody = {};
      for (const [key, value] of Object.entries(fields)) {
        cleanReqBody[key] = Array.isArray(value) ? value[0] : value;
      }

      req.body = cleanReqBody;
      req.files = files;

      // Ensure we have buffer access for collection image
      if (req.files && req.files.image) {
        if (Array.isArray(req.files.image)) {
          req.files.image.forEach((file) => {
            if (file.filepath && !file.buffer) {
              try {
                const fs = require("fs");
                file.buffer = fs.readFileSync(file.filepath);
              } catch (error) {
                console.error("Error reading file:", error);
              }
            }
          });
        } else {
          // Handle single file case
          const file = req.files.image;
          if (file.filepath && !file.buffer) {
            try {
              const fs = require("fs");
              file.buffer = fs.readFileSync(file.filepath);
            } catch (error) {
              console.error("Error reading file:", error);
            }
          }
        }
      }

      next();
    });
  },
  async (req, res, next) => {
    await checkAuthMiddleware(req, Admin);
    next();
  },
  collectionValidationRules,
  adminControllers.postNewCollection
);

// Route to get all collections
router.get("/collections", adminControllers.getAllCollections);

// Route to get a single collection
router.get("/collection/:collectionId", adminControllers.getSingleCollection);

// Route to update a collection
router.put(
  "/collection/update/:collectionId",
  (req, res, next) => {
    // Modified formidable setup for serverless environment
    const form = formidable({
      // Config options
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      keepExtensions: true,

      // Remove disk storage for serverless compatibility
      uploadDir: undefined,

      // Use memory storage instead
      fileWriteStreamHandler: () => {
        const chunks = [];
        return {
          write: (chunk) => {
            chunks.push(chunk);
          },
          end: function () {
            this.buffer = Buffer.concat(chunks);
          },
          destroy: () => {},
        };
      },

      // Only allow image files
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes("image");
      },
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return next(err);
      }

      // Process form fields - formidable in newer versions returns arrays
      const cleanReqBody = {};
      for (const [key, value] of Object.entries(fields)) {
        cleanReqBody[key] = Array.isArray(value) ? value[0] : value;
      }

      req.body = cleanReqBody;
      req.files = files;

      // Ensure we have buffer access for collection image
      if (req.files && req.files.image) {
        if (Array.isArray(req.files.image)) {
          req.files.image.forEach((file) => {
            if (file.filepath && !file.buffer) {
              try {
                const fs = require("fs");
                file.buffer = fs.readFileSync(file.filepath);
              } catch (error) {
                console.error("Error reading file:", error);
              }
            }
          });
        } else {
          // Handle single file case
          const file = req.files.image;
          if (file.filepath && !file.buffer) {
            try {
              const fs = require("fs");
              file.buffer = fs.readFileSync(file.filepath);
            } catch (error) {
              console.error("Error reading file:", error);
            }
          }
        }
      }

      next();
    });
  },
  async (req, res, next) => {
    await checkAuthMiddleware(req, Admin);
    next();
  },
  collectionValidationRules,
  adminControllers.updateCollection
);

// Route to delete a collection
router.delete(
  "/collection/delete/:collectionId",
  adminControllers.deleteCollection
);

// Route to add a product to a collection
router.put(
  "/collection/add-product/:collectionId",
  adminControllers.addProductToCollection
);

// Route to remove a product from a collection
router.delete(
  "/collection/remove-product/:collectionId",
  adminControllers.removeProductFromCollection
);

// Route to get all customers
router.get("/customers", adminControllers.getAllCustomers);

// Route to get a single customer
router.get("/customer/:customerId", adminControllers.getSingleCustomer);

// Route to delete a customer
router.delete("/customer/delete/:customerId", adminControllers.deleteCustomer);

// Route to get notifications for the admin
router.get("/notifications", adminControllers.getNotifications);

export default router;