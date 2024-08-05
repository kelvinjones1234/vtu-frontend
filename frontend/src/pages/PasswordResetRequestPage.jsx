import React, { useState } from "react";
import { Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";

const LeftSide = () => (
  <div className="left leading-[3rem] relative hidden justify-center items-center sm:flex h-[364px] shadow-lg shadow-indigo-900/20 bg-opacity-50 rounded-2xl w-[20rem] bg-black text-white">
    <div className="atom-logo text-[6vw] font-bold text-gradient absolute">
      Atom <br /> <span className="text-[1.5vw]">Virtual Top Up</span>
    </div>
  </div>
);

const PasswordResetRequestPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const reset = (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
    }
  };

  return (
    <div className="min-w-[150px] bg-opacity-[95%] z-[-1] font-body_two">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center w-full min-h-screen bg-no-repeat">
        <div className="authenticationnavbar flex justify-between p-4 lg:px-[6rem]">
          <div className="left flex items-center gap-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-green-500 border border-green-500 px-2 text-[.7rem] px-2 border-white rounded-[.5rem] font-bold">
                Atom
              </div>
            </Link>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="hidden ss:block text-gray-300">
            Don't have an account?
            <span className="text-link font-bold cursor-pointer hover:text-sky-400 transition duration-450 ease-in-out">
              <Link to="/authentication/register"> Get started</Link>
            </span>
          </div>
        </div>
        <form
          onSubmit={reset}
          className="font-poppins mt-[10vh] sm:flex justify-between login mx-auto px-4 w-full md:px-[4rem] lg:px-[8rem]"
        >
          <LeftSide />
          <div className="right sm:w-[50%] max-w-[550px] mx-auto sm:mx-0">
            <div className="top-text pb-6">
              <h5 className="font-bold leading-9 mb-5 font-heading_two text-[2rem] text-gray-300">
                Request Password Reset
              </h5>
              <p className="text-gray-300 text-[1.2rem]">
                Enter your registered email to reset your password
              </p>
            </div>
            <div>
              <input
                type="text"
                value={email}
                placeholder="email"
                aria-label="email"
                onChange={(e) => setEmail(e.target.value)}
                className="transition duration-450 ease-in-out my-2 w-full text-white py-1 px-4 h-[3.5rem] bg-[#18202F] text-[1.2rem] rounded-2xl outline-0 border border-gray-700 hover:border-black focus:border-link bg-opacity-80"
              />
            </div>

            <div className="text-center text-[1rem] text-gray-300 py-4 ss:hidden">
              <p>
                Already have an account?{" "}
                <span className="text-link font-semibold cursor-pointer">
                  <Link to={"/authentication/login"}>Login</Link>
                </span>
              </p>
            </div>
            <div>
              <SubmitButton label="Get Password Reset Link" />
            </div>
            <div className="text-center text-[1rem] text-gray-300 py-4 ss:hidden">
              <p>
                Don't have an account?{" "}
                <span className="text-link font-semibold cursor-pointer">
                  <Link to={"/authentication/register"}>Get started</Link>
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetRequestPage;
