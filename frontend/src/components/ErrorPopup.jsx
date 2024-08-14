// src/components/ErrorPopup.jsx
import React from "react";

const ErrorPopup = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <div className="bg-red-500 dark:bg-red-700 text-white p-6 rounded-lg shadow-lg mx-5 max-w-[500px]">
        <h3 className="text-[2rem] font-bold mb-4 text-center">Oop!</h3>
        <p>{message}</p>
        <button
          className="bg-white text-red-400 py-2 px-4 rounded-[.5rem] mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
