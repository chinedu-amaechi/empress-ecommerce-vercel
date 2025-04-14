import React, { useState } from "react";
import { Switch, Rating, Select, MenuItem, Button } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Heading from "../../ui/Heading";
import {
  addMaterialToProduct,
  addProductImage,
  addProductToCollection,
  removeMaterialFromProduct,
  removeProductImage,
  switchVisibility,
} from "../../services/products";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

function ProductOverview({ productData, collectionsData }) {
  const [product, setProduct] = useState({
    ...productData,
    collection:
      collectionsData.find(
        (collection) => collection._id === productData.collectionId,
      ) || null,
    images: productData.imagesUrl, // Map imagesUrl to images for easy manipulation
  });

  const queryClient = useQueryClient();

  async function toggleVisibility() {
    try {
      setProduct((prev) => ({ ...prev, isVisible: !prev.isVisible }));
      const response = await switchVisibility(product._id);
      console.log(response);
      toast.success(response.message);
      queryClient.invalidateQueries("products");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleImageUpload(event) {
    try {
      const files = Array.from(event.target.files);
      console.log(files);

      const response = await addProductImage({
        images: files,
        id: product._id,
      });
      console.log(response);

      if (response.status === 200) {
        toast.success(response.message);
        queryClient.invalidateQueries("products");
        setProduct((prev) => ({
          ...prev,
          images: response.data.imagesUrl,
        }));
      } else {
        toast.error(
          "An error occurred while uploading images. Please try again.",
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeImage(publicId) {
    try {
      const response = await removeProductImage({
        id: product._id,
        publicId,
      });

      if (response.status === 200) {
        toast.success(response.message);
        queryClient.invalidateQueries("products");
        setProduct((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img.publicId !== publicId),
        }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addMaterial() {
    try {
      const newMaterial = prompt("Enter new material:");
      console.log(newMaterial);

      if (newMaterial) {
        const response = await addMaterialToProduct({
          newMaterial,
          id: product._id,
        });
        console.log(response);

        if (response.status === 200) {
          toast.success(response.message);
          queryClient.invalidateQueries("products");
          setProduct((prev) => ({
            ...prev,
            materials: [...prev.materials, newMaterial],
          }));
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeMaterial(material) {
    try {
      const response = await removeMaterialFromProduct({
        id: product._id,
        material: material,
      });

      if (response.status === 200) {
        toast.success(response.message);
        queryClient.invalidateQueries("products");
        setProduct((prev) => ({
          ...prev,
          materials: prev.materials.filter((m) => m !== material),
        }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCollectionChange(event) {
    try {
      setProduct((prev) => ({
        ...prev,
        collection: collectionsData.find(
          (collection) => collection._id === event.target.value,
        ),
      }));

      const response = await addProductToCollection({
        id: product._id,
        collectionId: event.target.value,
      });

      if (response.status === 200) {
        toast.success(response.message);
        queryClient.invalidateQueries("products");
      } else {
        toast.error("An error occurred while changing the collection.");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      {/* Flex Layout for Panels */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Panel - Main Product Info */}
        <motion.div
          className="flex-1 rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <Heading level={2} text={product.name} />
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Visible</span>
              <Switch
                checked={product.isVisible}
                onChange={toggleVisibility}
                color="primary"
              />
            </div>
          </div>

          {/* Grid Layout for Price, Stock, Revenue, Items Sold */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {[
              {
                label: "Price",
                value: `$${product.price.toFixed(2)}`,
                color: "text-blue-500",
              },
              {
                label: "Stock",
                value: `${product.stock} items`,
                color: "text-green-500",
              },
              {
                label: "Revenue",
                value: `$${product.revenue.toLocaleString()}`,
                color: "text-purple-500",
              },
              {
                label: "Items Sold",
                value: product.itemsSold,
                color: "text-blue-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="rounded-lg bg-gray-100 p-5"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg text-gray-600">{item.label}</p>
                <p className={`text-xl font-bold ${item.color}`}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Heading level={5} text="Product Summary" />
            <p className="mt-2 text-gray-600">{product.summary}</p>
          </div>
          <div className="mt-6">
            <Heading level={5} text="Description" />
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>
          <div className="mt-8">
            <Heading level={5} text="Product Collection" />
            <Select
              value={product.collection?._id || ""}
              onChange={handleCollectionChange}
              className="mt-2 w-full"
            >
              {collectionsData.map((collection) => (
                <MenuItem key={collection._id} value={collection._id}>
                  {collection.name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </motion.div>

        {/* Right Panel - Images & Materials */}
        <motion.div
          className="flex-1 rounded-lg bg-white p-6 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Heading level={5} text="Product Images" />
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="mb-4 block w-full text-sm"
          />
          <div className="flex flex-wrap gap-6">
            <AnimatePresence>
              {product.images.map((img, index) => (
                <motion.div
                  key={index}
                  className="relative overflow-hidden rounded-lg shadow-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  <img
                    src={img.optimizeUrl}
                    alt={`Product Image ${index + 1}`}
                    className="h-32 w-full rounded-lg object-cover transition duration-300"
                  />
                  <button
                    onClick={() => removeImage(img.publicId)}
                    className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-700"
                  >
                    <Delete />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Materials Section */}
          <Heading level={5} text="Materials" />
          <ul className="mt-4 space-y-2">
            {product.materials.map((material, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{material}</span>
                <button
                  onClick={() => removeMaterial(material)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Delete />
                </button>
              </li>
            ))}
          </ul>
          <Button
            onClick={addMaterial}
            variant="outlined"
            color="primary"
            startIcon={<Add />}
            className="mt-6"
          >
            Add Material
          </Button>

          {/* Reviews Section */}
          <Heading level={5} text="Reviews & Ratings" />
          <div className="mt-4 flex items-center">
            <Rating
              value={
                product.ratings.reduce((acc, { rating }) => acc + rating, 0) /
                  product.ratings.length || 0
              }
              precision={0.5}
              readOnly
            />
            <span className="ml-2 text-gray-600">
              (
              {(
                product.ratings.reduce((acc, { rating }) => acc + rating, 0) /
                  product.ratings.length || 0
              ).toFixed(1)}
              /5)
            </span>
          </div>
          <ul className="mt-4 space-y-4">
            {product.ratings.map((review, index) => (
              <li key={index} className="border-b pb-4 text-gray-700">
                <strong>{review.user}:</strong> {review.comment}
                <Rating value={review.rating} size="small" readOnly />
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductOverview;
