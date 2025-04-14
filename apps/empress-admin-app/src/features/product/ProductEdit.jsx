import React from "react";
import { useForm } from "react-hook-form";
import Heading from "../../ui/Heading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../../services/products";
import toast from "react-hot-toast";

function ProductEditPage({ productData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      isVisible: productData.isVisible,
      summary: productData.summary,
      description: productData.description,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(response.message);
        queryClient.invalidateQueries("products");
      } else {
        toast.error(response.message);
        queryClient.invalidateQueries("products");
      }
    },
    onError: (error) => {
      console.error(error.message);
      toast.error("An error occurred. Please try again later.");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, id: productData._id });
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-lg border border-gray-200 bg-white p-8 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <Heading level={2} text="Edit Product" />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Price</label>
          <input
            type="text"
            {...register("price", {
              required: "Price is required",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Invalid price format",
              },
            })}
            className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Stock</label>
          <input
            type="number"
            {...register("stock", {
              required: "Stock is required",
              min: { value: 0, message: "Stock must be greater than 0" },
            })}
            className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.stock && (
            <p className="text-sm text-red-500">{errors.stock.message}</p>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            {...register("isVisible")}
            className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
          />
          <label className="font-semibold text-gray-700">
            Product Visibility
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-700">Summary</label>
          <textarea
            {...register("summary", { required: "Summary is required" })}
            rows="3"
            className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.summary && (
            <p className="text-sm text-red-500">{errors.summary.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block font-semibold text-gray-700">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows="5"
            className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="mt-6 text-right md:col-span-2">
          <button
            type="submit"
            className="rounded bg-green-500 px-6 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductEditPage;
