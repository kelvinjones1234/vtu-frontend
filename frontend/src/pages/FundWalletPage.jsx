import React from "react";
import FundWallet from "../components/FundWallet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const FundWalletPage = () => {
  return (
    <div className="relative">
      <div
        className={`w-full z-[-2] min-w-[150px] bg-opacity-95 bg-white dark:bg-dark-custom-gradient fixed top-0 left-0 h-screen`}
      ></div>{" "}
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <FundWallet />
        <Footer />
      </div>
    </div>
  );
};

export default FundWalletPage;
