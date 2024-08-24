import { useContext } from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { AuthContext } from "../context/AuthenticationContext";

const TermsConditions = () => {
  const { user } = useContext(AuthContext);

  return (
    <div
      className={`bg-bg_on ${
        !user && "lg:px-[6rem]"
      } min-h-screen bg-contain bg-no-repeat justify-center pt-24 sm:bg-cover bg-center px-4 sm:px-6 lg:px-8 xl:px-16`}
    >
      {" "}
      <div className="max-w-7xl mx-auto sm:flex gap-8">
        {user && <GeneralLeft />}
        <div className="min-w-[349.20px] pr-2 mx-auto">
          <div className="mb-8">
            <h2 className="font-bold font-heading_two text-primary dark:text-white text-3xl mb-4">
              Terms and Conditions
            </h2>
            <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
              <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
              <div className="h-1 w-1 mx-5 bg-primary dark:bg-white rounded-full"></div>
              <span className="text-gray-500">Legal</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              1. Introduction
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Welcome to Atom virtual top up site. These Terms and Conditions
              govern your use of our website and services. By accessing or using
              our site, you agree to be bound by these terms.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              2. Use of Services
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You agree to use our services in accordance with all applicable
              laws and regulations. Any unauthorized use of our services may
              result in suspension or termination of your account.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              3. Account Registration
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              To access certain features, you may be required to register an
              account. You are responsible for maintaining the confidentiality
              of your account information and for all activities that occur
              under your account.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              4. Payment and Top-Up
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              All payments made through our site are processed securely. You
              agree to provide accurate payment information and authorize us to
              charge your chosen payment method for the services you select.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              5. Refund Policy
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              All top-ups are final and non-refundable. In the event of a
              technical issue or error, please contact our support team for
              assistance.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              6. Limitation of Liability
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Our liability is limited to the maximum extent permitted by law.
              We are not responsible for any indirect, incidental, or
              consequential damages arising from your use of our services.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              7. Changes to Terms
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We may update these Terms and Conditions from time to time. Your
              continued use of our site after any changes constitutes your
              acceptance of the new terms.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              8. Contact Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              If you have any questions or concerns regarding these Terms and
              Conditions, please contact us at [support@example.com].
            </p>
          </div>
        </div>
        {user && <GeneralRight />}
      </div>
    </div>
  );
};

export default TermsConditions;
