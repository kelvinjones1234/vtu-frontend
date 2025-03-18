import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import { useGeneral } from "../context/GeneralContext";
import LeftSide from "../components/LeftSide";
import FloatingLabelInput from "../components/FloatingLabelInput";

const PasswordResetRequestPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { api } = useGeneral();

  const [errors, setErrors] = useState({});

  const validInputs = useCallback(() => {
    const newErrors = {};
    if (!email) newErrors.email = "Please enter a registered email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email]);

  const reset = (e) => {
    e.preventDefault();
    if (validInputs()) {
      setLoading(true);
      setError("");
      setMessage("");

      api
        .post("password-reset/", { email })
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
                <h1 className="font-bold font-heading_two text-4xl text-sky-400 dark:text-gray-300 mb-2">
                  Request Password Reset
                </h1>
                <p className="dark:text-gray-300 text-primary text-lg">
                  Enter your registered email to reset your password
                </p>
              </div>

              {(error || message) && (
                <div
                  className={`mb-4 p-4 rounded-lg shadow-md flex items-start ${
                    error
                      ? "bg-red-50 border-l-4 border-red-500"
                      : "bg-green-50 border-l-4 border-green-500"
                  }`}
                >
                  <div className="flex-shrink-0 mr-3 mt-0.5">
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

              <div className="mb-3">
                <div>
                  <FloatingLabelInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    error={errors.email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email"
                    className="w-full text-white py-3 px-4 bg-[#18202F] text-lg rounded-xl outline-none border border-gray-700 hover:border-gray-500 focus:border-link transition duration-300 ease-in-out"
                  />
                </div>
              </div>

              <SubmitButton label="Get Password Reset Link" loading={loading} />

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

export default PasswordResetRequestPage;
