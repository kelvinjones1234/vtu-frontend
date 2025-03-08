import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GeneralContext } from "../context/GeneralContext";
import GeneralRight from "./GeneralRight";
import GeneralLeft from "./GeneralLeft";
import SubmitButton from "./SubmitButton";
import FloatingLabelInput from "./FloatingLabelInput";

const inputStyle =
  "dark:bg-[#18202F] bg-white w-full hover:transition hover:duration-450 hover:ease-in-out mb-3 text-primary dark:text-white py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-none border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-[#1CCEFF] dark:hover:border-[#1CCEFF] dark:focus:border-[#1CCEFF]";

const Bvn = () => {
  const { api } = useContext(GeneralContext);
  const [bvn, setBvn] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateBvn = (bvn) => /^\d{11}$/.test(bvn);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newError = {};

    // Set loading to true immediately when submit is clicked
    setLoading(true);

    if (!bvn) {
      newError.bvnError = "Please fill in your BVN";
      setLoading(false);
    } else if (!validateBvn(bvn)) {
      newError.bvnError = "BVN must be exactly 11 digits.";
      setLoading(false);
    } else {
      // Reset error and send BVN to server
      setErrorMessage({});
      api
        .post(
          "create-reserved-account/",
          { bvn: bvn },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          // Set success message first
          setSuccessMessage("Reserved account created successfully!");

          // Reload page after showing success message
          setTimeout(() => {
            window.location.reload();
          }, 3000);

          setLoading(false);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data.error ===
              "422 Client Error: Unprocessable Entity for url: https://sandbox.monnify.com/api/v2/bank-transfer/reserved-accounts/"
          ) {
            setErrorMessage({
              anonymousError: "An account with this BVN already exists.",
            });
          } else {
            setErrorMessage({
              anonymousError:
                error.response?.data?.message ||
                "Failed to create reserved account.",
            });
            console.error(error);
          }
          setLoading(false);
        });
    }

    setErrorMessage(newError);
  };

  return (
    <div className="mt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div>
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Submit Your BVN
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-white rounded-full"></div>
            <span className="text-gray-500">BVN Submission</span>
          </div>
          <p className="items-center text-primary pt-[2rem] pb-[3rem] dark:text-gray-100 py-4">
            Enter you Bank Verification Number (BVN) to create a virtual account
            for funding your wallet
          </p>
        </div>
        <div className="flex flex-col justify-center border-[0.01rem] border-gray-200 dark:border-gray-900 p-5 rounded-[1.5rem] dark:bg-opacity-15 shadow-lg shadow-indigo-950/10">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 rounded-lg shadow-md flex items-start bg-green-50 border-l-4 border-green-500">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">Success</p>
                <p className="mt-1 text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}
          {/* Error Message */}
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
          <form onSubmit={handleSubmit} className="">
            {/* BVN Input */}
            <div>
              <FloatingLabelInput
                type="text"
                name="bvn"
                placeholder="Enter BVN"
                aria-label="BVN"
                value={bvn}
                onChange={(e) => setBvn(e.target.value)}
                maxLength={11}
                className={`${inputStyle}`}
              />
            </div>
            {/* Submit Button */}
            <div>
              <SubmitButton label="Submit" loading={loading} />
            </div>
          </form>
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default Bvn;
