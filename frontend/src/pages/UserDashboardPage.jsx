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
    <div className="min-w-[273px] bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <UserDashBoard />
      <Footer />
    </div>
  );
};

export default UserDashboardPage;
