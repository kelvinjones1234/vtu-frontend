import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";

const SuccessPopup = ({ isOpen, message, onClose, title = "Success" }) => {
  // Split message into lines if it contains newlines
  const messageLines = message.split("\n");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ y: 20, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-6 mx-auto max-w-md w-full rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 relative"
          >
            {/* Close button */}
            {/* <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-full"
              onClick={onClose}
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" />
            </button> */}

            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <FaTimesCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-green-200 dark:via-green-800 to-transparent my-4" />

            {/* Message */}
            <div className="my-4 text-gray-700 dark:text-gray-300">
              {messageLines.map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>

            {/* Action button */}
            <div className="mt-6 flex justify-end">
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition duration-200 font-medium text-sm shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SuccessPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default SuccessPopup;
