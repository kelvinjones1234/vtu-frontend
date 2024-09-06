import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import { GeneralContext } from "../context/GeneralContext";
import LeftSide from "../components/LeftSide";

// const LeftSide = () => (
//   <div className="left leading-[3rem] relative hidden justify-center items-center sm:flex h-[364px] shadow-lg shadow-indigo-900/20 bg-opacity-50 rounded-2xl w-[20rem] bg-black text-white">
//     <div className="atom-logo text-[6vw] font-bold text-gradient absolute">
//       Atom <br /> <span className="text-[1.5vw]">Virtual Top Up</span>
//     </div>
//   </div>
// );

const PasswordResetRequestPage = () => {
  const { setLoading } = useContext(GeneralContext);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const reset = (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      setError("");
      setMessage("");

      axios
        .post("http://127.0.0.1:8000/api/password-reset/", { email })
        .then((response) => {
          setLoading(false);
          setMessage("Password reset link has been sent to your email.");
        })
        .catch((error) => {
          setLoading(false);
          if (error.response && error.response.data) {
            setError(error.response.data.error || "Something went wrong.");
          } else {
            setError("An error occurred. Please try again.");
          }
        });
    }
  };

  return (
    <div className="min-w-[150px] z-[-1] font-body_two h-screen bg-dark-custom-gradient">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center w-full min-h-screen bg-no-repeat">
        <div className="authenticationnavbar flex justify-between py-[1.18rem] px-4 lg:px-[6rem]">
          <div className="left flex items-center gap-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-transparent bg-clip-text px-2 text-[.7rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
                MaduPay
              </div>
            </Link>
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
          className="font-poppins mt-[3rem] sm:flex justify-between login mx-auto px-4 w-full md:px-[4rem] lg:px-[8rem]"
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
            <div className="pb-3">
              {(error || message) && (
                <div
                  className={`p-4 rounded-lg shadow-md flex items-center ${
                    error
                      ? "bg-red-50 text-red-800 border-l-4 border-red-500"
                      : "bg-green-50 text-green-800 border-l-4 border-green-500"
                  }`}
                >
                  <div className="flex-shrink-0 mr-3 mb-4">
                    {error ? (
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{error ? "Error" : "Success"}</p>
                    <p className="text-sm">{error || message}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full py-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
                className="w-full text-white py-3 px-4 bg-[#18202F] text-lg rounded-xl outline-none border border-gray-700 hover:border-gray-500 focus:border-link transition duration-300 ease-in-out"
              />
            </div>
            <SubmitButton label="Get Password Reset Link" />

            <div className="text-center text-[1rem] text-gray-300 py-4 ss:hidden">
              <p>
                Already have an account?{" "}
                <span className="text-link font-semibold cursor-pointer">
                  <Link to={"/authentication/login"}>Login</Link>
                </span>
              </p>
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
