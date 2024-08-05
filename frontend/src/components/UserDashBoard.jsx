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
    <div className="mt-[20vh] sm:bg-cover bg-center px-4 ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 justify-center lg:mx-[5rem] font-body_two">
      {/* left layer */}
      <GeneralLeft />

      {/* middle layer */}
      <div className="flex flex-col justify-center text-[.8rem] md:text-[1rem]">
        <div className="rounded-[1rem] bg-white dark:bg-primary p-4 xs:p-8 text-primary dark:text-white shadow-lg shadow-indigo-900/20 border-5 border border-gray-200 dark:border-0">
          <div className="flex justify-between items-center">
            <p className="pb-6">Available Balance</p>
            <div>
              <Link
                to={"/user/dashboard/transactions"}
                className="flex gap-3 cursor-pointer items-center mb-6 hover:text-sky-300 transition-all duration-400 ease-in-out"
              >
                <p className="">Transaction History</p>
                <FaAngleRight className="h-[.9rem] mt-[0.08]" />
              </Link>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[1.5rem] font-bold">
              ₦ {walletData && walletData.balance.toLocaleString()}
            </p>
            <div className="button flex items-center">
              <div
                onClick={handleOpenModal}
                className="bg-green-500 hover:bg-green-600 transition duration-400 ease-in-out text-white rounded-[2rem] pb-[.35rem] pt-[.4rem] px-[.9rem] font-bold cursor-pointer"
              >
                + Fund Wallet
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-[1rem] bg-white dark:bg-primary text-primary dark:text-white my-4 bg-primary p-4 xs:p-8 shadow-lg shadow-indigo-900/20 text-[.8rem] border-5 border border-gray-200">
          <p className="">
            You can create a shortcut for frequent activities and also transfer
            atom credit to other users with their phone number.
          </p>
          <div className="button flex items-center justify-between pt-4">
            <div className="bg-link cursor-pointer hover:bg-sky-500 transiton duration-500 ease-in-out rounded-[2rem] pb-[.3rem] pt-[.4rem] px-[.9rem] font-bold">
              Create Shortcut
            </div>
            <div className="border border-green-500 hover:text-green-600 transiton duration-500 ease-in-out cursor-pointer rounded-[2rem] pb-[.3rem] pt-[.4rem] px-[.9rem] font-bold">
              Transfer Credit
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center py-5 gap-6">
          {productData.map((item) => (
            <Link
              key={item.id}
              to={`/user/dashboard/services/${item.category.toLowerCase()}`}
            >
              <div className="service-card shadow-lg shadow-indigo-500/10 p-4 h-[5.5rem] w-[5.5rem] xs:h-[6rem] xs:w-[6rem] text-primary dark:text-white bg-white dark:bg-primary border border-gray-700 rounded-2xl flex flex-col justify-center items-center cursor-pointer">
                <img
                  src={`https://praisemedia.pythonanywhere.com${item.image}`}
                  alt={item.name}
                  className="h-10 w-10 object-contain"
                />
                <p className="text-[.7rem] text-center">{item.category}</p>
              </div>
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
