import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";

const Notifications = () => {
  const {
    api,
    fetchNotifications,
    handleMarkAsRead,
    errorMessage,
    successMessage,
    notifications,
    isLoading,
    handleMarkAllAsRead,
    unreadCount,
  } = useContext(ProductContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="mt-[20vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />

      <div className="w-full">
        <header>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Notifications
          </h2>
          <nav className="flex items-center text-primary dark:text-gray-100 pt-4 font-semibold">
            <Link to="/user/dashboard">Dashboard</Link>
            <div className="h-1 w-1 mx-5 bg-white rounded-full"></div>
            <span className="text-gray-500">All notifications</span>
            <span>
              <button
                onClick={handleMarkAllAsRead}
                className="hover:text-green-500 text-green-400 py-2 px-4 rounded-lg"
                disabled={notifications.every(
                  (notification) => notification.is_read
                )}
              >
                mark all
              </button>
            </span>
          </nav>
          {unreadCount !== 0 && (
            <p className="text-gray-400 py-2 italic font-bold">
              You have {unreadCount} unread messages
            </p>
          )}
        </header>

        <section className="flex flex-col justify-center border-[0.01rem] border-gray-200 dark:border-gray-900 p-5 rounded-[1.5rem] dark:bg-opacity-15 shadow-lg shadow-indigo-950/10">
          {successMessage && (
            <div className="transition-opacity duration-1000 ease-in-out bg-green-500 text-white p-2 rounded mb-4">
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
          ) : notifications.length > 0 ? (
            <ul className="list-none">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`dark:bg-[#18202F] bg-white mb-2 p-4 rounded-2xl border ${
                    notification.is_read
                      ? "border-gray-300 dark:border-gray-700"
                      : "border-[#1CCEFF] dark:border-gray-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="dark:text-white text-primary text-sm">
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
                  <p className="dark:text-white text-primary mt-2">
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
        </section>
      </div>

      <GeneralRight />
    </div>
  );
};

export default Notifications;
