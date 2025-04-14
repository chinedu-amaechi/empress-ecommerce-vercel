import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Add, Close, Delete, Search, Visibility } from "@mui/icons-material";

import ProductsTable from "../features/product/ProductsTable";
import Heading from "../ui/Heading";
import Modal from "../ui/Modal";
import ConfirmDelete from "../ui/ConfirmDelete";
import ProductForm from "../features/product/ProductForm";
import useProducts from "../hooks/useProducts";
import Spinner from "../ui/Spinner";
import { deleteProduct } from "../services/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function ProductPage() {
  const navigate = useNavigate();
  const [selectedRowId, setSelectedRowId] = useState(null);
  const { data: productsData, isLoading, error } = useProducts();

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response) => {
      if (response.status === 200) {
        toast.success(response.message);
        setSelectedRowId(null);
      } else {
        toast.error(response.message);
        setSelectedRowId(null);
      }
      queryClient.invalidateQueries("products");
    },
    onError: (error) => {
      toast.error("An error occurred. Please try again later.");
    },
  });

  useEffect(() => {
    if (productsData) {
      setRows(
        productsData.map((product) => {
          const totalRating = product.ratings.reduce(
            (acc, rating) => acc + rating.rating,
            0,
          );
          const avgRating = totalRating / product.ratings.length;
          return {
            ...product,
            id: product._id,
            rating: Number(avgRating) ? avgRating?.toFixed(2) : 0,
          };
        }),
      );
    }
  }, [productsData]);

  const filteredRows = rows.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-[#F8FAFC] px-6 py-4">
      <Modal>
        <Modal.Window />
        <div className="mb-6 flex items-center justify-between">
          <Heading level={2} text="Products List" />
          <Modal.Open content={<ProductForm />}>
            <button className="flex items-center gap-2 rounded bg-[#1E96FC] px-4 py-2 text-white shadow-md transition-colors hover:bg-[#1089FF]">
              <Add sx={{ fontSize: "24px" }} />
              <span>Add Product</span>
            </button>
          </Modal.Open>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center gap-2 rounded-md bg-[#D9EAFD] p-4 shadow-sm">
            {/* Search Input */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-md border border-[#BCCCDC] px-4 py-2 text-[#3C4048] focus:ring-2 focus:ring-[#1E96FC] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <Search />
              </div>
            </div>
          </div>

          {!selectedRowId ? null : (
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1 rounded bg-[#F6F1F1] px-4 py-2 text-[#19A7CE] transition-all hover:bg-[#EAEAEA]"
                onClick={() => navigate(`/products/${selectedRowId}`)}
              >
                <Visibility sx={{ fontSize: "16px" }} />
                <span className="text-sm font-medium">View</span>
              </button>

              <Modal.Open
                content={
                  <ConfirmDelete
                    item={
                      filteredRows.filter((row) => row._id === selectedRowId)[0]
                    }
                    closeModal={
                      <Modal.Close>
                        <button className="flex items-center gap-1 rounded bg-[#F0F4F8] px-4 py-2 text-[#3C4048] transition-all hover:bg-[#E1E9F1]">
                          <Close sx={{ fontSize: "16px" }} />
                          <span className="text-sm font-medium">Close</span>
                        </button>
                      </Modal.Close>
                    }
                    onDelete={() => mutation.mutate(selectedRowId)}
                  />
                }
              >
                <button className="flex items-center gap-1 rounded bg-[#FFDB57] px-4 py-2 text-[#146C94] transition-all hover:bg-[#FFCB05]">
                  <Delete sx={{ fontSize: "16px" }} />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </Modal.Open>
            </div>
          )}

          <ProductsTable
            rows={filteredRows}
            setSelectedRowId={setSelectedRowId}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ProductPage;
