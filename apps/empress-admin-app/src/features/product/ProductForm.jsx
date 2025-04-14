import React from "react";
import { useForm } from "react-hook-form";
import Heading from "../../ui/Heading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postNewProduct } from "../../services/products";
import toast from "react-hot-toast";

function ProductForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      isVisible: true,
      description: "",
      summary: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postNewProduct,
    onSuccess: (response) => {
      // alert("Product added successfully!");
      console.log(response);

      if (response.status === 201) {
        toast.success(response.message);
        reset();
        queryClient.invalidateQueries("products");
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      // alert("An error occurred. Please try again later.");
      console.error(error.message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const toggleVisibility = () => {
    setValue("isVisible", !watch("isVisible"));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-5xl rounded-lg bg-white p-8 shadow-lg"
    >
      <div className="mb-6 flex items-center justify-between">
        <Heading level={2} text="Add Product" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block font-semibold text-[#001D3D]/80">
            Product Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-[#001D3D]/80">Price</label>
          <input
            type="text"
            {...register("price", {
              required: "Price is required",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Invalid price format",
              },
            })}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-[#001D3D]/80">Stock</label>
          <input
            type="number"
            {...register("stock", { required: "Stock is required" })}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label className="flex items-center gap-3 font-semibold text-[#001D3D]/80">
          <input
            type="checkbox"
            {...register("isVisible")}
            onChange={toggleVisibility}
            className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
          />
          <span>Product Visibility</span>
        </label>
      </div>
      <div className="mt-6">
        <label className="block font-semibold text-[#001D3D]/80">Summary</label>
        <textarea
          {...register("summary", { required: "Summary is required" })}
          rows="2"
          className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.summary && (
          <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
        )}
      </div>
      <div className="mt-4">
        <label className="block font-semibold text-[#001D3D]/80">
          Description
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          rows="4"
          className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
      <div className="mt-8 text-right">
        <button
          type="submit"
          className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-700"
        >
          Add Product
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
