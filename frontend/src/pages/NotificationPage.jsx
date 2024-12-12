import React from "react";
import GeneralNavbar from "../components/GeneralNavbar";
import Footer from "../components/Footer";
import Notifications from "../components/Notifications";

const NotificationPage = () => {
  return (
    <div className="min-w-[273px] bg-white dark:bg-dark-custom-gradient w-full z-[-2] absolute top-0">
      <GeneralNavbar />
      <Notifications />
      <Footer />
    </div>
  );
};

export default NotificationPage;
