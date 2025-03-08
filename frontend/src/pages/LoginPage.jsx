import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import { GeneralContext } from "../context/GeneralContext";
import LeftSide from "../components/LeftSide";
import FloatingLabelInput from "../components/FloatingLabelInput";

const LoginPage = () => {
  const { loginUser, userError, setUserError, setRememberMe, rememberMe } =
    useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = (e) => {
    e.preventDefault();
    const lowercase_username = username.toLocaleLowerCase();
    if (validInputs()) {
      setLoading(true); // Set loading to true when login starts
      loginUser(lowercase_username, password).finally(() => {
        setLoading(false); // Set loading to false after login completes
      });
    }
  };

  useEffect(() => {
    if (userError) {
      setErrorMessage((prev) => ({
        ...prev,
        anonymousError: userError,
      }));
    }
  }, [userError]);

  useEffect(() => {
    if (errorMessage.anonymousError) {
      setUserError(""); // Clear user error after displaying it
    }
  }, [errorMessage.anonymousError, setUserError]);

  const validInputs = () => {
    const newError = {};
    if (!username) {
      newError.usernameError = "Please fill in your username";
    }
    if (!password) {
      newError.passwordError = "Please fill in your password";
    }
    setErrorMessage(newError);
    return Object.keys(newError).length === 0;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-custom-gradient font-body_two">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center min-h-screen bg-no-repeat">
        <nav className="flex justify-between px-4 lg:px-24 py-[.75rem]">
          <div className="flex items-center">
            {/* <img src={logo} alt="" className="h-7 mb-1" /> */}
            <Link to={"/"}>
              <div className="logo font-heading_one text-transparent bg-clip-text pr-2 text-[.8rem] rounded-[.5rem] font-bold bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 border-white">
                MaduConnect
              </div>
            </Link>
          </div>
          <div className="hidden sm:block dark:text-gray-300 text-primary">
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
            onSubmit={login}
            className="font-poppins sm:flex justify-between max-w-6xl mx-auto"
          >
            <LeftSide />
            <div className="sm:w-1/2 max-w-md mx-auto sm:mx-0">
              <div className="mb-4">
                <h1 className="font-bold font-heading_two text-4xl text-primary dark:text-gray-300 mb-2">
                  Sign in to{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
                    MaduConnect
                  </span>
                </h1>
                <p className="dark:text-gray-300 text-lg text-primary mt-[4rem]">
                  Enter your credentials below
                </p>
              </div>

              {Object.values(errorMessage).some((error) => error) && (
                <div className="mb-4 p-4 rounded-lg shadow-md flex items-start bg-red-50 border-l-4 border-red-500">
                  <div className="flex-shrink-0 mr-3 mt-0.5">
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
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-red-800">Error</p>
                    <ul className="mt-1 text-sm text-red-700">
                      {Object.values(errorMessage).map(
                        (error, index) => error && <li key={index}>{error}</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <FloatingLabelInput
                  type="text"
                  value={username}
                  placeholder="Username"
                  aria-label="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]"
                />

                <div className="relative w-full">
                  <FloatingLabelInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                    autoComplete="current-password"
                    className="dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-between text-gray-300 py-5">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 custom-checkbox cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-primary dark:text-gray-100">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/user/get-password-reset-link"
                  className="text-link hover:text-sky-400 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              <SubmitButton label="Sign In" loading={loading} />

              <p className="text-center text-gray-300 mt-6 sm:hidden">
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

export default LoginPage;
