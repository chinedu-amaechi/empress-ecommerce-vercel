import React from "react";

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-8 border-t-8 border-gray-200 border-t-blue-500"></div>
    </div>
  );
}

export default Spinner;
