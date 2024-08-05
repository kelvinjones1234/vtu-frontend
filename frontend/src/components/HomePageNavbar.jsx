import React, { useState, useEffect } from "react";
import menu from "../assets/menu.svg";
import close from "../assets/close.svg";
import authenticate from "../assets/authenticate.svg";
import about from "../assets/about.svg";
import right from "../assets/right_arrow.svg";
import bottom from "../assets/bottom_arrow.svg";
import { Link } from "react-router-dom";
import { RiMenu4Line } from "react-icons/ri";
import { RiCloseLargeLine } from "react-icons/ri";

const HomePageNavbar = ({ homeMenuToggle, setHomeMenuToggle }) => {
  const [sideBarAuthToggle, setSideBarAuthToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSideBarAuthToggle = () => {
    setSideBarAuthToggle((previous) => !previous);
  };

  const handleHomeMenuToggle = () => {
    setHomeMenuToggle((previous) => !previous);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
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
        className={`p-4 lg:px-0 flex justify-between lg:px-[6rem] fixed top-0 w-full transition-colors duration-200 ${
          isScrolled ? "bg-primary" : "bg-transparent"
        }`}
      >
        <div className="flex items-center gap-1">
          <Link to={"/"}>
            <div className="logo font-heading_one text-green-500 border border-green-500 px-2 text-[.7rem] px-2 border-white rounded-[.5rem] font-bold">
              Atom
            </div>
          </Link>
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="right">
          <div className={`small-screen flex items-center sm:hidden`}>
            <div className="get-started">
              <button className="bg-geen-500 py-[.4rem] mr-9 px-4 text-[1.1rem] hover:text-sky-500 text-link rounded-2xl font-bold">
                <Link to={"/authentication/register"}>Get Started</Link>
              </button>
            </div>
            <div className="hamburger">
              <div
                onClick={handleHomeMenuToggle}
                className="text-[25px] dark:text-white text-link"
              >
                {homeMenuToggle ? <RiCloseLargeLine /> : <RiMenu4Line />}
              </div>
            </div>
          </div>
          <div className="large-screen hidden lg:pr-[6rem]">
            <div className="button">
              <button className="text-link border py-[.5rem] mr-8 font-semibold px-4 text-[.9rem] rounded-xl">
                <Link to={"/authentication/register"}>Login</Link>
              </button>
            </div>
            <div className="button">
              <button className="bg-link py-[.5rem] font-semibold px-4 text-[.9rem] rounded-xl">
                <Link to={"/authentication/register"}>Register</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      {homeMenuToggle && (
        <div
          className="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 sm:hidden pointer-events-auto z-10"
          onClick={handleHomeMenuToggle}
        ></div>
      )}

      <div
        className={`harmburger-dropdown fixed top-0 left-0 h-screen p-[1rem] sm:hidden bg-opacity-95 bg-primary text-white transform transition-transform rounded-r-xl duration-200 ease-in-out z-20 ${
          homeMenuToggle ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent click event propagation to overlay
      >
        <ul className="w-[13rem]">
          <div className="flex items-center gap-1 mt-[.55rem] mb-9">
            <Link to={"/"}>
              <div className="logo font-heading_one text-green-500 border border-green-500 px-2 text-[.7rem] px-2 border-white rounded-[.5rem] font-bold">
                Atom
              </div>
            </Link>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <ul>
            <li
              onClick={handleSideBarAuthToggle}
              className="bg-white bg-opacity-20 flex py-3 px-2 rounded-xl"
            >
              <img
                src={authenticate}
                alt=""
                className="h-[1.2rem] w-[1.5rem] mr-3"
              />
              <div className="flex items-center">
                <div className="mr-6 ">Authentication</div>
                {sideBarAuthToggle ? (
                  <img src={bottom} alt="" className="h-[1.2rem]" />
                ) : (
                  <img src={right} alt="" className="h-[1.2rem]" />
                )}
              </div>
            </li>
            <ul
              className={`dropdown transition-all duration-200 ease-in-out overflow-hidden ${
                sideBarAuthToggle ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="sidebar-auth-dropdown">
                <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl">
                  <Link to={"/authentication/login"}>Login</Link>
                </li>
                <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl">
                  <Link to={"/authentication/register"}>Register</Link>
                </li>

                <li className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl">
                  <Link to={"/user/get-password-reset-link"}>
                    Reset Password
                  </Link>
                </li>
              </div>
            </ul>
          </ul>
          <li className="mt-4 items-center flex bg-white bg-opacity-20 py-3 px-2 rounded-xl">
            <img
              src={about}
              alt=""
              className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
            />
            <div>About</div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default HomePageNavbar;
