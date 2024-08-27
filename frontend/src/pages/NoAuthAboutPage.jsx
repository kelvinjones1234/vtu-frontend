import React, { useState, useEffect } from "react";
import HomePageNavbar from "../components/HomePageNavbar";
import Footer from "../components/Footer";
import About from "../components/About";

const NoAuthAboutPage = () => {
  const [homeMenuToggle, setHomeMenuToggle] = useState(false);

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
      <div className="min-w-[273px] bg-dark-custom-gradient w-full z-[-2] min-w-[150px] absolute top-0 left-0 min-h-screen">
        <HomePageNavbar
          homeMenuToggle={homeMenuToggle}
          setHomeMenuToggle={setHomeMenuToggle}
        />
        <About />
        <Footer />
      </div>
    </>
  );
};

export default NoAuthAboutPage;
