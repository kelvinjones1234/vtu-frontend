import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import notification from "../assets/notification.svg";
import GeneralSidebar from "./GeneralSidebar";
import dark from "../assets/dark.svg";
import light from "../assets/light.svg";
import { useAuth } from "../context/AuthenticationContext";
import { useGeneral } from "../context/GeneralContext";
import { useProduct } from "../context/ProductContext";
import { RiMenu4Line, RiCloseLargeLine } from "react-icons/ri";

// Debounce utility function
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Notification icon as a separate memoized component
const NotificationIcon = React.memo(({ allRead, unreadCount }) => (
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
));

// ThemeToggle as a separate memoized component
const ThemeToggle = React.memo(({ darkMode, handleThemeSettings }) => (
  <div className="light-dark-mode hidden sm:block">
    <div
      onClick={handleThemeSettings}
      className="justify-center py-[.5rem] gap-8 rounded-xl flex items-center bg-gray-200 hover:bg-gray-300 px-3 dark:bg-white dark:bg-opacity-20 dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer"
    >
      <img src={darkMode ? dark : light} alt="" className="w-4" />
    </div>
  </div>
));

// Logo as a separate memoized component
const Logo = React.memo(() => (
  <div className="flex items-center">
    <Link to={"/"}>
      <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
        MaduConnect
      </div>
    </Link>
  </div>
));

// Main component optimized with memo
const GeneralNavbar = React.memo(() => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Using custom hooks to extract only what's needed from contexts
  const { user } = useAuth();
  const {
    darkMode,
    handleThemeSettings,
    mobileMenuToggle,
    handleMobileMenuToggle,
  } = useGeneral();
  const { allRead, unreadCount } = useProduct();

  // Memoize navbar classes
  const navbarClasses = useMemo(
    () =>
      `px-4 lg:px-0 flex justify-between py-1 z-[10] fixed top-0 w-full hover:transition-colors hover:duration-200 ${
        isScrolled
          ? "dark:bg-gray-900 dark:bg-opacity-95 bg-opacity-95 bg-gray-50 shadow"
          : "bg-transparent"
      }`,
    [isScrolled]
  );

  // Memoized scroll handler with debounce
  const handleScroll = useCallback(
    debounce(() => {
      setIsScrolled(window.scrollY > 30);
    }, 50),
    []
  );

  // Effect for body overflow
  useEffect(() => {
    document.body.style.overflow = mobileMenuToggle ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuToggle]);

  // Effect for scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <div className={navbarClasses}>
        <div className="flex justify-between lg:px-[6rem] w-[2000px] mx-auto">
          <div className="left flex gap-6 items-center">
            <Logo />
            {user && (
              <div className="text-primary font-bold dark:text-white hidden xs:block">
                Hi,{" "}
                <span className="bg-gradient-to-r uppercase from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
                  {user.user.first_name.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <ThemeToggle
            darkMode={darkMode}
            handleThemeSettings={handleThemeSettings}
          />
        </div>
        <div className="right mt-1">
          <div className="small-screen flex items-center sm:hidden relative">
            <NotificationIcon allRead={allRead} unreadCount={unreadCount} />
            <div className="hamburger">
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
});

export default GeneralNavbar;
