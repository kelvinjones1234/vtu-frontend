import { useState, useEffect, React, useContext } from "react";
import { Link } from "react-router-dom";
import menu from "../assets/menu.svg";
import close from "../assets/close.svg";
import notification from "../assets/notification.svg";
import GeneralSidebar from "./GeneralSidebar";
import dark from "../assets/dark.svg";
import light from "../assets/light.svg";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import { RiMenu4Line } from "react-icons/ri";
import { RiCloseLargeLine } from "react-icons/ri";

const GeneralNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useContext(AuthContext);
  const { darkMode, handleThemeSettings } = useContext(GeneralContext);

  const [generalMenuToggle, setGeneralMenuToggle] = useState(false);

  useEffect(() => {
    if (generalMenuToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [generalMenuToggle]);

  const handleGeneralMenuToggle = () => {
    setGeneralMenuToggle((previous) => !previous);
  };

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
        className={`p-4 lg:px-0 flex justify-between z-[10] fixed top-0 w-full transition-colors duration-200 ${
          isScrolled ? "dark:bg-primary bg-gray-50 shadow" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between lg:px-[6rem] w-[2000px] mx-auto">
          <div className="left flex gap-6 items-center">
            <div className="flex items-center gap-1">
              <Link to={"/"}>
                <div className="logo font-heading_one text-green-500 border border-green-500 px-2 text-[.7rem] px-2 rounded-[.5rem] font-bold">
                  Atom
                </div>
              </Link>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-primary font-bold dark:text-white">
              Hi, {user.first_name.toUpperCase()}
            </div>
          </div>
          <div className="light-dark-mode hidden sm:block">
            <div
              onClick={handleThemeSettings}
              className="justify-center py-[.5rem] gap-8 rounded-xl flex items-center bg-gray-200 hover:bg-gray-300 px-3 dark:bg-white dark:bg-opacity-20 dark:hover:bg-opacity-10 transition duration-300 ease-in-out cursor-pointer"
            >
              <img src={darkMode ? dark : light} alt="" className="w-4" />
            </div>
          </div>
        </div>
        <div className="right mt-1">
          <div className="small-screen flex items-center sm:hidden relative">
            <div className="notification h-10 w-10 mr-9 grid relative items-center">
              <img src={notification} alt="" className="w-6" />
              <div className="red-point h-3 w-3 bg-red-600 absolute bottom-3 rounded-full left-3 bottom-6"></div>
            </div>
            <div className="hamburger ">
              <div
                onClick={handleGeneralMenuToggle}
                className="text-[25px] dark:text-white text-link"
              >
                {generalMenuToggle ? <RiCloseLargeLine /> : <RiMenu4Line />}
              </div>
            </div>
          </div>
        </div>
      </div>

      <GeneralSidebar
        generalMenuToggle={generalMenuToggle}
        setGeneralMenuToggle={setGeneralMenuToggle}
        handleGeneralMenuToggle={handleGeneralMenuToggle}
      />
    </>
  );
};

export default GeneralNavbar;
