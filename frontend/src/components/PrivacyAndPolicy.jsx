import React from "react";
import { Link } from "react-router-dom";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";

const PrivacyPolicy = () => {
  return (
    <div className="bg-bg_on min-h-screen bg-contain bg-no-repeat justify-center pt-24 sm:bg-cover bg-center px-4 sm:px-6 lg:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto sm:flex gap-8">
        <GeneralLeft />
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              1. Introduction
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Welcome to [Your Virtual Top Up Site]. We are committed to
              protecting your privacy and ensuring that your personal
              information is handled in a safe and responsible manner. This
              Privacy Policy explains how we collect, use, and protect your
              information.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              2. Information We Collect
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mb-4">
              <li>
                Personal Information: such as your name, email address, and
                payment details.
              </li>
              <li>
                Usage Information: such as your IP address, browser type, and
                browsing history.
              </li>
              <li>
                Transaction Information: such as your transaction history and
                top-up records.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              3. How We Use Your Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mb-4">
              <li>Provide and manage our services.</li>
              <li>Process your transactions and manage your account.</li>
              <li>Communicate with you about your account or our services.</li>
              <li>Improve our services and customer experience.</li>
            </ul>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              4. Sharing Your Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We do not share your personal information with third parties
              except in the following cases:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400 mb-4">
              <li>When required by law or to comply with legal processes.</li>
              <li>
                To protect the rights and safety of our company, our users, or
                others.
              </li>
              <li>
                With service providers who assist us in operating our site and
                services.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              5. Security of Your Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We implement appropriate security measures to protect your
              information from unauthorized access, alteration, disclosure, or
              destruction. However, please note that no method of transmission
              over the internet or electronic storage is 100% secure.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              6. Cookies and Tracking Technologies
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Our website uses cookies and other tracking technologies to
              enhance your browsing experience. You can choose to disable
              cookies through your browser settings, but this may affect your
              ability to use certain features of our site.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              7. Changes to This Privacy Policy
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page, and your continued use of our site
              after the changes will signify your acceptance of the updated
              terms.
            </p>

            <h3 className="text-lg font-semibold text-primary dark:text-white mb-4">
              8. Contact Us
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us at [support@example.com].
            </p>
          </div>
        </div>
        <GeneralRight />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
