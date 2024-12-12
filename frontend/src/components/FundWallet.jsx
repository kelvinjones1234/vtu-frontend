import React, { useMemo, useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import GeneralLeft from "./GeneralLeft";
import GeneralRight from "./GeneralRight";
import { Link } from "react-router-dom";

const sampleData = {
  requestSuccessful: true,
  responseMessage: "success",
  responseCode: "0",
  responseBody: {
    contractCode: "6525688895",
    accountReference: "maduconnect_d41d6257",
    accountName: "Pra",
    currencyCode: "NGN",
    customerEmail: "madu@gmail.com",
    customerName: "Praise Godwin",
    accounts: [
      {
        bankCode: "035",
        bankName: "Wema bank",
        accountNumber: "0013987396",
        accountName: "Pra",
      },
      {
        bankCode: "232",
        bankName: "Sterling bank",
        accountNumber: "7006868213",
        accountName: "Pra",
      },
    ],
    collectionChannel: "RESERVED_ACCOUNT",
    reservationReference: "440UY94T2SYWPQ300002",
    reservedAccountType: "GENERAL",
    status: "ACTIVE",
    createdOn: "2024-12-11 23:12:57.764",
    incomeSplitConfig: [],
    bvn: "32434333234",
    restrictPaymentSource: false,
  },
};

const FundWallet = () => {
  const {
    contractCode,
    accountReference,
    accountName,
    customerEmail,
    customerName,
    accounts,
    status,
    createdOn,
  } = sampleData.responseBody || {};

  // State to track which account number was recently copied
  const [copiedAccount, setCopiedAccount] = useState(null);

  const formattedDate = useMemo(() => {
    return new Date(createdOn).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [createdOn]);

  // Function to handle copying account number
  const handleCopyAccount = (accountNumber) => {
    navigator.clipboard.writeText(accountNumber).then(() => {
      setCopiedAccount(accountNumber);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedAccount(null);
      }, 1000);
    });
  };

  return (
    <div className="mt-[6rem] sm:bg-cover bg-center px-4 justify-center ss:px-[5rem] sm:px-[1rem] sm:flex gap-5 md:gap-12 lg:mx-[5rem]">
      <GeneralLeft />
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

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Seamless Wallet Funding: Automated Bank Transfer
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            Fund your wallet instantly by transferring to any of the accounts
            below. Transfers are automated and credited in real-time.
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 mb-4">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            <strong>Note:</strong> Use your account for transfers to ensure
            instant processing. Funds reflect immediately.
          </p>
        </div>
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
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                Account Name:
              </p>
              <p className="text-lg font-bold text-primary dark:text-white">
                {account.accountName}
              </p>
            </div>
          ))}
        </div>
      </div>
      <GeneralRight />
    </div>
  );
};

export default FundWallet;
