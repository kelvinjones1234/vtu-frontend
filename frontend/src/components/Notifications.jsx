import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import Pagination from "./Pagination";
import { useProduct } from "../context/ProductContext";

const Notifications = () => {
  const {
    fetchNotifications,
    errorMessage,
    successMessage,
    notifications,
    isLoading,
    handleMarkAllAsRead,
    unreadCount,
  } = useProduct();

  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Get current notifications
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification =
    indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstNotification,
    indexOfLastNotification
  );

  // Calculate total pages
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="pt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />

      <div className="mx-auto w-full max-w-[800px]">
        <header className="mb-8">
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
            Notifications
          </h2>
          <nav className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to="/user/dashboard">Dashboard</Link>
            <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
            <span className="text-gray-500">Notifications</span>
            <span>
              <button
                onClick={handleMarkAllAsRead}
                className="ml-4 text-[.8rem] text-green-500 hover:text-green-600"
                disabled={notifications.every(
                  (notification) => notification.is_read
                )}
              >
                Read all
              </button>
            </span>
          </nav>
          {unreadCount !== 0 && (
            <p className="text-gray-400 py-2 italic font-bold">
              You have {unreadCount} unread messages
            </p>
          )}
        </header>

        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {/* Updated Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 rounded-lg shadow-md flex items-start bg-green-50 border-l-4 border-green-500">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Success</p>
                <p className="text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="text-red-500 mb-4">{errorMessage}</div>
          )}

          {isLoading ? (
            <p className="text-gray-500 dark:text-gray-400">
              Loading notifications...
            </p>
          ) : currentNotifications.length > 0 ? (
            <ul className="list-none">
              {currentNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`mb-4 p-4 rounded-lg border ${
                    notification.is_read
                      ? "border-gray-300 dark:border-gray-700"
                      : "border-[#1CCEFF] dark:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(notification.date_sent).toLocaleString()}
                    </p>
                    {!notification.is_read && (
                      <div
                        className="h-2 w-2 rounded-full bg-red-800"
                        title="Mark as read"
                      ></div>
                    )}
                  </div>
                  <p className="text-primary dark:text-white mt-2">
                    {notification.message}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No notifications available.
            </p>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      </div>

      <GeneralRight />
    </div>
  );
};

export default Notifications;
