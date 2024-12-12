import React from "react";
import GeneralNavbar from "../components/GeneralNavbar";
import ElectricityBill from "../components/ElectricityBill";
import Footer from "../components/Footer";

const ElectricityBillPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <ElectricityBill />
      <Footer />
    </div>
  );
};

export default ElectricityBillPage;
