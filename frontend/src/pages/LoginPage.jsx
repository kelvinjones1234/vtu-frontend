import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthenticationContext";
import { Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";
import { GeneralContext } from "../context/GeneralContext";
import simag from "../assets/vtu3.png";

const LeftSide = () => (
  <div className="left leading-[3rem] relative hidden justify-center items-center sm:flex h-[364px] shadow-lg shadow-indigo-900/20 bg-opacity-50 rounded-2xl w-[20rem] bg-black text-white">
    {/* <div className="atom-logo text-[6vw] font-bold text-gradient absolute">
      Atom <br /> <span className="text-[1.5vw]">Virtual Top Up</span>
    </div> */}
    <img src={simag} alt="" className="h-[365px]" />
  </div>
);

const LoginPage = () => {
  const { loginUser, userError, setUserError } = useContext(AuthContext);
  const { setLoading } = useContext(GeneralContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const login = (e) => {
    e.preventDefault();
    if (validInputs()) {
      setLoading(true); // Set loading to true when login starts
      loginUser(username, password).finally(() => {
        setLoading(false); // Set loading to false after login completes
      });
    }
  };

  useEffect(() => {
    if (userError) {
      setErrorMessage((prev) => ({
        ...prev,
        anonymousError: "Incorrect login details.",
      }));
    }
  }, [userError]);

  useEffect(() => {
    if (errorMessage.anonymousError) {
      setUserError("");
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
    <div className="min-h-screen bg-dark-custom-gradient font-body_two">
      <div className="authentication bg-bg_one bg-contain md:bg-cover bg-center min-h-screen bg-no-repeat">
        <nav className="flex justify-between px-4 lg:px-24 py-5">
          <div className="flex items-center gap-1">
            <Link to={"/"}>
              <div className="logo font-heading_one text-green-500 border border-green-500 px-2 text-[.7rem] px-2 rounded-[.5rem] font-bold">
                Atom
              </div>
            </Link>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
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

        <div className="mt-24 px-4 md:px-16 lg:px-32">
          <form
            onSubmit={login}
            className="font-poppins sm:flex justify-between max-w-6xl mx-auto"
          >
            <LeftSide />
            <div className="sm:w-1/2 max-w-md mx-auto sm:mx-0">
              <div className="mb-8">
                <h1 className="font-bold font-heading_two text-4xl text-gray-300 mb-2">
                  Sign in to <span className="text-gradient">Atom</span>
                </h1>
                <p className="text-gray-300 text-lg">
                  Enter your credentials below
                </p>
              </div>

              {Object.values(errorMessage).some((error) => error) && (
                <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-md text-red-500">
                  {errorMessage.anonymousError && (
                    <p>Invalid login credentials. Please try again.</p>
                  )}
                  {errorMessage.usernameError && (
                    <p>{errorMessage.usernameError}</p>
                  )}
                  {errorMessage.passwordError && (
                    <p>{errorMessage.passwordError}</p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={username}
                    placeholder="Username"
                    aria-label="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full text-white py-3 px-4 bg-[#18202F] text-lg rounded-xl outline-none border border-gray-700 hover:border-gray-500 focus:border-link transition duration-300 ease-in-out"
                  />
                </div>

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
              </div>

              <div className="flex flex-wrap justify-between text-gray-300 py-5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5" />
                  <span>Remember me</span>
                </label>
                <Link
                  to="/user/get-password-reset-link"
                  className="text-link hover:text-sky-400 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              <SubmitButton label="Sign In" />

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
