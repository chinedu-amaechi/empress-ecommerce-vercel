import { v2 as cloudinary } from "cloudinary";

// Configure cloudinary
const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

// Original function for local development or filepath upload
export async function uploadImage(filePath, publicId) {
  try {
    configureCloudinary();

    // Upload an image
    await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
    });

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });

    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url(publicId, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });
    return { optimizeUrl, autoCropUrl, publicId };
  } catch (error) {
    console.error("Error uploading image to cloudinary:", error);
    throw error;
  }
}

// New function for serverless environments to upload from buffer
export async function uploadImageBuffer(imageData, mimetype, publicId) {
  try {
    configureCloudinary();

    // Convert buffer to base64 data URI
    const base64Data = imageData.toString("base64");
    const dataURI = `data:${mimetype};base64,${base64Data}`;

    // Upload to Cloudinary
    await cloudinary.uploader.upload(dataURI, {
      public_id: publicId,
    });

    // Generate URLs using the public ID
    const optimizeUrl = cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
    });

    const autoCropUrl = cloudinary.url(publicId, {
      crop: "auto",
      gravity: "auto",
      width: 500,
      height: 500,
    });

    return { optimizeUrl, autoCropUrl, publicId };
  } catch (error) {
    console.error("Error uploading image buffer to cloudinary:", error);
    throw error;
  }
}

// Helper to get image buffer from various file formats
export async function getImageBuffer(file) {
  // Check various possible buffer locations based on how formidable works
  if (file.buffer) {
    return file.buffer;
  } else if (file._buf && Array.isArray(file._buf)) {
    return Buffer.concat(file._buf);
  } else if (file.filepath) {
    // Fallback for dev environment
    try {
      const fs = await import("fs").then((m) => m.default || m);
      return await fs.promises.readFile(file.filepath);
    } catch (err) {
      console.error("Error reading file:", err);
      throw new Error("Failed to read image file");
    }
  } else {
    throw new Error("No valid image data found");
  }
}

export async function deleteImage(publicId) {
  try {
    configureCloudinary();

    // Delete an image
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting image from cloudinary:", error);
    return false;
  }
}
