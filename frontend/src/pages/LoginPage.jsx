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
    <div className="min-w-[150px] bg-opacity-[95%] z-[-1] font-body_two bg-dark-custom-gradient w-full z-[-2] min-w-[150px] absolute top-0 left-0 min-h-screen">
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
          onSubmit={login}
          className="font-poppins mt-[15vh] sm:flex justify-between login mx-auto px-4 w-full md:px-[4rem] lg:px-[8rem]"
        >
          <LeftSide />
          <div className="right sm:w-[50%] max-w-[550px] mx-auto sm:mx-0">
            <div className="top-text pb-6">
              <h5 className="font-bold font-heading_two text-[2rem] text-gray-300">
                Signin to <span className="text-gradient">Atom</span>
              </h5>
              <p className="text-gray-300 text-[1.2rem]">
                Enter your details below
              </p>
            </div>
            {errorMessage.anonymousError && (
              <div className="text-white ">
                <p>Incorrect login details.</p>
              </div>
            )}
            <div className=""> 
              {errorMessage.usernameError && (
                <div className="text-white">
                  {errorMessage.usernameError}
                </div>
              )}
              <input
                type="text"
                value={username}
                placeholder="Username"
                aria-label="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="transition duration-450 ease-in-out my-2 w-full text-white py-1 px-4 h-[3.5rem] bg-[#18202F] text-[1.2rem] rounded-2xl outline-0 border border-gray-700 hover:border-black focus:border-link bg-opacity-80"
              />
            </div>
            <div className="my-4">
              {errorMessage.passwordError && (
                <div className="text-white">{errorMessage.passwordError}</div>
              )}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                autoComplete="current-password"
                className="transition duration-450 ease-in-out my-2 w-full text-white py-1 px-4 h-[3.5rem] bg-[#18202F] text-[1.2rem] rounded-2xl outline-0 border border-gray-700 hover:border-black focus:border-link bg-opacity-80"
              />
            </div>
            <div className="flex flex-wrap w-full text-white justify-between text-[1rem] text-gray-300 py-5">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 md:h-5 md:w-5 mr-3" />
                <label>Remember me</label>
              </div>
              <Link to={"/user/get-password-reset-link"}>
                <p className="text-link hover:text-sky-400 font-semibold cursor-pointer">
                  Forgot password?
                </p>
              </Link>
            </div>
            <div>
              <SubmitButton label="Login" />
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

export default LoginPage;
