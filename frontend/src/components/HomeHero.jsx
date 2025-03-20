import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthenticationContext";

const HomeHero = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center fixed min-h-screen bg-no-repeat z-[-1]"></div>
      <div className="mx-auto px-4 ss:px-[6rem] pt-[20vh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main content */}
          <div className="lg:col-span-1">
            <motion.div
              className="text-center sm:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="font-bold mb-[4vh] font-heading_two">
                <h1 className="text-[2.8rem] sm:text-5xl md:text-[4rem] xl:text-[5rem] lg:text-[4rem] font-extrabold text-sky-400 dark:text-white  mb-6 font-heading_two leading-tight">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
                    MaduConnect
                  </span>
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-200 inline-block py-3">
                  Powering Your Connections
                </p>
              </div>

              <motion.div
                className="buttons flex sm:justify-start justify-center mb-[8vh] mt-[4vh] font-body_two"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="login">
                  <Link
                    to={`${user ? "/user/dashboard" : "/authentication/login"}`}
                  >
                    <motion.button
                      className="transition duration-300 ease-in-out text-[.9rem] sm:text-[1.2rem] md:text-[1.5rem] transform hover:-translate-y-1 hover:shadow-lg border bg-white dark:bg-[#18202F] border-link rounded-2xl py-[.4rem] text-gray-800 dark:text-white mx-4 px-6"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Login
                    </motion.button>
                  </Link>
                </div>
                <div className="register">
                  <Link
                    to={`${
                      user ? "/user/dashboard" : "/authentication/register"
                    }`}
                  >
                    <motion.button
                      className="bg-green-500 py-[.4rem] mr-9 px-6 text-[.9rem] sm:text-[1.2rem] md:text-[1.5rem] bg-opacity-[90%] transition duration-300 ease-in-out transform hover:-translate-y-1 text-white rounded-2xl font-bold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Register
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Feature card on the right */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white dark:bg-primary bg-opacity-90 dark:bg-opacity-90 rounded-xl px-6 py-8 text-gray-800 dark:text-white shadow-lg shadow-indigo-900/10 border border-indigo-900/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h3 className="text-[1rem] md:text-[1.5rem] uppercase py-4 font-heading_two font-bold text-sky-600 dark:text-[#1CCEFF]">
                Instantly Top Up Anytime, Anywhere...
              </h3>
              <p className="font-body_two text-gray-700 dark:text-gray-200 pb-[3vh] md:text-[1.1rem]">
                At MaduConnect, we understand the importance of staying
                connected. Whether you need to recharge your mobile phone, pay
                your utility bills, or purchase digital services, we are here to
                make it effortless. Our fast, secure, and user-friendly platform
                ensures you can top up instantly, no matter where you are.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-indigo-800/30">
                <div className="flex items-center gap-2 my-2">
                  <div className="w-2 h-2 rounded-full bg-sky-600 dark:bg-[#1CCEFF]"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Secure transactions
                  </p>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <div className="w-2 h-2 rounded-full bg-sky-600 dark:bg-[#1CCEFF]"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Available 24/7
                  </p>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <div className="w-2 h-2 rounded-full bg-sky-600 dark:bg-[#1CCEFF]"></div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    Lightning-fast processing
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
