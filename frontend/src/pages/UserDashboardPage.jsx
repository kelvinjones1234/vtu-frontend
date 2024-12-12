import React, { useContext, useEffect, useState } from "react";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import UserDashBoard from "../components/UserDashBoard";

const UserDashboardPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <UserDashBoard />
      <Footer />
    </div>
  );
};

export default UserDashboardPage;
