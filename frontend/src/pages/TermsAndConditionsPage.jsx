import React from "react";
import TermsConditions from "../components/TermsAndConditions";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const TermsAndConditionsPage = () => {
  return (
    <div className="relative">
      <div
        className={`w-full z-[-2] min-w-[150px] bg-opacity-95 fixed top-0 left-0 h-screen`}
      ></div>
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <TermsConditions />
        <Footer />
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
