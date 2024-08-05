import React from "react";
import FundWallet from "../components/FundWallet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const FundWalletPage = () => {
  return (
    <div className="relative">
      <div className={`w-full z-[-2] min-w-[150px] fixed top-0 left-0 `}></div>
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <FundWallet />
        <Footer />
      </div>
    </div>
  );
};

export default FundWalletPage;
