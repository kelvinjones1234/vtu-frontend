import React from "react";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import CableSub from "../components/CableSub";

const CableSubPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <CableSub />
      <Footer />
    </div>
  );
};

export default CableSubPage;
