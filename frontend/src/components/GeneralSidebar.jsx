import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaCog, 
  FaHistory,
  FaInfoCircle,
  FaSave,
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
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

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

  const { productData } = useProduct();
  const { logoutUser, user } = useAuth();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // Function to handle menu item click and close the mobile menu
  const handleMenuItemClick = () => {
    if (mobileMenuToggle) {
      handleMobileMenuToggle();
    }
  };

  // Menu item component to reduce repetition
  const MenuItem = ({
    icon,
    label,
    onClick,
    isActive,
    hasDropdown,
    isDropdownOpen,
  }) => {
    const Icon = icon;
    const baseClasses =
      "flex items-center py-3 px-3 rounded-xl transition-all duration-300 ease-in-out mt-2";
    const activeClass = "bg-gray-300 dark:bg-white dark:bg-opacity-20";
    const hoverClass =
      "hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5";

    return (
      <li
        className={`${baseClasses} ${isActive ? activeClass : hoverClass}`}
        onClick={onClick}
      >
        <Icon className="h-5 w-5 mr-3 text-[#1CCEFF]" />
        <span className="flex-grow">{label}</span>
        {hasDropdown &&
          (isDropdownOpen ? (
            <FaChevronDown className="h-4 w-4 text-[#1CCEFF]" />
          ) : (
            <FaChevronRight className="h-4 w-4 text-[#1CCEFF]" />
          ))}
      </li>
    );
  };

  return (
    <div>
      {/* Overlay */}
      {mobileMenuToggle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden"
          onClick={handleMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 py-4 px-4 bg-white dark:bg-primary shadow-lg text-primary dark:text-white transform transition-transform duration-300 ease-in-out z-20 rounded-r-xl sm:hidden ${
          mobileMenuToggle ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with logo and theme toggle */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center">
            <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
              MaduConnect
            </div>
          </Link>

          <button
            onClick={handleThemeSettings}
            className="p-2 rounded-full bg-gray-200 dark:bg-white dark:bg-opacity-20 hover:bg-gray-300 dark:hover:bg-opacity-30 transition-colors"
          >
            <img
              src={darkMode ? dark : light}
              alt="Theme toggle"
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* User profile */}
        <Link to="/user/dashboard/profile">
          <div className="flex items-center p-3 bg-gray-200 dark:bg-white dark:bg-opacity-20 rounded-xl mb-6 hover:bg-opacity-75 dark:hover:bg-opacity-30">
            <div className="h-10 w-10 bg-sky-500 rounded-full flex justify-center items-center mr-3 text-white font-semibold">
              {user?.user?.first_name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold">
                {user?.user?.first_name?.toUpperCase() || "User"}
              </p>
            </div>
          </div>
        </Link>

        {/* Menu items */}
        <div className="overflow-y-auto h-[calc(100%-13rem)] pr-1">
          <nav>
            <ul className="space-y-1">
              <Link to="/user/dashboard" onClick={handleMenuItemClick}>
                <MenuItem
                  icon={FaHome}
                  label="Dashboard"
                  isActive={activePath === "/user/dashboard"}
                />
              </Link>

              <MenuItem
                icon={FaExchangeAlt}
                label="Transfer"
                onClick={handleMobileTransferForm}
                isActive={activePath === "/user/transfer"}
              />

              {/* Transfer form */}
              {mobileTransferForm && (
                <div className="my-2 pl-4">
                  <Transfer />
                </div>
              )}

              {/* Services dropdown */}
              <MenuItem
                icon={FaCog}
                label="Services"
                onClick={handleGeneralSideBarAuthToggle}
                isActive={[
                  "/user/dashboard/services/data",
                  "/user/dashboard/services/airtime",
                  "/user/dashboard/services/cable subscription",
                ].includes(activePath)}
                hasDropdown={true}
                isDropdownOpen={generalSideBarAuthToggle}
              />

              {/* Services submenu */}
              {generalSideBarAuthToggle && (
                <ul className="pl-8 py-1 space-y-1">
                  {productData.slice(0, 4).map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/user/dashboard/services/${item.category.toLowerCase()}`}
                        onClick={handleMenuItemClick}
                        className="block py-2 px-3 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5 transition-colors"
                      >
                        {item.category.toLowerCase()}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/user/dashboard/transactions"
                onClick={handleMenuItemClick}
              >
                <MenuItem
                  icon={FaHistory}
                  label="Transactions"
                  isActive={activePath === "/user/dashboard/transactions"}
                />
              </Link>

              <Link
                to="/user/dashboard/shortcuts"
                onClick={handleMenuItemClick}
              >
                <MenuItem
                  icon={FaSave}
                  label="Shortcuts"
                  isActive={activePath === "/user/dashboard/shortcuts"}
                />
              </Link>

              <Link to="/dashboard/about" onClick={handleMenuItemClick}>
                <MenuItem
                  icon={FaInfoCircle}
                  label="About"
                  isActive={activePath === "/dashboard/about"}
                />
              </Link>
            </ul>
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={() => {
              logoutUser();
              handleMenuItemClick();
            }}
            className="flex items-center w-full py-3 px-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors"
          >
            <FaSignOutAlt className="h-5 w-5 mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSidebar;
