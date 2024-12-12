import React from "react";
import TermsConditions from "../components/TermsAndConditions";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const TermsAndConditionsPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <TermsConditions />
      <Footer />
    </div>
  );
};

export default TermsAndConditionsPage;
