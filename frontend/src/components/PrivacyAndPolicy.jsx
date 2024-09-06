import { useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { AuthContext } from "../context/AuthenticationContext";
import { ProductContext } from "../context/ProductContext";

const PrivacyPolicy = () => {
  const { user } = useContext(AuthContext);
  const { policy } = useContext(ProductContext);

  return (
    <div
      className={`bg-bg_on ${
        !user && "lg:px-[6rem]"
      } min-h-screen bg-contain bg-no-repeat justify-center mt-[8rem] sm:bg-cover bg-center px-4 sm:px-6 lg:px-8 xl:px-16 ${
        user ? "" : "dark"  // Apply dark mode if no user is logged in
      }`}
    >
      <div className="max-w-7xl mx-auto sm:flex gap-8">
        {user && <GeneralLeft />}
        <div className="min-w-[349.20px] pr-2 mx-auto">
          <div className="mb-8">
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
              Privacy Policy
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Legal</span>
            </div>
          </div>

          {policy && policy.length > 0 ? (
            policy.map((pol, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: pol.privacy_policy,
                  }}
                />
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <p>No privacy policy available.</p>
            </div>
          )}
        </div>
        {user && <GeneralRight />}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
