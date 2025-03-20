import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
// import notification from "../assets/notification.svg";
import GeneralSidebar from "./GeneralSidebar";
import { RiSunLine, RiMoonLine } from "react-icons/ri";
import { useAuth } from "../context/AuthenticationContext";
import { useGeneral } from "../context/GeneralContext";
import { useProduct } from "../context/ProductContext";
import { RiMenu4Line, RiCloseLargeLine } from "react-icons/ri";
import { FaBell } from "react-icons/fa";

// NotificationIcon as a separate memoized component
const NotificationIcon = React.memo(({ allRead, unreadCount }) => (
  <div className="notification text-[25px] mr-9 grid relative items-center hover:bg-gray-300 grid relative justify-center items-center cursor-pointer">
    <Link to={"/user/notifications"}>
      <FaBell className="w-6 h-6 text-blue-600" />
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
      className="justify-center py-[.5rem] gap-8 rounded-full flex items-center bg-gray-200 hover:bg-gray-300 px-[.5rem] dark:bg-white dark:bg-opacity-20 dark:hover:bg-opacity-10 hover:transition hover:duration-300 ease-in-out cursor-pointer"
    >
      {darkMode ? (
        <RiSunLine className="w-5 h-5 text-yellow-600" />
      ) : (
        <RiMoonLine className="w-5 h-5 text-blue-600" />
      )}
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
  // Use a ref to avoid recreating the scroll handler
  const scrollTimeout = useRef(null);
  const scrolledRef = useRef(false);

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
      `px-4 lg:px-0 flex justify-between py-[.65rem] z-[10] fixed top-0 w-full hover:transition-colors hover:duration-200 ${
        isScrolled
          ? "dark:bg-gray-900 dark:bg-opacity-95 bg-opacity-95 bg-gray-50 shadow"
          : "bg-transparent"
      }`,
    [isScrolled]
  );

  // Effect for body overflow
  useEffect(() => {
    document.body.style.overflow = mobileMenuToggle ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuToggle]);

  // Optimized scroll handling with requestAnimationFrame
  useEffect(() => {
    const handleScroll = () => {
      // Update the ref immediately to reflect the current state
      const shouldBeScrolled = window.scrollY > 30;

      // Only proceed if there's a change in scroll state
      if (scrolledRef.current !== shouldBeScrolled) {
        scrolledRef.current = shouldBeScrolled;

        // Cancel any pending timeouts
        if (scrollTimeout.current) {
          cancelAnimationFrame(scrollTimeout.current);
        }

        // Use requestAnimationFrame for smoother visual updates
        scrollTimeout.current = requestAnimationFrame(() => {
          setIsScrolled(shouldBeScrolled);
        });
      }
    };

    // Use passive listener to improve performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        cancelAnimationFrame(scrollTimeout.current);
      }
    };
  }, []);

  // Pre-extract user's first name to avoid computation during render
  const firstName = useMemo(() => {
    return user?.user?.first_name?.toUpperCase() || "";
  }, [user]);

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
                  {firstName}
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
          <div className="small-screen flex items-center sm:hidden relative text-sky-600">
            <NotificationIcon allRead={allRead} unreadCount={unreadCount} />
            <div className="hamburger">
              <div
                onClick={handleMobileMenuToggle}
                className="text-[25px] text-blue-600"
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
