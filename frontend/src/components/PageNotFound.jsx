import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="bg-bg_on min-h-screen bg-contain bg-no-repeat flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 text-center">
        <div>
          <h2 className="mt-6 text-6xl font-extrabold text-primary dark:text-white">
            404
          </h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-200">
            Page Not Found
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Oops! The page you are looking for doesn't exist.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
