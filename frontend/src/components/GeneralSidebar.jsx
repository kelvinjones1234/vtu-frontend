import { useState, useContext, useEffect, React } from "react";
import authenticate from "../assets/authenticate.svg";
import about from "../assets/about.svg";
import right from "../assets/right_arrow.svg";
import bottom from "../assets/bottom_arrow.svg";
import { Link } from "react-router-dom";
import transfer from "../assets/transfer.svg";
import dashboard from "../assets/dashboard.svg";
import services from "../assets/services.svg";
import transactions from "../assets/transactions.svg";
import price_list from "../assets/price_list.svg";
import logout from "../assets/logout.svg";
import { ProductContext } from "../context/ProductContext";
import Transfer from "./Transfer";
import { AuthContext } from "../context/AuthenticationContext";
import dark from "../assets/dark.svg";
import light from "../assets/light.svg";
import { GeneralContext } from "../context/GeneralContext";

const GeneralSidebar = ({ generalMenuToggle, handleGeneralMenuToggle }) => {
  const [generalSideBarAuthToggle, setGeneralSideBarAuthToggle] =
    useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const { productData } = useContext(ProductContext);
  const { handleThemeSettings, darkMode } = useContext(GeneralContext);
  const { logoutUser, user } = useContext(AuthContext);
  const [activePath, setActivePath] = useState(location.pathname);
  const [transferForm, setTransferForm] = useState(false);

  const handleGeneralSideBarAuthToggle = () => {
    setGeneralSideBarAuthToggle((previous) => !previous);
    if (transferForm) {
      setTransferForm(false);
    }
  };

  const handleTransferForm = () => {
    setTransferForm((previous) => !previous);
    if (generalMenuToggle) {
      setGeneralSideBarAuthToggle(false);
    }
  };

  return (
    <div>
      {generalMenuToggle && (
        <div
          className="overlay fixed top-0 left-0 w-full sm:hidden h-full bg-black bg-opacity-50 pointer-events-auto z-10"
          onClick={handleGeneralMenuToggle}
        ></div>
      )}
      <div
        className={`harmburger-dropdown fixed top-0 left-0 h-screen p-[1rem] pr-0 bg-white dark:bg-primary sm:hidden text-primary dark:text-white transform transition-transform rounded-r-xl duration-200 ease-in-out z-20 ${
          generalMenuToggle ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent click event propagation to overlay
      >
        <div className="flex justify-between mr-9">
          <div className="flex items-center gap-1 mt-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-green-500 border dark:border-green-500 px-2 text-[.7rem] px-2 border-green-500 rounded-[.5rem] font-bold">
                Atom
              </div>
            </Link>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="light-dark-mode mt-3">
            <div
              onClick={handleThemeSettings}
              className="justify-center py-[.5rem] gap-8 rounded-xl flex items-center bg-gray-200 hover:bg-gray-300 px-3 dark:bg-white dark:bg-opacity-20 dark:hover:bg-opacity-10 transition duration-300 ease-in-out cursor-pointer"
            >
              <img src={darkMode ? dark : light} alt="" className="w-4" />
            </div>
          </div>
        </div>

        <div className="h-full overflow-y-auto pr-[1rem]">
          <ul className="w-[13rem] font-bold">
            <div className="h-[4rem] w-52 bg-gray-300 dark:bg-white dark:bg-opacity-20 my-12 rounded-xl flex items-center font-bold">
              <div className="h-10 w-10 bg-sky-500 rounded-full flex justify-center items-center m-3">
                <p>P</p>
              </div>
              <p>
                {user.first_name.toUpperCase()} <br />
                <span className="text-[.7rem] font-light">
                  {user.phone_number}
                </span>
              </p>
            </div>
            <ul>
              <li
                className={`mt-4 items-center flex  py-3 px-2 rounded-xl ${
                  activePath === "/user/dashboard" && "bg-white bg-opacity-20"
                }`}
              >
                <Link to={"/user/dashboard"} className="flex items-center">
                  <img
                    src={dashboard}
                    alt=""
                    className="h-[1.2rem] ml-[.2rem] mr-[1rem]"
                  />
                  <div>Dashboard</div>
                </Link>
              </li>
              <li
                className="mt-4 items-center flex py-3 px-2 rounded-xl cursor-pointer"
                onClick={handleTransferForm}
              >
                <img
                  src={transfer}
                  alt=""
                  className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
                />
                <div>Transfer</div>
              </li>
              <div
                className={`relative my-5 ${transferForm ? "block" : "hidden"}`}
              >
                <Transfer setTransferForm={setTransferForm} />
              </div>
              <li
                onClick={handleGeneralSideBarAuthToggle}
                className={`flex py-3 mt-4 py-3 items-center px-2 rounded-xl ${
                  activePath === "/user/dashboard/services/data" ||
                  activePath === "/user/dashboard/services/airtime" ||
                  activePath ===
                    "/user/dashboard/services/cable%20subscription" ||
                  (activePath ===
                    "/user/dashboard/services/electricity%20bill" &&
                    "bg-white bg-opacity-20")
                }`}
              >
                <img
                  src={services}
                  alt=""
                  className="h-[1.2rem] w-[1.5rem] mr-3"
                />
                <div className="flex items-center">
                  <div className="mr-12 ">Services</div>
                  {generalSideBarAuthToggle ? (
                    <img src={bottom} alt="" className="h-[1.2rem]" />
                  ) : (
                    <img src={right} alt="" className="h-[1.2rem]" />
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
                      className="mt-4 pl-11 bg-opacity-25 flex py-2 px-2 rounded-xl"
                      key={item.id}
                    >
                      <Link
                        to={`/user/dashboard/services/${item.category.toLowerCase()}`}
                      >
                        {item.category}
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </ul>
            <li
              className={`mt-4 items-center py-3 px-2 rounded-xl ${
                activePath === "/user/dashboard/transactions" &&
                "bg-white bg-opacity-20"
              }`}
            >
              <Link
                to={"/user/dashboard/transactions"}
                className="flex items-center gap-[.9rem]"
              >
                <img
                  src={transactions}
                  alt=""
                  className="h-[1.2rem] ml-[.2rem]"
                />
                <div>Transactions</div>
              </Link>
            </li>
            <li
              className={`mt-4 items-center py-3 px-2 rounded-xl ${
                activePath === "/user/dashboard/transactions" &&
                "bg-white bg-opacity-20"
              }`}
            >
              <Link
                to={"/user/dashboard/transactions"}
                className="flex items-center"
              >
                <img
                  src={price_list}
                  alt=""
                  className="h-[1.2rem] ml-[.2rem] mr-[1rem]"
                />
                <div>Price List</div>
              </Link>
            </li>
            <li
              className={`mt-4 items-center flex  py-3 px-2 rounded-xl ${
                activePath === "/user/dashboard/profile" &&
                "bg-white bg-opacity-20"
              }`}
            >
              <Link
                to={"/user/dashboard/profile"}
                className="flex items-center"
              >
                <img
                  src={dashboard}
                  alt=""
                  className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
                />
                <div>Profile</div>
              </Link>
            </li>
            <li className="mt-4 items-center flex  py-3 px-2 rounded-xl">
              <img
                src={about}
                alt=""
                className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
              />
              <div>About</div>
            </li>
            <li
              className="mb-10 mt-4 items-center flex  py-3 px-2 rounded-xl cursor-pointer"
              onClick={logoutUser}
            >
              <img
                src={logout}
                alt=""
                className="h-[1.2rem] w-[1.1rem] ml-[.2rem] mr-[1rem]"
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
