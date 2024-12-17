import React from "react";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import PriceList from "../components/PriceList";
import Bvn from "../components/Bvn";

const DataPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <PriceList />
      {/* <Bvn /> */}
      <Footer />
    </div>
  );
};

export default DataPage;
