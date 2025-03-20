import React, { useState } from "react";
import { FaCopy, FaCheckCircle } from "react-icons/fa";
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
      setTimeout(() => setCopiedAccount(null), 1000);
    });
  };

  return (
    <div className="mt-[15vh] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
      <div>
        <div>
          <h2 className="font-bold font-heading_two text-primary dark:text-white text-[1.5rem]">
            Fund Wallet
          </h2>
          <div className="flex items-center text-primary dark:text-gray-100 py-4 font-semibold">
            <Link to={"/user/dashboard"}>Dashboard</Link>{" "}
            <div className="h-1 w-1 mx-5 bg-white rounded-full"></div>
            <span className="text-gray-500">Fund Wallet</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-primary dark:text-white text-center mb-6">
            Linked Bank Accounts for Automated Transfer
          </h1>

          {fundingData && accounts.length > 0 ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Seamless Wallet Funding: Automated Bank Transfer
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accounts.map((account, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-md relative"
                  >
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Bank Name:
                    </p>
                    <p className="text-lg font-bold text-primary dark:text-white">
                      {account.bankName}
                    </p>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                      Account Number:
                    </p>
                    <div className="flex items-center">
                      <p className="text-lg font-bold text-primary dark:text-white flex-grow">
                        {account.accountNumber}
                      </p>
                      <button
                        onClick={() => handleCopyAccount(account.accountNumber)}
                        className="ml-2 text-gray-500 hover:text-primary transition-colors"
                        title="Copy Account Number"
                      >
                        {copiedAccount === account.accountNumber ? (
                          <FaCheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <FaCopy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                      Account Name:
                    </p>
                    <p className="text-lg font-bold text-primary dark:text-white">
                      Madu_connect-{account.accountName}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              No funding details available.
            </p>
          )}
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default FundWallet;
