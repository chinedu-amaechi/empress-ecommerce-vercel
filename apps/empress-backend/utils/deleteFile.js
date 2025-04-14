// For serverless environments, file deletion is handled differently

export default async function deleteFile(filePath) {
  // In a serverless environment, this is a no-op
  // When running locally, we can still delete files
  if (process.env.NODE_ENV !== "production" && filePath) {
    try {
      const fs = await import("fs");
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    } catch (error) {
      console.error("Error importing fs module:", error);
    }
  }
  return true;
}
