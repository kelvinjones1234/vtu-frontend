import { AuthContext } from "../context/AuthenticationContext";
import dashboard from "../assets/dashboard.svg";
import transfer from "../assets/transfer.svg";
import services from "../assets/services.svg";
import logout from "../assets/logout.svg";
import transactions from "../assets/transactions.svg";
import about from "../assets/about.svg";
import bottom_arrow from "../assets/bottom_arrow.svg";
import right_arrow from "../assets/right_arrow.svg";
import Transfer from "./Transfer";
import { Link, useLocation } from "react-router-dom";
import { useContext, React, useEffect, useState } from "react";
import { ProductContext } from "../context/ProductContext";
import { motion } from "framer-motion";

const GeneralLeft = () => {
  const { logoutUser } = useContext(AuthContext);
  const { productData } = useContext(ProductContext);
  const [servicesDropDown, setServicesDropDown] = useState(false);
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [transferForm, setTransferForm] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleServicesDropDowns = () => {
    setServicesDropDown((previous) => !previous);
    if (transferForm) {
      setTransferForm(false);
    }
  };

  const handleTransferForm = () => {
    setTransferForm((previous) => !previous);
    if (servicesDropDown) {
      setServicesDropDown(false);
    }
  };

  const handleDropDownClose = () => {
    setServicesDropDown(false);
    setTransferForm(false);
  };

  return (
    <motion.div
      className="w-[25rem] min-w-[175.38px] h-[calc(100vh-25vh)] hidden pr-5 sm:block overflow-y-auto sticky top-[15vh] self-start font-body_two custom-scrollbar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <motion.div
          className={`py-[.7rem] rounded-xl font-bold text-white px-4 mt-4 max-w-[13rem] sm:mt-0 ${
            activePath === "/user/dashboard"
              ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
              : "dark:hover:bg-white dark:hover:bg-opacity-5 transition duration-400 ease-in-out hover:bg-gray-100"
          }`}
          onClick={handleDropDownClose}
          whileHover={{ scale: .95 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="cursor-pointer dark:text-white text-primary inline-flex items-center gap-3">
            <img src={dashboard} alt="" className="w-4" />
            <Link to={"/user/dashboard"}>
              <p className="">Dashboard</p>
            </Link>
          </div>
        </motion.div>
        <motion.div
          className={`py-[.7rem] gap-3 rounded-xl flex items-center max-w-[13rem] font-bold text-white px-4 mt-4 ${
            activePath === "/user/transfer"
              ? "bg-white bg-opacity-20"
              : "dark:hover:bg-white dark:hover:bg-opacity-5 transition duration-400 ease-in-out hover:bg-gray-100"
          }`}
          whileHover={{ scale: .95 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={transfer} alt="" className="w-4" />
          <p
            className="cursor-pointer dark:text-white text-primary"
            onClick={handleTransferForm}
          >
            Transfer
          </p>
        </motion.div>
        <motion.div
          className={`relative my-5 ${transferForm ? "block" : "hidden"}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Transfer />
        </motion.div>
        <motion.div
          className={`py-[.7rem] rounded-xl max-w-[13rem] flex items-center font-bold text-white px-4 mt-4  
          ${
            activePath === "/user/dashboard/services/data" ||
            activePath === "/user/dashboard/services/airtime" ||
            activePath === "/user/dashboard/services/cable subscription"
              ? "bg-white bg-opacity-20"
              : "dark:hover:bg-white dark:hover:bg-opacity-5 hover:bg-gray-100 transition duration-400 ease-in-out"
          }`}
          whileHover={{ scale: .95 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="flex items-center relative gap-5 cursor-pointer"
            onClick={handleServicesDropDowns}
          >
            <div className="flex items-center gap-3">
              <img src={services} alt="" className="w-4" />
              <div className="dark:text-white text-primary">Services</div>
            </div>
            <div className="">
              <img
                src={servicesDropDown ? bottom_arrow : right_arrow}
                alt=""
                className="w-4 absolute top-[.3rem]"
              />
            </div>
          </div>
        </motion.div>
        <motion.div
          className={`dropdown transition-all max-w-[13rem] duration-400 ease-in-out overflow-hidden ${
            servicesDropDown ? "block" : "hidden"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="sidebar-auth-dropdown text-primary dark:text-white">
            {productData.slice(0, 4).map((items) => (
              <motion.li
                className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white max-w-[13rem] dark:hover:bg-opacity-5 transition duration-300 ease-in-out"
                key={items.id}
                whileHover={{ scale: .95 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={`/user/dashboard/services/${items.category.toLowerCase()}`}
                >
                  {items.category.toLowerCase()}
                </Link>
              </motion.li>
            ))}
          </div>
        </motion.div>
        <motion.div
          className={`py-[.7rem] gap-3 rounded-xl max-w-[13rem] flex items-center font-bold text-white px-4 mt-4 ${
            activePath === "/user/dashboard/transactions"
              ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
              : "dark:hover:bg-white dark:hover:bg-opacity-5 transition duration-400 ease-in-out hover:bg-gray-100"
          }`}
          onClick={handleDropDownClose}
          whileHover={{ scale: .95 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={transactions} alt="" className="w-4" />
          <Link to={"/user/dashboard/transactions"}>
            <p className="cursor-pointer dark:text-white text-primary">
              Transactions
            </p>
          </Link>
        </motion.div>
        <motion.div
          className={`py-[.7rem] gap-3 rounded-xl max-w-[13rem] flex items-center font-bold text-white px-4 mt-4 ${
            activePath === "/dashboard/about"
              ? "dark:bg-white dark:bg-opacity-20 bg-gray-300"
              : "dark:hover:bg-white dark:hover:bg-opacity-5 transition duration-400 ease-in-out hover:bg-gray-100"
          }`}
          onClick={handleDropDownClose}
          whileHover={{ scale: .95 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={about} alt="" className="w-4" />
          <Link to={"/dashboard/about"}>
            <p className="cursor-pointer dark:text-white text-primary">About</p>
          </Link>
        </motion.div>
        <motion.div
          className="dark:hover:bg-white dark:hover:bg-opacity-5 hover:bg-gray-100 max-w-[13rem] transition duration-400 ease-in-out py-[.7rem] gap-3 rounded-xl flex items-center font-bold text-white px-4 mt-4"
          onClick={logoutUser}
          whileHover={{ scale: .95 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={logout} alt="" className="w-4" />
          <p className="cursor-pointer dark:text-white text-primary">Log Out</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GeneralLeft;
