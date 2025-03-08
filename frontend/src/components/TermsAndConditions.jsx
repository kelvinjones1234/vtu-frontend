import React from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { useProduct } from "../context/ProductContext";
import { useAuth } from "../context/AuthenticationContext";

const TermsConditions = () => {
  const { user } = useAuth();
  const { terms } = useProduct();

  return (
    <div className={`${!user && "lg:px-[6rem]"} ${user ? "" : "dark"}`}>
      <div className="pt-[15vh] sm:bg-cover px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
        {user && <GeneralLeft />}
        <div className="mx-auto w-full max-w-[800px]">
          {/* Mobile Header */}
          {user && (
            <div className="text-primary text-[1.5rem] font-bold dark:text-white pb-8 text-center xs:hidden">
              Hi,{" "}
              <span className="bg-gradient-to-r uppercase from-purple-400 via-sky-500 to-red-500 text-transparent bg-clip-text">
                {user.username}
              </span>
            </div>
          )}

          {/* Terms and Conditions Content */}
          <div className="mb-8">
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
              Terms and Conditions
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Legal</span>
            </div>
          </div>

          {/* Terms and Conditions Details */}
          {terms && terms.length > 0 ? (
            terms.map((term, index) => (
              <div
                key={index}
                className="bg-white text-black dark:text-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: term.terms_and_conditions,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <p>No terms and conditions available.</p>
            </div>
          )}
        </div>
        {user && <GeneralRight />}
      </div>
    </div>
  );
};

export default TermsConditions;
