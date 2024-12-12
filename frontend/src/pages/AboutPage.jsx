import React from "react";
import Footer from "../components/Footer";
import About from "../components/About";
import GeneralNavbar from "../components/GeneralNavbar";

const AboutPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <About />
      <Footer />
    </div>
  );
};

export default AboutPage;
