import React, { useEffect, useState } from "react";
import Heading from "../ui/Heading";
import { Add, MoreVert } from "@mui/icons-material";
import CollectionCard from "../ui/CollectionCard";
import useCollections from "../hooks/useCollections";
import Spinner from "../ui/Spinner";
import Modal from "../ui/Modal";
import CollectionForm from "../features/collections/CollectionForm";

function CollectionPage() {
  const [collections, setCollections] = useState([]);
  const { data, isLoading, error } = useCollections();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data) {
      setCollections(data);
    }
  }, [data]);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="bg-[#F4F8FB] p-6">
      {/* Add Collection Button */}
      <div className="mb-8 flex items-center justify-between">
        <Heading level={1} text="Collections" />
        <Modal>
          <Modal.Window />
          <Modal.Open content={<CollectionForm />}>
            <button className="flex items-center gap-2 rounded bg-[#1E96FC] px-3 py-1.5 text-sm text-white shadow-md transition-colors hover:bg-[#1089FF]">
              <Add sx={{ fontSize: "20px" }} />
              <span>Add Collection</span>
            </button>
          </Modal.Open>
        </Modal>
      </div>

      {/* Mini Analysis Section */}
      <div className="mb-8 flex items-center justify-between">
        <div className="w-full rounded-lg bg-white p-6 shadow-lg sm:w-1/3">
          <Heading level={4} text="Analysis" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Total Collections: {collections.length}
            </p>
            <p className="text-sm text-gray-600">
              Active Collections: {filteredCollections.length}
            </p>
            <p className="text-sm text-gray-600">
              Collections Found: {filteredCollections.length}
            </p>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-8 flex items-center justify-between">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search Collections"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fa fa-search absolute top-2.5 left-3 text-gray-500"></i>
        </div>
      </div>

      {/* Collections List */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCollections.length > 0 ? (
          filteredCollections.map((collection) => (
            <CollectionCard collection={collection} key={collection._id} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No collections found
          </p>
        )}
      </div>
    </div>
  );
}

export default CollectionPage;
