import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthenticationContext";

const HomeHero = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center fixed w-full min-h-screen bg-no-repeat fixed z-[-1]"></div>
      <div className="mx-auto px-4 ss:px-[5rem] w-full md:px-[4rem] pt-[22vh] lg:px-[8rem]">
        {/* <div className="bg-bg_one md:h-screen bg-contain sm:bg-cover bg-center bg-no-repeat"></div> */}
        <div className="text-white text-center sm:text-left">
          <div className="main-text text-[2rem] xs:text-[3rem] font-bold mb-[5vh] font-heading_two leading-[2rem]">
            <h1 className="">
              Welcome to <span className="text-gradient">Atom</span>
            </h1>
            <div className="sm:flex sm:mt-2">
              <p className="text-[1rem] bg-black bg-primary inline-block bg-opacity-80 px-4 rounded-[.5rem] sm:rounded-full">
                {" "}
                Powering Your Connections
              </p>
              <div className="hidden sm:flex items-center">
                <p className="h-7 w-7 bg-primary rounded-full ml-2 bg-opacity-80"></p>
                <p className="h-7 w-7 bg-primary rounded-full ml-2 bg-opacity-80"></p>
                <p className="h-7 w-7 bg-primary rounded-full ml-2 bg-opacity-80"></p>
              </div>
            </div>
          </div>
          <div className="bg-opacity-90 rounded-xl px-4 sm:w-[80%] sm:max-w-[700px] py-[3vh] bg-primary my-[3vh] shadow-lg shadow-indigo-900/10">
            <h3 className="text-[1rem] uppercase py-4 font-heading_two">
              Instantly Top Up Anytime, Anywhere...
            </h3>
            <p className="font-body_two pb-[3vh]">
              At Atom, we understand the importance of staying connected.
              Whether you need to recharge your mobile phone, pay your utility
              bills, or purchase digital services, Atom is here to make it
              effortless. Our fast, secure, and user-friendly platform ensures
              you can top up instantly, no matter where you are.
            </p>
          </div>
        </div>
        <div className="buttons flex sm:justify-start justify-center mb-[12vh] mt-[5vh] font-body_two">
          <div className="login">
            <Link to={`${user ? "/user/dashboard" : "/authentication/login"}`}>
              <button className="border border-link rounded-2xl py-[.4rem] hover:text-sky-500 transition-all duration-500 ease-in-out text-white mx-4 px-6">
                Login
              </button>
            </Link>
          </div>
          <div className="register">
            <Link
              to={`${user ? "/user/dashboard" : "/authentication/register"}`}
            >
              <button className="bg-link rounded-2xl hover:bg-sky-500 py-[.4rem] transition duration-500 ease-in-out mx-4 px-6">
                Register
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;
