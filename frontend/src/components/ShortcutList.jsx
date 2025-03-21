import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import Pagination from "./Pagination";
import { FaAngleRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useWallet } from "../context/WalletContext";
import { useGeneral } from "../context/GeneralContext";

const ShortcutList = () => {
  const { walletData, loading, error } = useWallet();
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [shortcutsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [shortcuts, setShortcuts] = useState([]);
  const { api } = useGeneral();

  console.log(shortcuts);

  const formattedBalance = useMemo(
    () =>
      walletData?.balance
        ? Number(walletData.balance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0.00",
    [walletData]
  );

  const toggleBalanceVisibility = useCallback(() => {
    setIsBalanceHidden((prev) => !prev);
  }, []);

  const fetchShortcuts = async () => {
    try {
      const response = await api.get("shortcuts/", {
        withCredentials: true, // If using authentication cookies
      });
      setShortcuts(response.data);
    } catch (error) {
      console.error(
        "Error fetching shortcuts:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Call this function when needed
  useEffect(() => {
    fetchShortcuts();
  }, []);

  const handleTriggerShortcut = async (shortcut) => {
    console.log(`Triggering shortcut: ${shortcut}`);

    try {
      const response = await api.post(
        "post-shortcut-transaction/",
        {
          shortcut,
        },
        {
          withCredentials: true, // If authentication is required
        }
      );

      console.log("Shortcut triggered successfully:", response.data);
    } catch (error) {
      console.error(
        "Error triggering shortcut:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDeleteShortcut = async (shortcut) => {
    try {
      const response = await api.delete(
        `post/delete-shortcut-transaction/${shortcut?.id}/`
      );

      if (response.status === 204) {
        console.log("Post deleted successfully");
        fetchShortcuts();
        // Optionally, update the UI to reflect the deleted post
      } else {
        console.error("Failed to delete post:", response.data);
      }
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Filter shortcuts based on search term - with improved null checks
  const filteredShortcuts = useMemo(() => {
    if (!shortcuts || !Array.isArray(shortcuts)) return [];

    return shortcuts.filter((shortcut) => {
      if (!shortcut) return false;

      const nameMatch = shortcut.shortcut_name
        ? shortcut.shortcut_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false;

      const typeMatch = shortcut.type
        ? shortcut.type.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      return nameMatch || typeMatch;
    });
  }, [shortcuts, searchTerm]);

  // Pagination logic
  const indexOfLastShortcut = currentPage * shortcutsPerPage;
  const indexOfFirstShortcut = indexOfLastShortcut - shortcutsPerPage;
  const currentShortcuts = filteredShortcuts.slice(
    indexOfFirstShortcut,
    indexOfLastShortcut
  );
  const totalPages = Math.ceil(filteredShortcuts.length / shortcutsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="pt-[15vh] flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-[15vh] flex justify-center items-center h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[15vh] sm:bg-cover px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="w-full max-w-3xl">
        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 xs:p-6 sm:p-9 text-primary dark:text-white mb-6">
          <div className="flex justify-between items-center mb-[1.5rem] text-sm sm:text-[.7rem] md:text-[1rem]">
            <h2 className="sm:flex items-center space-x-2">
              <span>Available Balance</span>
              <button
                onClick={toggleBalanceVisibility}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300"
              >
                {isBalanceHidden ? <FaEyeSlash /> : <FaEye />}
              </button>
            </h2>
            <Link
              to="/user/dashboard/transactions"
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300"
            >
              <span className="mr-2">Transaction History</span>
              <FaAngleRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-2xl sm:text-[1.2rem] md:text-[2rem] font-bold">
              ₦ {isBalanceHidden ? "****" : formattedBalance}
            </p>
            <Link to="/user/dashboard/fundwallet">
              <button className="bg-green-500 hover:bg-green-600 text-black font-semibold py-1 sm:py-1 md:py-2 px-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                + Fund Wallet
              </button>
            </Link>
          </div>
        </div>

        {/* Shortcuts Section */}
        <div className="h-auto bg-white dark:bg-gray-800 py-6 px-4 sm:px-6 md:px-8 rounded-2xl shadow-md">
          <div className="w-full max-w-3xl mx-auto">
            {/* Header with search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-2xl font-bold text-primary dark:text-white mb-4 sm:mb-0">
                Shortcuts
              </h1>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search shortcuts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Empty state */}
            {(!currentShortcuts || currentShortcuts.length === 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <svg
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No shortcuts found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search term."
                    : "Create your first shortcut to speed up regular transactions."}
                </p>
                <Link to="/user/dashboard/service-shortcut">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Create New Shortcut
                  </button>
                </Link>
              </div>
            )}

            {/* Shortcut List */}
            {currentShortcuts && currentShortcuts.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-300">
                  <div className="col-span-8">Shortcut</div>
                  <div className="col-span-4 text-right">Action</div>
                </div>

                {currentShortcuts.map((shortcut, index) => (
                  <div
                    key={shortcut?.id || index}
                    className="flex flex-col xsm:flex-row sm:flex-col md:flex-row justify-between gap-4 p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <div className="">
                      <div className="flex items-start sm:items-center">
                        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mr-3">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            ></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">
                            {shortcut?.shortcut_name || "Unnamed Shortcut"}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span className="mr-3">
                              Created {formatDate(shortcut?.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0 flex items-center gap-4">
                      <button
                        onClick={() => {
                          handleTriggerShortcut(shortcut);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm"
                      >
                        Trigger
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteShortcut(shortcut);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Shortcut Button */}
            {currentShortcuts && currentShortcuts.length > 0 && (
              <div className="flex justify-center mt-6">
                <Link to="/user/dashboard/service-shortcut">
                  <button className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-500 font-semibold py-2 px-6 rounded-full border border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    <span>Add New Shortcut</span>
                  </button>
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default ShortcutList;
