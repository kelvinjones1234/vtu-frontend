import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import Pagination from "./Pagination";

const Notifications = () => {
  const {
    fetchNotifications,
    handleMarkAsRead,
    errorMessage,
    successMessage,
    notifications,
    isLoading,
    handleMarkAllAsRead,
    unreadCount,
  } = useContext(ProductContext);

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
                className="ml-4 text-green-500 hover:text-green-600"
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
          {successMessage && (
            <div className="bg-green-500 text-white p-2 rounded mb-4">
              {successMessage}
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
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-green-600 hover:text-green-700 bg-gray-300 hover:bg-gray-400 transition-all duration-400 ease-in-out rounded-full px-[.4rem]"
                        title="Mark as read"
                      >
                        &#10003;
                      </button>
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
