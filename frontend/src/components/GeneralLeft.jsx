import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaExchangeAlt,
  FaCog,
  FaSignOutAlt,
  FaHistory,
  FaInfoCircle,
  FaChevronRight,
  FaChevronDown,
  FaSave,
} from "react-icons/fa";

import { useAuth } from "../context/AuthenticationContext";
import { useProduct } from "../context/ProductContext";
import { useGeneral } from "../context/GeneralContext";
import Transfer from "./Transfer";

const GeneralLeft = () => {
  const { logoutUser } = useAuth();
  const { productData } = useProduct();
  const {
    handleTransferForm,
    setTransferForm,
    transferForm,
    servicesDropDown,
    setServicesDropDown,
    handleServicesDropDowns,
  } = useGeneral();

  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleDropDownClose = () => {
    setServicesDropDown(false);
    setTransferForm(false);
  };

  // Common styles for sidebar items (with margin)
  const sidebarItemClass = (path, isFirst = false) => `
    py-[.7rem] rounded-xl text-white px-4 ${
      isFirst ? "" : "mt-4"
    } max-w-[13rem] 
    flex items-center gap-3 cursor-pointer
    ${
      activePath === path
        ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
        : "dark:hover:bg-white dark:hover:bg-opacity-5 hover:bg-gray-100 hover:transition hover:duration-400 ease-in-out"
    }
  `;

  // Animation variants
  const itemVariants = {
    hover: { scale: 0.95 },
    tap: { scale: 0.95 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { opacity: 1, y: 0, height: "auto" },
  };

  // Check if a service path is active
  const isServicePathActive = () => {
    return activePath.includes("/user/dashboard/services/");
  };

  return (
    <motion.div className="w-[25rem] min-w-[196px] h-[calc(100vh-25vh)] hidden pr-5 sm:block overflow-y-auto sticky top-[15vh] self-start font-body_two custom-scrollbar">
      <div>
        {/* Dashboard Item - First item without margin top */}
        <motion.div
          className={sidebarItemClass("/user/dashboard", true)}
          onClick={handleDropDownClose}
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
        >
          <FaHome className="w-4 text-blue-600" />
          <Link to="/user/dashboard">
            <p className="dark:text-white text-primary">Dashboard</p>
          </Link>
        </motion.div>

        {/* Transfer Item */}
        <motion.div
          className={sidebarItemClass("/user/transfer")}
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
        >
          <FaExchangeAlt className="w-4 text-sky-600" />
          <p
            className="dark:text-white text-primary"
            onClick={handleTransferForm}
          >
            Transfer
          </p>
        </motion.div>

        {/* Transfer Form Dropdown */}
        <AnimatePresence>
          {transferForm && (
            <motion.div
              className="relative my-5"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={dropdownVariants}
              transition={{ duration: 0.2 }}
            >
              <Transfer />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services Item */}
        <motion.div
          onClick={handleServicesDropDowns}
          className={`${sidebarItemClass("")} ${
            isServicePathActive()
              ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
              : ""
          }`}
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
        >
          <FaCog className="w-4 text-sky-600" />
          <p className="dark:text-white text-primary flex-grow">Services</p>
          {servicesDropDown ? (
            <FaChevronDown className="text-blue-600"/>
          ) : (
            <FaChevronRight className="text-blue-600"/>
          )}
        </motion.div>

        {/* Services Dropdown */}
        <AnimatePresence>
          {servicesDropDown && (
            <motion.div
              className="dropdown max-w-[13rem] overflow-hidden"
              initial="hidden"
              animate="visible"
              exit="hidden"
              // variants={dropdownVariants}
              transition={{ duration: 0.2 }}
            >
              <ul className="sidebar-auth-dropdown text-primary dark:text-white">
                {productData.slice(0, 4).map((item) => (
                  <motion.li
                    className={`mt-4 pl-11 bg-opacity-25 py-2 px-2 rounded-xl max-w-[13rem] transition duration-300 ease-in-out
                    ${
                      activePath ===
                      `/user/dashboard/services/${item.category.toLowerCase()}`
                        ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
                        : "hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5"
                    }`}
                    key={item.id}
                    whileHover="hover"
                    whileTap="tap"
                    variants={itemVariants}
                  >
                    <Link
                      to={`/user/dashboard/services/${item.category.toLowerCase()}`}
                    >
                      <p className="dark:text-white text-primary">
                        {item.category.toLowerCase()}
                      </p>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transactions Item */}
        <motion.div
          className={sidebarItemClass("/user/dashboard/transactions")}
          onClick={handleDropDownClose}
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
        >
          <FaHistory className="w-4 text-sky-600" />
          <Link to="/user/dashboard/transactions">
            <p className="dark:text-white text-primary">Transactions</p>
          </Link>
        </motion.div>

        {/* Shortcut Item */}
        <motion.div
          className={sidebarItemClass("/user/dashboard/shortcuts")}
          onClick={handleDropDownClose}
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
        >
          <FaSave className="w-4 text-sky-600" />
          <Link to="/user/dashboard/shortcuts">
            <p className="dark:text-white text-primary">Shortcuts</p>
          </Link>
        </motion.div>

        {/* About Item */}
        <motion.div
          className={sidebarItemClass("/dashboard/about")}
          onClick={handleDropDownClose}
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
        >
          <FaInfoCircle className="w-4 text-sky-600" />
          <Link to="/dashboard/about">
            <p className="dark:text-white text-primary">About</p>
          </Link>
        </motion.div>

        {/* Logout Item */}
        <motion.div
          className={sidebarItemClass("")}
          onClick={logoutUser}
          whileHover="hover"
          whileTap="tap"
          variants={itemVariants}
        >
          <FaSignOutAlt className="w-4 text-sky-600" />
          <p className="dark:text-white text-primary">Log Out</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GeneralLeft;
