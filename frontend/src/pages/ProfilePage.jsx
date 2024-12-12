import React from "react";
import Profile from "../components/Profile";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";

const ProfilePage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <Profile />
      <Footer />
    </div>
  );
};

export default ProfilePage;
