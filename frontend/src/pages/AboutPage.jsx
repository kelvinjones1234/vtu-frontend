import React from "react";
import Footer from "../components/Footer";
import About from "../components/About";
import GeneralNavbar from "../components/GeneralNavbar";

const AboutPage = () => {
  return (
    <div className="relative">
      <div
        className={`w-full z-[-2] min-w-[150px] bg-opacity-95 fixed top-0 left-0 h-screen`}
      ></div>
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <About />
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
