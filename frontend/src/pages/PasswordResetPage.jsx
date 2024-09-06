import React, { useContext, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GeneralContext } from "../context/GeneralContext";
import SubmitButton from "../components/SubmitButton";
import LeftSide from "../components/LeftSide";

const PasswordResetPage = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useContext(GeneralContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const reset = async (e) => {
    e.preventDefault();
    setMessage({ type: "", content: "" });

    // Validate inputs
    if (!password || !confirmPassword) {
      setMessage({ type: "error", content: "All fields are required." });
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        content: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", content: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/reset-password/${uidb64}/${token}/`,
        {
          password: password,
          password_confirm: confirmPassword,
        }
      );

      if (response.status === 200) {
        setMessage({
          type: "success",
          content: "Password reset successful. Redirecting to login...",
        });
        setTimeout(() => {
          navigate("/authentication/login");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage({
          type: "error",
          content: error.response.data.error || "Password reset failed.",
        });
      } else {
        setMessage({
          type: "error",
          content: "An error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-[150px] bg-opacity-[95%] z-[-1] font-body_two">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center w-full min-h-screen bg-no-repeat">
        <div className="authenticationnavbar flex justify-between py-[1.18rem] px-4 lg:px-[6rem]">
          <div className="left flex items-center gap-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-transparent bg-clip-text px-2 text-[.7rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
                MaduPay
              </div>
            </Link>
          </div>
        </div>{" "}
        <form
          onSubmit={reset}
          className="font-poppins mt-[3rem] sm:flex justify-between login mx-auto px-4 w-full md:px-[4rem] lg:px-[8rem]"
        >
          <LeftSide />
          <div className="right sm:w-[50%] max-w-[550px] mx-auto sm:mx-0">
            <div className="top-text pb-6">
              <h5 className="font-bold leading-9 mb-3 font-heading_two text-[2rem] text-gray-300">
                Reset Password
              </h5>
              <p className="text-gray-300 text-[1.2rem]">
                Enter a strong password and retype it for confirmation.
              </p>
            </div>
            {message.content && (
              <div
                className={`mb-4 p-4 rounded-lg shadow-md flex items-center ${
                  message.type === "error"
                    ? "bg-red-50 text-red-800 border-l-4 border-red-500"
                    : "bg-green-50 text-green-800 border-l-4 border-green-500"
                }`}
              >
                <div className="flex-shrink-0 mr-3 mb-4">
                  {message.type === "error" ? (
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
                  <p className="font-medium">
                    {message.type === "error" ? "Error" : "Success"}
                  </p>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            )}
            <div className="relative w-full py-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                autoComplete="current-password"
                className="w-full text-white py-3 px-4 bg-[#18202F] text-lg rounded-xl outline-none border border-gray-700 hover:border-gray-500 focus:border-link transition duration-300 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="relative w-full py-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm Password"
                autoComplete="current-password"
                className="w-full text-white py-3 px-4 bg-[#18202F] text-lg rounded-xl outline-none border border-gray-700 hover:border-gray-500 focus:border-link transition duration-300 ease-in-out"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white focus:outline-none"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div>
              <SubmitButton label="Reset Password" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
