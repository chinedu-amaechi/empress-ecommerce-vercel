import { MoreVert } from "@mui/icons-material";
import { useState } from "react";
import Heading from "./Heading";
import Modal from "./Modal";
import ConfirmDelete from "./ConfirmDelete";
import CollectionForm from "../features/collections/CollectionForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCollection } from "../services/collections";
import toast from "react-hot-toast";

function CollectionCard({ collection }) {
  const [menuOpen, setMenuOpen] = useState(false);
  console.log(collection);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: (data) => {
      if (data.status === 200) {
        toast.success("Collection deleted successfully 🎉");
        queryClient.invalidateQueries("collections");
      } else {
        toast.error(data.message);
      }
    },
  });

  return (
    <div
      key={collection.id}
      className="transform overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105"
    >
      {/* Action Menu at the Top */}
      <div className="relative flex justify-end p-2">
        <button
          onClick={toggleMenu}
          className="rounded-full bg-gray-300 p-1.5 text-black transition-all hover:bg-gray-400"
        >
          <MoreVert sx={{ fontSize: 18 }} />
        </button>
        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-10 z-20 mt-1 flex w-28 flex-col space-y-1 rounded-lg bg-white p-2 text-sm shadow-md">
            <Modal>
              <Modal.Window />
              <Modal.Open>
                <button className="rounded px-2 py-1 text-blue-500 hover:bg-gray-200">
                  View
                </button>
              </Modal.Open>
              <Modal.Open content={<CollectionForm collection={collection} />}>
                <button className="rounded px-2 py-1 text-yellow-500 hover:bg-gray-200">
                  Edit
                </button>
              </Modal.Open>

              <Modal.Open
                content={
                  <ConfirmDelete
                    item={collection}
                    onDelete={() => mutation.mutate(collection._id)}
                  />
                }
              >
                <button className="rounded px-2 py-1 text-red-500 hover:bg-gray-200">
                  Delete
                </button>
              </Modal.Open>
            </Modal>
          </div>
        )}
      </div>

      {/* Collection Image and Content */}
      <img
        src={collection.imageUrl.optimizeUrl}
        alt={collection.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <Heading level={3} text={collection.name} />
        <p className="mt-2 text-gray-600">{collection.description}</p>
      </div>
    </div>
  );
}

export default CollectionCard;
