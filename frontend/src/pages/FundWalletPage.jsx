import React from "react";
import FundWallet from "../components/FundWallet";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const FundWalletPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <FundWallet />
      <Footer />
    </div>
  );
};

export default FundWalletPage;
