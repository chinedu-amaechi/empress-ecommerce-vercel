import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  postNewCollection,
  updateCollection,
} from "../../services/collections";
import toast from "react-hot-toast";
import Heading from "../../ui/Heading";
import Spinner from "../../ui/Spinner";

function CollectionForm({ collection }) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: { name: "", description: "", image: "" },
  });

  useEffect(() => {
    if (collection) {
      setValue("name", collection.name);
      setValue("description", collection.description);
    }
  }, [collection, setValue]);

  const postMutation = useMutation({
    mutationFn: postNewCollection,
    onSuccess: (data) => {
      if (data.status === 201) {
        toast.success(data.message);
        reset();
        queryClient.invalidateQueries("collections");
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCollection,
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success("Collection updated successfully 🎉");
        queryClient.invalidateQueries("collections");
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    setIsLoading(true);
    if (collection) {
      updateMutation.mutate({ ...data, id: collection._id });
    } else {
      postMutation.mutate(data);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-5xl rounded-lg bg-white p-8 shadow-lg"
    >
      <div className="mb-6 flex items-center justify-between">
        <Heading
          level={2}
          text={collection ? "Edit Collection" : "Create Collection"}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block font-semibold text-[#001D3D]/80">
            Collection Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Collection name is required" })}
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-[#001D3D]/80">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows="4"
            className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <label className="block font-semibold text-[#001D3D]/80">Image</label>
        <input
          type="file"
          {...register("image")}
          className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 text-[#001D3D]/70 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="mt-8 text-right">
        <button
          type="submit"
          className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-700"
        >
          {collection ? "Update" : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default CollectionForm;
