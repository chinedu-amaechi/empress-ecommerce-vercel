import React from "react";
import Heading from "./Heading";
import { Delete } from "@mui/icons-material";

function ConfirmDelete({ item, closeModal, onDelete }) {
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-lg">
      <Heading level={3} text={`Delete ${item.name}`} />
      <p className="mb-6 text-gray-600">
        Are you sure you want to delete{" "}
        <span className="font-bold">{item.name}</span>? This action cannot be
        undone.
      </p>
      <div className="flex justify-end space-x-4">
        {closeModal}
        <button
          className="flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-red-600 transition hover:bg-red-200"
          onClick={onDelete}
        >
          <Delete sx={{ fontSize: "16px" }} />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}

export default ConfirmDelete;
