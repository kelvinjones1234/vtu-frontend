import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { ProductContext } from "../context/ProductContext";
import { useWallet } from "../context/WalletContext";
import FundWalletModal from "./FundWalletModal";

const UserDashBoard = () => {
  const { productData } = useContext(ProductContext);
  const { walletData } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mt-[10rem] sm:bg-cover bg-center px-4 ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 justify-center lg:mx-[5rem] font-body_two">
      {/* left layer */}
      <GeneralLeft />

      {/* middle layer */}
      <div className="flex flex-col text-[.8rem] md:text-[1rem]">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 p-6 text-primary dark:text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Available Balance</h2>
            <Link
              to="/user/dashboard/transactions"
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors duration-300"
            >
              <span className="mr-2">Transaction History</span>
              <FaAngleRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-3xl font-bold">
              ₦{" "}
              {walletData &&
                Number(walletData.balance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </p>
            <button
              onClick={handleOpenModal}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              + Fund Wallet
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6  text-primary dark:text-white">
          <p className="mb-4">
            Create shortcuts for frequent activities or transfer atom credit to
            other users with their phone number.
          </p>
          <div className="flex justify-between">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Create Shortcut
            </button>
            <button className="border border-green-500 text-green-500 font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              Transfer Credit
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-6">
          {productData.map((item) => (
            <Link
              key={item.id}
              to={`/user/dashboard/services/${item.category.toLowerCase()}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.name}
                className="h-12 w-12 object-contain mb-2"
              />
              <p className="text-sm text-center text-primary dark:text-white">
                {item.category}
              </p>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <button className="dark:bg-white bg-primary py-3 px-12 rounded-[2rem] dark:text-primary text-white font-bold shadow-indigo-500/30">
            Get Premium Service
          </button>
        </div>
      </div>
      <GeneralRight />

      {isModalOpen && <FundWalletModal onClose={handleCloseModal} />}
    </div>
  );
};

export default UserDashBoard;
