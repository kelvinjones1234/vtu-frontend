import { useState, useContext, useEffect, React } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaCog,
  FaHistory,
  FaInfoCircle,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import Transfer from "./Transfer";
import { useGeneral } from "../context/GeneralContext";
import { useAuth } from "../context/AuthenticationContext";
import { useProduct } from "../context/ProductContext";
import dark from "../assets/dark.svg";
import light from "../assets/light.svg";

const GeneralSidebar = () => {
  const {
    mobileMenuToggle,
    handleMobileMenuToggle,
    generalSideBarAuthToggle,
    handleGeneralSideBarAuthToggle,
    handleMobileTransferForm,
    mobileTransferForm,
    handleThemeSettings,
    darkMode,
  } = useGeneral();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const { productData } = useProduct();
  const { logoutUser, user } = useAuth();
  const [activePath, setActivePath] = useState(location.pathname);

  // Function to handle menu item click and close the mobile menu
  const handleMenuItemClick = () => {
    if (mobileMenuToggle) {
      handleMobileMenuToggle();
    }
  };

  return (
    <div>
      {mobileMenuToggle && (
        <div
          className="overlay fixed top-0 left-0 w-full sm:hidden h-full bg-black bg-opacity-50 pointer-events-auto z-10"
          onClick={handleMobileMenuToggle}
        ></div>
      )}
      <div
        className={`harmburger-dropdown fixed top-0 left-0 h-screen py-2 px-[1rem] pr-0 bg-white dark:bg-primary sm:hidden text-primary dark:text-white transform transition-transform rounded-r-xl duration-200 ease-in-out z-20 ${
          mobileMenuToggle ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent click event propagation to overlay
      >
        <div className="flex items-center justify-between mr-9">
          <div className="flex items-center">
            <Link to={"/"} onClick={handleMenuItemClick}>
              <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
                MaduConnect
              </div>
            </Link>
          </div>
          <div className="light-dark-mode">
            <div
              onClick={handleThemeSettings}
              className="justify-center py-[.5rem] gap-8 rounded-xl flex items-center bg-gray-200 hover:bg-gray-300 px-3 dark:bg-white dark:bg-opacity-20 dark:hover:bg-opacity-10 transition duration-300 ease-in-out cursor-pointer"
            >
              <img src={darkMode ? dark : light} alt="" className="w-5" />
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-auto pr-[1rem]">
          <ul className="w-[13rem]">
            <Link to={"/user/dashboard/profile"} onClick={handleMenuItemClick}>
              <div className="h-[4rem] w-52 bg-gray-300 hover:bg-opacity-75 dark:hover:bg-opacity-25 hover:transition-all hover:duration-400 ease-in-out dark:bg-white dark:bg-opacity-20 my-12 rounded-xl flex items-center font-bold">
                <div className="h-10 w-10 bg-sky-500 rounded-full flex justify-center items-center m-3">
                  <p>P</p>
                </div>
                <div className="text-[.8rem]">
                  <p className="underline">
                    {user ? user.user.first_name.toUpperCase() : ""}
                  </p>
                  <span className="text-[.7rem] font-light">
                    {user.phone_number}
                  </span>
                </div>
              </div>
            </Link>
            <ul>
              <li
                className={`mt-4 items-center flex py-3 px-2 rounded-xl ${
                  activePath === "/user/dashboard"
                    ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
                    : "dark:hover:bg-white dark:hover:bg-opacity-5 hover:transition hover:duration-400 ease-in-out hover:bg-gray-100"
                }`}
              >
                <Link
                  to={"/user/dashboard"}
                  className="flex items-center"
                  onClick={handleMenuItemClick}
                >
                  <FaHome
                    className="h-[1.2rem] ml-[.2rem] mr-[1rem]"
                    style={{ color: "#1CCEFF" }}
                  />
                  <div>Dashboard</div>
                </Link>
              </li>
              <li
                className={`mt-4 items-center flex py-3 px-2 rounded-xl cursor-pointer ${
                  activePath === "/user/transfer"
                    ? "bg-white bg-opacity-20"
                    : "dark:hover:bg-white dark:hover:bg-opacity-5 hover:transition hover:duration-400 ease-in-out hover:bg-gray-100"
                }`}
                onClick={() => {
                  handleMobileTransferForm();
                }}
              >
                <FaExchangeAlt
                  className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
                  style={{ color: "#1CCEFF" }}
                />
                <div>Transfer</div>
              </li>
              <div
                className={`relative my-5 ${
                  mobileTransferForm ? "block" : "hidden"
                }
                }`}
              >
                <Transfer />
              </div>
              <li
                onClick={() => {
                  handleGeneralSideBarAuthToggle();
                }}
                className={`flex py-3 mt-4 py-3 items-center px-2 rounded-xl cursor-pointer ${
                  activePath === "/user/dashboard/services/data" ||
                  activePath === "/user/dashboard/services/airtime" ||
                  activePath === "/user/dashboard/services/cable subscription"
                    ? "bg-white bg-opacity-20"
                    : "dark:hover:bg-white dark:hover:bg-opacity-5 hover:bg-gray-100 hover:transition hover:duration-400 ease-in-out"
                }`}
              >
                <FaCog
                  className="h-[1.2rem] w-[1.5rem] mr-3"
                  style={{ color: "#1CCEFF" }}
                />
                <div className="flex items-center">
                  <div className="mr-12 ">Services</div>
                  {generalSideBarAuthToggle ? (
                    <FaChevronDown
                      className="h-[1.2rem]"
                      style={{ color: "#1CCEFF" }}
                    />
                  ) : (
                    <FaChevronRight
                      className="h-[1.2rem]"
                      style={{ color: "#1CCEFF" }}
                    />
                  )}
                </div>
              </li>
              <ul
                className={`dropdown transition-all duration-200 ease-in-out overflow-hidden ${
                  generalSideBarAuthToggle ? "block" : "hidden"
                }`}
              >
                <div className="sidebar-auth-dropdown">
                  {productData.slice(0, 4).map((item) => (
                    <li
                      className="mt-4 pl-11 bg-opacity-25 hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5 transition duration-300 ease-in-out flex py-2 px-2 rounded-xl"
                      key={item.id}
                    >
                      <Link
                        to={`/user/dashboard/services/${item.category.toLowerCase()}`}
                        onClick={handleMenuItemClick}
                      >
                        {item.category.toLowerCase()}
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </ul>
            <li
              className={`mt-4 items-center py-3 px-2 rounded-xl ${
                activePath === "/user/dashboard/transactions"
                  ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
                  : "dark:hover:bg-white dark:hover:bg-opacity-5 hover:transition hover:duration-400 ease-in-out hover:bg-gray-100"
              }`}
            >
              <Link
                to={"/user/dashboard/transactions"}
                className="flex items-center gap-[.9rem]"
                onClick={handleMenuItemClick}
              >
                <FaHistory
                  className="h-[1.2rem] ml-[.2rem]"
                  style={{ color: "#1CCEFF" }}
                />
                <div>Transactions</div>
              </Link>
            </li>
            <li className="mt-4 py-3 px-2 rounded-xl">
              <Link
                to={"/dashboard/about"}
                className="items-center flex"
                onClick={handleMenuItemClick}
              >
                <FaInfoCircle
                  className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
                  style={{ color: "#1CCEFF" }}
                />
                <div>About</div>
              </Link>
            </li>
            <li
              className="mb-10 mt-4 items-center flex py-3 px-2 rounded-xl cursor-pointer"
              onClick={() => {
                logoutUser();
                handleMenuItemClick();
              }}
            >
              <FaSignOutAlt
                className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
                style={{ color: "#1CCEFF" }}
              />
              <div>Log Out</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GeneralSidebar;
