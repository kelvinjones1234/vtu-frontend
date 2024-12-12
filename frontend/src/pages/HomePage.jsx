import React, { useState, useEffect, useContext } from "react";
import HomePageNavbar from "../components/HomePageNavbar";
import HomeHero from "../components/HomeHero";
import AfterHero from "../components/AfterHero";
import Footer from "../components/Footer";
import { GeneralContext } from "../context/GeneralContext";

const HomePage = () => {
  const { homeMenuToggle } = useContext(GeneralContext);

  useEffect(() => {
    if (homeMenuToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [homeMenuToggle]);

  return (
    <>
      <div className="min-w-[273px] bg-dark-custom-gradient w-full z-[-2] absolute top-0 left-0 min-h-screen">
        <HomePageNavbar />
        <HomeHero />
        <AfterHero />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
