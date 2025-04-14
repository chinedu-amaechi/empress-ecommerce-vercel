// 3rd party modules
import { validationResult } from "express-validator";

// Custom modules
import serverResponse from "../utils/serverResponse.js";
import Product from "../models/product.js";
import Collection from "../models/collection.js";
import {
  deleteImage,
  uploadImage,
  uploadImageBuffer,
} from "../utils/helper.js";
import mongoose from "mongoose";
import Customer from "../models/customer.js";

// This function is used to add a new product to the database
export async function postNewProduct(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    const { errors } = validationResult(req);

    if (errors.length > 0) {
      return serverResponse(res, 400, errors[0].msg, null);
    }

    // checking if product with the same name exists
    const productExists = await Product.findOne({ name: req.body.name });
    if (productExists) {
      return serverResponse(
        res,
        400,
        "Product with the same name already exists",
        null
      );
    }

    // Add the product to the database
    const newProduct = new Product({
      ...req.body,
    });
    await newProduct.save();

    return serverResponse(
      res,
      201,
      "Product added successfully",
      newProduct.toObject()
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to get all products from the database
export async function getAllProducts(req, res, next) {
  try {
    const products = await Product.find();
    return serverResponse(
      res,
      200,
      "Products retrieved successfully",
      products
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to get a single product from the database
export async function getSingleProduct(req, res, next) {
  try {
    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }
    return serverResponse(res, 200, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
}

// This function is used to update a product in the database
export async function updateProduct(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    const { errors } = validationResult(req);

    // Check if there are any validation errors
    if (errors.length > 0) {
      return serverResponse(res, 400, errors[0].msg, null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // Update the product in the database
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.stock = req.body.stock;
    product.summary = req.body.summary;
    product.isVisible = req.body.isVisible;

    await product.save();

    return serverResponse(
      res,
      200,
      "Product updated successfully",
      product.toObject()
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to delete a product from the database
export async function deleteProduct(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // Delete the images from cloudinary
    for (const image of product.imagesUrl) {
      if (image.publicId) {
        await deleteImage(image.publicId);
      }
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    return serverResponse(res, 200, "Product deleted successfully", null);
  } catch (error) {
    next(error);
  }
}

export async function changeVisibility(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // Change the visibility of the product
    product.isVisible = !product.isVisible;
    await product.save();

    return serverResponse(
      res,
      200,
      "Product visibility changed successfully",
      product.toObject()
    );
  } catch (error) {
    next(error);
  }
}

export async function addMaterial(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // Check if the material is already in the product
    const materialExists = product.materials.includes(req.body.newMaterial);
    if (materialExists) {
      return serverResponse(
        res,
        400,
        "Material already exists in the product",
        null
      );
    }

    // Add the material to the product
    product.materials.push(req.body.newMaterial);
    await product.save();

    return serverResponse(
      res,
      200,
      "Material added to product successfully",
      product.toObject()
    );
  } catch (error) {
    next(error);
  }
}

export async function removeMaterial(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }
    console.log(req.body);

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // Check if the material is in the product
    const materialIndex = product.materials.indexOf(req.body.material);
    if (materialIndex === -1) {
      return serverResponse(
        res,
        400,
        "Material does not exist in the product",
        null
      );
    }

    // Remove the material from the product
    product.materials.splice(materialIndex, 1);
    await product.save();

    return serverResponse(
      res,
      200,
      "Material removed from product successfully",
      product.toObject()
    );
  } catch (error) {
    next(error);
  }
}

export async function putProductImage(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if there are any validation errors
    if (!req.files.images) {
      return serverResponse(res, 400, "At least one image is required", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // uploading images to cloudinary
    const imagesCloudUrl = [];
    let uploadedImages = req.files.images;

    // Handle single image case (formidable sometimes doesn't return an array for single file)
    if (!Array.isArray(uploadedImages)) {
      uploadedImages = [uploadedImages];
    }

    for (let i = 0; i < uploadedImages.length; i++) {
      const file = uploadedImages[i];
      const publicId = `product-${productId}-${Date.now()}-${i}`;

      try {
        // For serverless environment, use the buffer
        const buffer = Buffer.concat(file._buf || []);

        // Use a data URI for Cloudinary upload
        const base64Data = buffer.toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64Data}`;

        const { optimizeUrl, autoCropUrl } = await uploadImageBuffer(
          dataURI,
          publicId
        );

        imagesCloudUrl.push({ optimizeUrl, autoCropUrl, publicId });
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return serverResponse(
          res,
          500,
          "Failed to upload image to cloud storage",
          null
        );
      }
    }

    // Add the images to the product
    product.imagesUrl.push(...imagesCloudUrl);
    await product.save();

    return serverResponse(
      res,
      200,
      "Images added to product successfully",
      product.toObject()
    );
  } catch (error) {
    console.error("Error in putProductImage:", error);
    next(error);
  }
}

export async function removeProductImage(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // Check if the image is in the product
    const imageIndex = product.imagesUrl.findIndex(
      (image) => image.publicId === req.body.publicId
    );

    if (imageIndex === -1) {
      return serverResponse(
        res,
        400,
        "Image does not exist in the product",
        null
      );
    }

    // Delete the image from cloudinary
    await deleteImage(req.body.publicId);

    // Remove the image from the product
    product.imagesUrl.splice(imageIndex, 1);
    await product.save();

    return serverResponse(
      res,
      200,
      "Image removed from product successfully",
      product.toObject()
    );
  } catch (error) {
    next(error);
  }
}

export async function addToCollection(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.params.productId)
      ? req.params.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the product in the database
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // Check if the collection ID is valid
    const collectionId = mongoose.isValidObjectId(req.body.collectionId)
      ? req.body.collectionId
      : null;

    if (!collectionId) {
      return serverResponse(res, 400, "Invalid collection ID", null);
    }

    // Find the collection in the database
    const collectionExists = await Collection.findById(collectionId);
    if (!collectionExists) {
      return serverResponse(res, 404, "Collection not found", null);
    }

    // Add the product to the collection
    collectionExists.itemsCount = collectionExists.itemsCount + 1;
    collectionExists.products.push(productId);
    await collectionExists.save();

    productExists.collectionId = collectionId;
    await productExists.save();

    return serverResponse(
      res,
      200,
      "Product added to collection successfully",
      productExists.toObject()
    );
  } catch (error) {
    next(error);
  }
}

export async function postNewCollection(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    const { errors } = validationResult(req);

    // Check if there are any validation errors
    if (!req.files.image) {
      return serverResponse(res, 400, "Image is required", null);
    }

    if (errors.length > 0) {
      return serverResponse(res, 400, errors[0].msg, null);
    }

    // checking if collection with the same name exists
    const collectionExists = await Collection.findOne({ name: req.body.name });
    if (collectionExists) {
      return serverResponse(
        res,
        400,
        "Collection with the same name already exists",
        null
      );
    }

    // uploading image to cloudinary
    const publicId = req.body.name + "-" + Date.now();

    // For serverless environment, use the buffer
    const file = req.files.image[0];
    const buffer = Buffer.concat(file._buf || []);

    // Use a data URI for Cloudinary upload
    const base64Data = buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64Data}`;

    const { optimizeUrl, autoCropUrl } = await uploadImageBuffer(
      dataURI,
      publicId
    );

    // Add the collection to the database
    const newCollection = new Collection({
      ...req.body,
      imageUrl: { optimizeUrl, autoCropUrl, publicId },
    });
    await newCollection.save();

    return serverResponse(
      res,
      201,
      "Collection added successfully",
      newCollection.toObject()
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to get all collections from the database
export async function getAllCollections(req, res, next) {
  try {
    const collections = await Collection.find();
    return serverResponse(
      res,
      200,
      "Collections retrieved successfully",
      collections
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to get a single collection from the database
export async function getSingleCollection(req, res, next) {
  try {
    // Check if the collection ID is valid
    const collectionId = mongoose.isValidObjectId(req.params.collectionId)
      ? req.params.collectionId
      : null;

    if (!collectionId) {
      return serverResponse(res, 400, "Invalid collection ID", null);
    }

    // Find the collection in the database
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return serverResponse(res, 404, "Collection not found", null);
    }
    return serverResponse(
      res,
      200,
      "Collection retrieved successfully",
      collection
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to update a collection in the database
export async function updateCollection(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    const { errors } = validationResult(req);

    // Check if there are any validation errors
    if (errors.length > 0) {
      return serverResponse(res, 400, errors[0].msg, null);
    }

    // Check if the collection ID is valid
    const collectionId = mongoose.isValidObjectId(req.params.collectionId)
      ? req.params.collectionId
      : null;

    if (!collectionId) {
      return serverResponse(res, 400, "Invalid collection ID", null);
    }

    const collectionWithSameName = await Collection.findOne({
      name: req.body.name,
      _id: { $ne: collectionId }, // Exclude the current collection
    });

    if (collectionWithSameName) {
      return serverResponse(
        res,
        400,
        "Collection with the same name already exists",
        null
      );
    }

    // Find the collection in the database
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return serverResponse(res, 404, "Collection not found", null);
    }

    // Update basic collection properties
    collection.name = req.body.name;
    collection.description = req.body.description;

    // uploading image to cloudinary if there's a new image
    let imageUrl = collection.imageUrl;
    if (req.files && req.files.image) {
      // Delete the old image from cloudinary
      if (collection.imageUrl && collection.imageUrl.publicId) {
        await deleteImage(collection.imageUrl.publicId);
      }

      const file = req.files.image[0];
      const publicId = req.body.name + "-" + Date.now();

      // For serverless environment, use the buffer
      const buffer = Buffer.concat(file._buf || []);

      // Use a data URI for Cloudinary upload
      const base64Data = buffer.toString("base64");
      const dataURI = `data:${file.mimetype};base64,${base64Data}`;

      imageUrl = await uploadImageBuffer(dataURI, publicId);
    }

    collection.imageUrl = imageUrl;
    await collection.save();

    return serverResponse(
      res,
      200,
      "Collection updated successfully",
      collection.toObject()
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to delete a collection from the database
export async function deleteCollection(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the collection ID is valid
    const collectionId = mongoose.isValidObjectId(req.params.collectionId)
      ? req.params.collectionId
      : null;

    if (!collectionId) {
      return serverResponse(res, 400, "Invalid collection ID", null);
    }

    // Find the collection in the database
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return serverResponse(res, 404, "Collection not found", null);
    }

    // Delete the image from cloudinary
    if (collection.imageUrl && collection.imageUrl.publicId) {
      await deleteImage(collection.imageUrl.publicId);
    }

    // Delete the collection from the database
    await Collection.findByIdAndDelete(collectionId);

    return serverResponse(res, 200, "Collection deleted successfully", null);
  } catch (error) {
    next(error);
  }
}

// This function is used to add a product to a collection
export async function addProductToCollection(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the collection ID is valid
    const collectionId = mongoose.isValidObjectId(req.params.collectionId)
      ? req.params.collectionId
      : null;

    if (!collectionId) {
      return serverResponse(res, 400, "Invalid collection ID", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.body.productId)
      ? req.body.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the collection in the database
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return serverResponse(res, 404, "Collection not found", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // find if the product is already in the collection
    const productExists = collection.products.includes(productId);
    if (productExists) {
      return serverResponse(
        res,
        400,
        "Product already exists in the collection",
        null
      );
    }

    // Add the product to the collection
    collection.products.push(productId);
    collection.itemsCount = collection.itemsCount + 1;
    await collection.save();

    return serverResponse(
      res,
      200,
      "Product added to collection successfully",
      collection.toObject()
    );
  } catch (error) {
    next(error);
  }
}

// This function is used to remove a product from a collection
export async function removeProductFromCollection(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the collection ID is valid
    const collectionId = mongoose.isValidObjectId(req.params.collectionId)
      ? req.params.collectionId
      : null;

    if (!collectionId) {
      return serverResponse(res, 400, "Invalid collection ID", null);
    }

    // Check if the product ID is valid
    const productId = mongoose.isValidObjectId(req.body.productId)
      ? req.body.productId
      : null;

    if (!productId) {
      return serverResponse(res, 400, "Invalid product ID", null);
    }

    // Find the collection in the database
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return serverResponse(res, 404, "Collection not found", null);
    }

    // Find the product in the database
    const product = await Product.findById(productId);
    if (!product) {
      return serverResponse(res, 404, "Product not found", null);
    }

    // find if the product is in the collection
    const productIndex = collection.products.indexOf(productId);
    if (productIndex === -1) {
      return serverResponse(
        res,
        400,
        "Product does not exist in the collection",
        null
      );
    }

    // Remove the product from the collection
    collection.products.splice(productIndex, 1);
    collection.itemsCount = Math.max(0, collection.itemsCount - 1);
    await collection.save();

    return serverResponse(
      res,
      200,
      "Product removed from collection successfully",
      collection.toObject()
    );
  } catch (error) {
    next(error);
  }
}

export async function getAllCustomers(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    const customers = await Customer.find();

    return serverResponse(
      res,
      200,
      "Customers retrieved successfully",
      customers
    );
  } catch (error) {
    next(error);
  }
}

export async function getSingleCustomer(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the customer ID is valid
    const customerId = mongoose.isValidObjectId(req.params.customerId)
      ? req.params.customerId
      : null;

    if (!customerId) {
      return serverResponse(res, 400, "Invalid customer ID", null);
    }

    // Find the customer in the database
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return serverResponse(res, 404, "Customer not found", null);
    }
    return serverResponse(
      res,
      200,
      "Customer retrieved successfully",
      customer
    );
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    // Check if the customer ID is valid
    const customerId = mongoose.isValidObjectId(req.params.customerId)
      ? req.params.customerId
      : null;

    if (!customerId) {
      return serverResponse(res, 400, "Invalid customer ID", null);
    }

    // Find the customer in the database
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return serverResponse(res, 404, "Customer not found", null);
    }

    // Delete the customer from the database
    await Customer.findByIdAndDelete(customerId);

    return serverResponse(res, 200, "Customer deleted successfully", null);
  } catch (error) {
    next(error);
  }
}

export async function getNotifications(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return serverResponse(res, 401, "Unauthorized access", null);
    }

    const lowStockProducts = await Product.find({ stock: { $lt: 5 } });
    return serverResponse(res, 200, "Notifications retrieved successfully", {
      products: lowStockProducts,
      orders: [],
      users: [],
    });
  } catch (error) {
    next(error);
  }
}
