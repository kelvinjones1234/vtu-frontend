import { useState, React } from "react";
import Airtime from "../components/Airtime";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const AirtimePage = () => {
  return (
    <div className="relative">
      <div
        className={`w-full z-[-2] min-w-[150px] bg-opacity-95 fixed top-0 left-0 h-screen`}
      ></div>
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <Airtime />
        <Footer />
      </div>
    </div>
  );
};

export default AirtimePage;
