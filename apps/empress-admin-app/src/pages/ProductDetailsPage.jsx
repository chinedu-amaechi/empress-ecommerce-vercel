import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "../ui/Modal";
import Heading from "../ui/Heading";
import { Add, Details, Edit } from "@mui/icons-material";
import ProductOverview from "../features/product/ProductOverview";
import ProductEditPage from "../features/product/ProductEdit";
import ProductForm from "../features/product/ProductForm";
import Spinner from "../ui/Spinner";
import useProducts from "../hooks/useProducts";
import useCollections from "../hooks/useCollections";

function ProductDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [product, setProduct] = useState(null);
  const [collections, setCollections] = useState(null);

  const {
    data: productsData,
    isLoading: productsIsLoading,
    error: productsError,
  } = useProducts();
  const {
    data: collectionsData,
    isLoading: collectionsIsLoading,
    error: collectionsError,
  } = useCollections();

  useEffect(() => {
    async function fetchData() {
      if (!productsIsLoading && productsData) {
        setProduct(productsData.find((product) => product._id === id));
      }
    }
    fetchData();
  }, [id, productsData, productsIsLoading]);

  useEffect(() => {
    async function fetchData() {
      if (!collectionsIsLoading && collectionsData) {
        setCollections(collectionsData);
      }
    }
    fetchData();
  }, [collectionsData, collectionsIsLoading]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (productsIsLoading || collectionsIsLoading) {
    return <Spinner />;
  }

  if (productsError || collectionsError) {
    return <div>An error occurred. Please try again later.</div>;
  }

  return (
    product && (
      <div className="bg-[#F8FAFC] p-6">
        <Modal>
          <Modal.Window />
          <div className="mb-6 flex items-center justify-between">
            <Heading level={2} text={product?.name.toUpperCase()} />

            <Modal.Open content={<ProductForm />}>
              <button className="flex items-center space-x-2 rounded bg-[#1E96FC] px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:bg-[#1089FF]">
                <Add sx={{ fontSize: "24px" }} />
                <span>Add Product</span>
              </button>
            </Modal.Open>
          </div>
        </Modal>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => handleTabChange("overview")}
            className={`flex items-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-[#1E96FC] text-white"
                : "bg-[#D9EAFD] text-[#3C4048] hover:bg-[#BCCCDC]"
            }`}
          >
            <Details sx={{ fontSize: "16px" }} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleTabChange("edit")}
            className={`flex items-center rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              activeTab === "edit"
                ? "bg-[#1E96FC] text-white"
                : "bg-[#D9EAFD] text-[#3C4048] hover:bg-[#BCCCDC]"
            }`}
          >
            <Edit sx={{ fontSize: "16px" }} />
            <span>Edit</span>
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-md">
          {activeTab === "overview" && (
            <ProductOverview
              productId={id}
              productData={product}
              collectionsData={collections}
            />
          )}

          {activeTab === "edit" && (
            <ProductEditPage productId={id} productData={product} />
          )}
        </div>
      </div>
    )
  );
}

export default ProductDetailsPage;
