import React, { useContext, useEffect, useState } from "react";
import GeneralSidebar from "../components/GeneralSidebar";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import UserDashBoard from "../components/UserDashBoard";
import { AuthContext } from "../context/AuthenticationContext";
import axios from "axios";

const UserDashboardPage = () => {
  const { authTokens, user } = useContext(AuthContext);

  return (
    <div className="relative">
      <div className={`w-full z-[-2] min-w-[150px] fixed top-0 left-0 `}></div>
      <div className="min-w-[283px]">
        <GeneralNavbar />
        <UserDashBoard />
        <Footer />
      </div>
    </div>
  );
};

export default UserDashboardPage;
