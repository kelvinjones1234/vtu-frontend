import React, { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { useWallet } from "../context/WalletContext";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";

const UserDashBoard = () => {
  const { productData } = useContext(ProductContext);
  const { walletData, loading, error } = useWallet();
  const { user } = useContext(AuthContext);
  const {
    handleTransferForm,
    handleMobileMenuToggle,
    handleMobileTransferForm,
  } = useContext(GeneralContext);

  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const capitalizedFirstName = useMemo(() => {
    return user?.first_name
      ? user.first_name.charAt(0).toUpperCase() +
          user.first_name.slice(1).toLowerCase()
      : "";
  }, [user]);

  const formattedBalance = useMemo(() => {
    return walletData?.balance
      ? Number(walletData.balance).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0.00";
  }, [walletData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pt-[6rem] sm:bg-cover px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div className="mx-auto">
        <div className="text-primary text-[1.5rem] font-bold dark:text-white py-8 text-center xs:hidden">
          Hi,{" "}
          <span className="bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
            {capitalizedFirstName}!
          </span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 px-3 py-6 text-primary dark:text-white">
          <div className="flex justify-between items-center mb-4 text-sm sm:text-[.7rem] md:text-[1rem]">
            <h2 className="flex items-center space-x-2">
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
            <Link to={"/user/dashboard/fundwallet"}>
              <button className="bg-green-500 hover:bg-green-600 text-black font-semibold py-1 sm:py-1 md:py-2 px-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                + Fund Wallet
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6  text-primary dark:text-white">
          <p className="mb-4">
            Create shortcuts for frequent activities or transfer atom credit to
            other users with their phone number.
          </p>
          <div className="flex justify-between">
            <button className="bg-blue-500 text-[.8rem] hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Create Shortcut
            </button>
            <button
              onClick={(e) => {
                // Check screen width
                if (window.innerWidth >= 767) {
                  // Desktop: Only handle transfer form
                  handleTransferForm(e);
                } else {
                  // Mobile: First toggle mobile menu, then handle transfer form
                  handleMobileMenuToggle(e);
                  handleMobileTransferForm(e);
                }
              }}
              className="border text-[.8rem] border-green-500 text-green-500 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Transfer Credit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-6">
          {productData.map((item) => (
            <Link
              key={item.id}
              to={`/user/dashboard/services/${item.category.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center hover:transition hover:duration-300 hover:ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={`https://madupay.pythonanywhere.com${item.image}`}
                alt={item.name}
                className="h-12 w-12 object-contain mb-2"
              />
              <p className="text-sm text-center text-primary dark:text-white">
                {item.category}
              </p>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-[4rem]">
          <button className="dark:bg-white bg-primary py-3 px-12 rounded-[2rem] dark:text-primary text-white font-bold shadow-indigo-500/30">
            Get Premium Service
          </button>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default UserDashBoard;
