import React, { useState } from "react";
import { Link } from "react-router-dom";

const LeftSide = () => (
  <div className="left leading-[3rem] relative hidden justify-center items-center sm:flex h-[364px] shadow-lg shadow-indigo-900/20 bg-opacity-50 rounded-2xl w-[20rem] bg-black text-white">
    <div className="atom-logo text-[6vw] font-bold text-gradient absolute">
      Atom <br /> <span className="text-[1.5vw]">Virtual Top Up</span>
    </div>
  </div>
);

const PasswordResetPage = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const reset = (e) => {
    e.preventDefault();
    if (password & confirmPassword) {
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
          {/* <div className="hidden ss:block text-gray-300">
            Don't have an account?
            <span className="text-link font-bold cursor-pointer hover:text-sky-400 transition duration-450 ease-in-out">
              <Link to="/authentication/register"> Get started</Link>
            </span>
          </div> */}
        </div>
        <form
          onSubmit={reset}
          className="font-poppins mt-[10vh] sm:flex justify-between login mx-auto px-4 w-full md:px-[4rem] lg:px-[8rem]"
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
            {/* {errorMessage.anonymousError && (
              <div className="text-white ">
                <p>Incorrect login details.</p>
              </div>
            )} */}
            <div>
              <input
                type="password"
                value={password}
                placeholder="Password"
                aria-label="password"
                onChange={(e) => setPassword(e.target.value)}
                className="transition duration-450 ease-in-out my-2 w-full text-white py-1 px-4 h-[3.5rem] bg-[#18202F] text-[1.2rem] rounded-2xl outline-0 border border-gray-700 hover:border-black focus:border-link bg-opacity-80"
              />
              {/* {errorMessage.passwordError && (
                <div className="text-white mb-3 ">
                  {errorMessage.passwordError}
                </div>
              )} */}
            </div>

            <div>
              <input
                type="password"
                value={password}
                placeholder="Confirm Password"
                aria-label="confirm_password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="transition duration-450 ease-in-out my-2 w-full text-white py-1 px-4 h-[3.5rem] bg-[#18202F] text-[1.2rem] rounded-2xl outline-0 border border-gray-700 hover:border-black focus:border-link bg-opacity-80"
              />
              {/* {errorMessage.passwordError && (
                <div className="text-white mb-3 ">
                  {errorMessage.passwordError}
                </div>
              )} */}
            </div>
            <div>
              <button
                className="text-[1rem] my-4 w-full outline-none text-white p-1 h-[3.2rem] bg-link text-black rounded-2xl bg-opacity-[90%] font-semibold hover:bg-sky-400 transition duration-450 ease-in-out"
                type="submit"
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <div role="status" className="grid justify-center">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-400 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Reset password"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordResetPage;
