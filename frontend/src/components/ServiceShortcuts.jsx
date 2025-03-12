import React, { useState, useMemo, useCallback } from "react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { FaAngleRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useWallet } from "../context/WalletContext";
import { Link } from "react-router-dom";
import Data from "./Data";
import Airtime from "./Airtime";
import ElectricityBill from "./ElectricityBill";
import CableSub from "./CableSub";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useProduct } from "../context/ProductContext";

const ServiceShortcuts = () => {
  const { walletData, loading, error } = useWallet();
  const [isBalanceHidden, setIsBalanceHidden] = useState(true);
  const [activeService, setActiveService] = useState("data");

  const { popupState, setPopupState } = useProduct();

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

  // Memoize toggle function to prevent unnecessary re-renders
  const toggleBalanceVisibility = useCallback(() => {
    setIsBalanceHidden((prev) => !prev);
  }, []);

  const services = [
    {
      id: "data",
      name: "Data Subscription",
      icon: "📱",
      color: "bg-blue-500",
      textColor: "text-white",
    },
    {
      id: "airtime",
      name: "Airtime Topup",
      icon: "📞",
      color: "bg-green-500",
      textColor: "text-white",
    },
    {
      id: "electricity",
      name: "Electricity Bill",
      icon: "⚡",
      color: "bg-yellow-500",
      textColor: "text-black",
    },
    {
      id: "cable",
      name: "Cable TV",
      icon: "📺",
      color: "bg-purple-500",
      textColor: "text-white",
    },
  ];

  const handleServiceChange = (serviceId) => {
    setActiveService(serviceId);
  };

  // Networks for data and airtime forms
  const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-400", textColor: "text-black" },
    {
      id: "airtel",
      name: "Airtel",
      color: "bg-red-600",
      textColor: "text-white",
    },
    { id: "glo", name: "Glo", color: "bg-green-600", textColor: "text-white" },
    {
      id: "9mobile",
      name: "9Mobile",
      color: "bg-green-400",
      textColor: "text-black",
    },
  ];

  // Electricity providers
  const electricityProviders = [
    { id: "ekedc", name: "Eko Electric" },
    { id: "ikedc", name: "Ikeja Electric" },
    { id: "aedc", name: "Abuja Electric" },
    { id: "phedc", name: "Port Harcourt Electric" },
  ];

  // Cable TV providers
  const cableProviders = [
    { id: "dstv", name: "DSTV" },
    { id: "gotv", name: "GoTV" },
    { id: "startime", name: "StarTimes" },
  ];

  const handleErrorClose = useCallback(
    () => setPopupState((prev) => ({ ...prev, isErrorOpen: false })),
    []
  );
  const handleSuccessClose = useCallback(
    () => setPopupState((prev) => ({ ...prev, isSuccessOpen: false })),
    []
  );

  return (
    <div className="pt-[15vh] sm:bg-cover px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div>
        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-700 rounded-xl shadow-lg mb-6 p-3 xs:p-6 sm:p-9 text-primary dark:text-white">
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
        <div className="h-auto bg-white dark:bg-gray-800 py-6 px-4 sm:px-6 md:px-8 rounded-2xl shadow-md">
          <div className="w-full sm:w-[300px] md:w-[500px] lg:w-[600px] xl:w-[700px] max-w-3xl mx-auto">
            {" "}
            {/* Changed min-w-[500px] to w-full with max-width */}
            <h1 className="text-2xl font-bold text-primary dark:text-white mb-6">
              Create Shortcuts
            </h1>
            {/* Service Tabs */}
            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex space-x-2 min-w-max">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceChange(service.id)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center whitespace-nowrap ${
                      activeService === service.id
                        ? `${service.color} ${service.textColor} shadow-md`
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <span className="mr-2">{service.icon}</span>
                    <span>{service.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Form Container */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-hidden">
              {activeService === "data" && (
                <Data showSidebars={false} showStyle={false} />
              )}
              {/* Airtime Topup Form */}
              {activeService === "airtime" && (
                <Airtime showSidebars={false} showStyle={false} />
              )}
              {/* Electricity Bill Form */}
              {activeService === "electricity" && (
                <ElectricityBill showSidebars={false} showStyle={false} />
              )}
              {/* Cable TV Form */}
              {activeService === "cable" && (
                <CableSub showSidebars={false} showStyle={false} />
              )}
            </div>
          </div>
        </div>
      </div>
      <GeneralRight />
      <ErrorPopup
        isOpen={popupState.isErrorOpen}
        message={popupState.errorPopupMessage}
        onClose={handleErrorClose}
      />
      <SuccessPopup
        isOpen={popupState.isSuccessOpen}
        message={popupState.successMessage}
        onClose={handleSuccessClose}
      />
    </div>
  );
};

export default ServiceShortcuts;
