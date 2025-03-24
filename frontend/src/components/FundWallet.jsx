// import React, { useState } from "react";
// import { FaCopy, FaCheckCircle } from "react-icons/fa";
// import GeneralLeft from "./GeneralLeft";
// import GeneralRight from "./GeneralRight";
// import { Link } from "react-router-dom";

// const FundWallet = ({ fundingData }) => {
//   const [copiedAccount, setCopiedAccount] = useState(null);

//   // Destructure funding data with default values
//   const {
//     account_details: accounts = [], // Default to an empty array if accounts are not available
//     created_at: createdOn,
//   } = fundingData || {};

//   // Function to handle copying account number
//   const handleCopyAccount = (accountNumber) => {
//     navigator.clipboard.writeText(accountNumber).then(() => {
//       setCopiedAccount(accountNumber);
//       setTimeout(() => setCopiedAccount(null), 1000);
//     });
//   };

//   return (
//     <div className="mt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
//       <GeneralLeft />
//       <div>
//         <div>
//           <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
//             Fund Wallet
//           </h2>
//           <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
//             <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
//             <div className="h-1 w-1 mx-5 bg-white rounded-full"></div>
//             <span className="text-gray-500">Fund Wallet</span>
//           </div>
//         </div>
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
//           <h1 className="text-2xl font-bold text-primary dark:text-white text-center mb-6">
//             Linked Bank Accounts for Automated Transfer
//           </h1>

//           {fundingData && accounts.length > 0 ? (
//             <>
//               <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
//                 Seamless Wallet Funding: Automated Bank Transfer
//               </p>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {accounts.map((account, index) => (
//                   <div
//                     key={index}
//                     className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-md relative"
//                   >
//                     <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
//                       Bank Name:
//                     </p>
//                     <p className="text-lg font-bold text-primary dark:text-white">
//                       {account.bankName}
//                     </p>
//                     <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
//                       Account Number:
//                     </p>
//                     <div className="flex items-center">
//                       <p className="text-lg font-bold text-primary dark:text-white flex-grow">
//                         {account.accountNumber}
//                       </p>
//                       <button
//                         onClick={() => handleCopyAccount(account.accountNumber)}
//                         className="ml-2 text-gray-500 hover:text-primary transition-colors"
//                         title="Copy Account Number"
//                       >
//                         {copiedAccount === account.accountNumber ? (
//                           <FaCheckCircle className="w-5 h-5 text-green-500" />
//                         ) : (
//                           <FaCopy className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                     <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
//                       Account Name:
//                     </p>
//                     <p className="text-lg font-bold text-primary dark:text-white">
//                       Madu_connect-{account.accountName}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-500">
//               No funding details available.
//             </p>
//           )}
//         </div>
//       </div>
//       <GeneralRight />
//     </div>
//   );
// };

// export default FundWallet;

import React, { useState } from "react";
import { FaCopy, FaCheckCircle, FaWallet, FaArrowRight } from "react-icons/fa";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";

const FundWallet = ({ fundingData }) => {
  const [copiedAccount, setCopiedAccount] = useState(null);

  // Destructure funding data with default values
  const {
    account_details: accounts = [], // Default to an empty array if accounts are not available
    created_at: createdOn,
  } = fundingData || {};

  // Function to handle copying account number
  const handleCopyAccount = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopiedAccount(accountNumber);
      setTimeout(() => setCopiedAccount(null), 2000);
    });
  };

  return (
    <div className="mt-16 px-4 ss:px-8 sm:px-6 sm:flex gap-5 md:gap-12 lg:mx-16 max-w-screen-2xl mx-auto">
      <GeneralLeft />

      <div className="flex-grow max-w-3xl">
        <div className="mb-6">
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-2xl md:text-3xl">
            Fund Wallet
          </h2>
          <div className="flex items-center text-sm text-primary dark:text-gray-100 py-3 font-medium">
            <Link
              to="/user/dashboard"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Dashboard
            </Link>
            <FaArrowRight className="mx-3 h-3 w-3 text-gray-400" />
            <span className="text-gray-500">Fund Wallet</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-center mb-6">
            <FaWallet className="text-primary dark:text-blue-400 mr-3 h-6 w-6" />
            <h1 className="text-xl md:text-2xl font-bold text-primary dark:text-white">
              Linked Bank Accounts
            </h1>
          </div>

          {fundingData && accounts.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center max-w-md mx-auto">
                Use any of these accounts for automated transfers to fund your
                wallet. All deposits are processed instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {accounts.map((account, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Bank Name
                        </p>
                        <p className="text-lg font-bold text-primary dark:text-white">
                          {account.bankName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Account Number
                        </p>
                        <div className="flex items-center bg-white dark:bg-gray-600 p-2 rounded-md">
                          <p className="text-lg font-mono font-bold text-primary dark:text-white flex-grow">
                            {account.accountNumber}
                          </p>
                          <button
                            onClick={() =>
                              handleCopyAccount(account.accountNumber)
                            }
                            className="ml-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                            title="Copy Account Number"
                          >
                            {copiedAccount === account.accountNumber ? (
                              <FaCheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <FaCopy className="w-5 h-5 text-gray-500 hover:text-primary dark:text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Account Name
                        </p>
                        <p className="text-lg font-bold text-primary dark:text-white">
                          Madu_connect-{account.accountName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium">Important Note:</p>
                <p className="mt-1">
                  Funds will appear in your wallet within minutes of successful
                  transfer. For assistance, contact support.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <FaWallet className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                No funding details available at this time.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Please contact support to set up your funding accounts.
              </p>
            </div>
          )}
        </div>
      </div>

      <GeneralRight />
    </div>
  );
};

export default FundWallet;
