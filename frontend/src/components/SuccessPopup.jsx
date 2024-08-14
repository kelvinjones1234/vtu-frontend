import React from "react";
import PropTypes from "prop-types";

const SuccessPopup = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
          Success
        </h2>
        <p className="mt-2 text-gray-800 dark:text-gray-200">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-green-600 dark:bg-green-400 text-white px-4 py-2 rounded-lg"
        >
          OK
        </button>
      </div>
      <div className="fixed inset-0 bg-black opacity-50"></div>
    </div>
  );
};

SuccessPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SuccessPopup;
