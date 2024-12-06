import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthenticationContext";

const HomeHero = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <div className="relative">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center fixed w-full min-h-screen bg-no-repeat z-[-1]"></div>
      <div className="mx-auto px-4 ss:px-[5rem] w-full md:px-[4rem] pt-[22vh] lg:px-[8rem]">
        <motion.div
          className="text-white text-center sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="main-text text-[2rem] xs:text-[3rem] font-bold mb-[5vh] font-heading_two leading-[2rem]">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 font-heading_two">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
                MaduConnect
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white bg-primary bg-opacity-90 inline-block px-6 py-3 rounded-full mb-10 shadow-md">
              Powering Your Connections
            </p>
          </div>
          <motion.div
            className="bg-opacity-90 rounded-xl px-4 sm:w-[80%] sm:max-w-[700px] py-[3vh] bg-primary my-[3vh] shadow-lg shadow-indigo-900/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-[1rem] uppercase py-4 font-heading_two">
              Instantly Top Up Anytime, Anywhere...
            </h3>
            <p className="font-body_two pb-[3vh]">
              At MaduConnect, we understand the importance of staying connected.
              Whether you need to recharge your mobile phone, pay your utility
              bills, or purchase digital services, we are here to make it
              effortless. Our fast, secure, and user-friendly platform ensures
              you can top up instantly, no matter where you are.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          className="buttons flex sm:justify-start justify-center mb-[12vh] mt-[5vh] font-body_two"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="login">
            <Link to={`${user ? "/user/dashboard" : "/authentication/login"}`}>
              <button className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg border bg-[#18202F] border-link rounded-2xl py-[.4rem] hover:text-link transition-all duration-500 ease-in-out text-white mx-4 px-6">
                Login
              </button>
            </Link>
          </div>
          <div className="register">
            <Link
              to={`${user ? "/user/dashboard" : "/authentication/register"}`}
            >
              <button className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg bg-blue-500 rounded-2xl hover:bg-blue-600 py-[.46rem] transition duration-500 ease-in-out mx-4 px-6">
                Register
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomeHero;
