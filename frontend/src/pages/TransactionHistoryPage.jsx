import React from "react";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import TransactionHistory from "../components/TransactionHistory";

const TransactionHistoryPage = () => {
  return (
    <div className="relative">
      <div
        className={`w-full z-[-2] min-w-[150px] bg-opacity-95 fixed top-0 left-0 h-screen`}
      ></div>
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <TransactionHistory />
        <Footer />
      </div>
    </div>
  );
};

export default TransactionHistoryPage;