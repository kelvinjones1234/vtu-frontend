import { useState, useEffect, React, useContext } from "react";
import { Link } from "react-router-dom";
import notification from "../assets/notification.svg";
import GeneralSidebar from "./GeneralSidebar";
import dark from "../assets/dark.svg";
import light from "../assets/light.svg";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import { RiMenu4Line } from "react-icons/ri";
import { RiCloseLargeLine } from "react-icons/ri";
import { ProductContext } from "../context/ProductContext";

const GeneralNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    darkMode,
    handleThemeSettings,
    mobileMenuToggle,
    handleMobileMenuToggle,
  } = useContext(GeneralContext);

  const { allRead, unreadCount } = useContext(ProductContext);

  useEffect(() => {
    if (mobileMenuToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuToggle]);



  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`px-4 lg:px-0 flex justify-between py-1 z-[10] fixed top-0 w-full hover:transition-colors hover:duration-200 ${
          isScrolled
            ? "dark:bg-gray-900 dark:bg-opacity-95 bg-opacity-95 bg-gray-50 shadow"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between lg:px-[6rem] w-[2000px] mx-auto">
          <div className="left flex gap-6 items-center">
            <div className="flex items-center">
              {/* <img src={logo} alt="" className="h-7 mb-1" /> */}
              <Link to={"/"}>
                <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
                  MaduConnect
                </div>
              </Link>
            </div>
            <div className="text-primary font-bold dark:text-white  hidden xs:block">
              Hi, { user ? user.user.first_name.toUpperCase() : ""}              
            </div>
          </div>
          <div className="light-dark-mode hidden sm:block">
            <div
              onClick={handleThemeSettings}
              className="justify-center py-[.5rem] gap-8 rounded-xl flex items-center bg-gray-200 hover:bg-gray-300 px-3 dark:bg-white dark:bg-opacity-20 dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer"
            >
              <img src={darkMode ? dark : light} alt="" className="w-4" />
            </div>
          </div>
        </div>
        <div className="right mt-1">
          <div className="small-screen flex items-center sm:hidden relative">
            <div className="notification h-10 w-10 mr-9 grid relative items-center rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-white dark:bg-opacity-20 grid relative justify-center items-center dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer">
              <Link to={"/user/notifications"}>
                <img src={notification} alt="" className="w-6" />
              </Link>
              {!allRead && (
                <div className="flex items-center justify-center h-3 w-3 bg-red-600 absolute rounded-full left-3 bottom-6 text-white text-[10px]">
                  {unreadCount}
                </div>
              )}
            </div>
            <div className="hamburger ">
              <div
                onClick={handleMobileMenuToggle}
                className="text-[25px] text-link"
              >
                {mobileMenuToggle ? <RiCloseLargeLine /> : <RiMenu4Line />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GeneralSidebar />
    </>
  );
};

export default GeneralNavbar;
