import React from "react";

const ConfirmationPopup = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-50">
      <div className="bg-white dark:bg-gray-800 text-gray-500 dark:text-white p-6 mx-5 max-w-[500px] rounded-lg shadow-lg">
        <div>
          <p className="text-[2rem] text-center mb-5">Confirmation</p>
          <h3 className="text-sm font-bold mb-4">{message}</h3>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-blue-400 font-bold hover:bg-blue-500 text-white py-2 px-4 rounded-[.5rem] transition duration-400 ease-in-out"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-200 font-bold hover:bg-gray-300 hover:dark:bg-gray-600 dark:bg-gray-500 text-gray-900 dark:text-white py-2 px-4 rounded-[.5rem] transition duration-400 ease-in-out"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
