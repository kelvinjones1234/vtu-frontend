import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import PageNotFound from "../components/PageNotFound";
import HomePageNavbar from "../components/HomePageNavbar";

const PageNotFoundPage = () => {
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
      <div className="min-w-[273px] bg-dark-custom-gradient w-full z-[-2] absolute top-0 left-0 min-h-screen">
        <HomePageNavbar
          homeMenuToggle={homeMenuToggle}
          setHomeMenuToggle={setHomeMenuToggle}
        />
        <PageNotFound />
        <Footer />
      </div>
    </>
  );
};

export default PageNotFoundPage;
