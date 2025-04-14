// components/ui/loading-state.js
import React from "react";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#11296B]/20 border-t-[#11296B] rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </main>
  );
}
