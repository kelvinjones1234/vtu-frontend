import { useState, React } from "react";
import Airtime from "../components/Airtime";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const AirtimePage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <Airtime />
      <Footer />
    </div>
  );
};

export default AirtimePage;
