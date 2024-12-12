import React from "react";
import PrivacyPolicy from "../components/PrivacyAndPolicy";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <PrivacyPolicy />
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
