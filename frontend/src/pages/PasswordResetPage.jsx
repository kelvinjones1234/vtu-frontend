import React, { useContext, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SubmitButton from "../components/SubmitButton";
import LeftSide from "../components/LeftSide";
import { useGeneral } from "../context/GeneralContext";

const PasswordResetPage = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const { api } = useGeneral();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const response = await api.post(`reset-password/${uidb64}/${token}/`, {
        password: password,
        password_confirm: confirmPassword,
      });

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
    <div className="min-h-screen bg-white dark:bg-dark-custom-gradient font-body_two">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center min-h-screen bg-no-repeat">
        <nav className="flex justify-between px-4 lg:px-24 py-[.75rem]">
          <div className="flex items-center">
            <Link to={"/"}>
              <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
                MaduConnect
              </div>
            </Link>
          </div>
          <div className="hidden sm:block text-gray-300">
            Don't have an account?
            <Link
              to="/authentication/register"
              className="ml-1 text-link font-bold hover:text-sky-400 transition duration-300 ease-in-out"
            >
              Get started
            </Link>
          </div>
        </nav>

        <div className="mt-[1.8rem] px-4 md:px-16 lg:px-32 sm:mt-[20vh]">
          <form
            onSubmit={reset}
            className="font-poppins sm:flex justify-between max-w-6xl mx-auto"
          >
            <LeftSide />
            <div className="sm:w-1/2 max-w-md mx-auto sm:mx-0">
              <div className="mb-8">
                <h1 className="font-bold font-heading_two text-4xl text-primary-sky-400 dark:text-gray-300 mb-2">
                  Reset Password
                </h1>
                <p className="text-gray-300 text-lg">
                  Enter a strong password and retype it for confirmation.
                </p>
              </div>

              {message.content && (
                <div
                  className={`mb-4 p-4 rounded-lg shadow-md flex items-start ${
                    message.type === "error"
                      ? "bg-red-50 border-l-4 border-red-500"
                      : "bg-green-50 border-l-4 border-green-500"
                  }`}
                >
                  <div className="flex-shrink-0 mr-3 mt-0.5">
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

              <div className="space-y-4">
                <div className="relative w-full">
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

                <div className="relative w-full">
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
              </div>

              <SubmitButton label="Reset Password" loading={loading} />

              <p className="text-center text-primary dark:text-gray-300 mt-6 sm:hidden">
                Don't have an account?{" "}
                <Link
                  to="/authentication/register"
                  className="text-link font-semibold"
                >
                  Get started
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
