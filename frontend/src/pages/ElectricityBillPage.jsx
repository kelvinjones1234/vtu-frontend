import React from "react";
import GeneralNavbar from "../components/GeneralNavbar";
import ElectricityBill from "../components/ElectricityBill";
import Footer from "../components/Footer";

const ElectricityBillPage = () => {
  return (
    <div className="relative">
      <div
        className={`w-full z-[-2] min-w-[150px] bg-opacity-95 fixed top-0 left-0 h-screen`}
      ></div>
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <ElectricityBill />
        <Footer />
      </div>
    </div>
  );
};

export default ElectricityBillPage;
