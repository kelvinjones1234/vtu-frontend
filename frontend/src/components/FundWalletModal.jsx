import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { useWallet } from "../context/WalletContext";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";
import close from "../assets/close.svg";

const MIN_AMOUNT = 500;

const FundWalletModal = ({ onClose }) => {
  const { authTokens, user } = useContext(AuthContext);
  const { walletData, updateWalletBalance } = useWallet();
  const { api } = useContext(GeneralContext);
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateBalance = useCallback(() => {
    const numAmount = Number(amount);
    if (numAmount < 0) {
      setErrorMessage("Please enter a positive amount.");
      return;
    }
    if (numAmount < MIN_AMOUNT) {
      setErrorMessage(`Amount is below minimum fund amount (${MIN_AMOUNT}).`);
      return;
    }
    const newBalance = Number(walletData.balance) + numAmount;
    updateWalletBalance(newBalance, amount);
    setErrorMessage("");
  }, [amount, walletData.balance, updateWalletBalance]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.monnify.com/plugin/monnify.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => console.log("Monnify SDK Loaded");
    script.onerror = () => console.error("Failed to load Monnify SDK");

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const payWithMonnify = useCallback(() => {
    if (typeof MonnifySDK === "undefined") {
      console.error("Monnify SDK is not loaded yet.");
      return;
    }

    MonnifySDK.initialize({
      amount,
      currency: "NGN",
      reference: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customerEmail: walletData.wallet_name.email,
      apiKey: "MK_TEST_YX3CEVCCPN",
      contractCode: "9500216336",
      paymentDescription: "Fund Wallet",
      onLoadStart: () => console.log("Loading has started"),
      onLoadComplete: () => console.log("SDK is UP"),
      onComplete: handleUpdateBalance,
      onClose: (data) => console.log("Modal closed:", data),
    });
  }, [amount, walletData, handleUpdateBalance]);

  const isButtonDisabled = useMemo(() => Number(amount) < MIN_AMOUNT, [amount]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-md relative mx-5">
        <CloseButton onClose={onClose} />
        <h2 className="text-2xl text-primary dark:text-white mb-6 font-bold">Fund Wallet</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {errorMessage && <ErrorMessage message={errorMessage} />}
          <AmountInput
            amount={amount}
            setAmount={setAmount}
            minAmount={MIN_AMOUNT}
          />
          <SubmitButton
            onClick={payWithMonnify}
            disabled={isButtonDisabled}
            minAmount={MIN_AMOUNT}
          />
        </form>
      </div>
    </div>
  );
};

const CloseButton = ({ onClose }) => (
  <button
    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    onClick={onClose}
    aria-label="Close"
  >
    <img src={close} alt="Close" className="h-6 w-6" />
  </button>
);

const ErrorMessage = ({ message }) => (
  <p className="text-red-500 mb-4">{message}</p>
);

const AmountInput = ({ amount, setAmount, minAmount }) => (
  <input
    type="number"
    placeholder={`Enter Amount (min. ${minAmount})`}
    aria-label="Enter Amount"
    onChange={(e) => setAmount(e.target.value)}
    value={amount}
    min={minAmount}
    className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 outline-0 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
  />
);

const SubmitButton = ({ onClick, disabled, minAmount }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-3 rounded-lg font-semibold transition duration-300 ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-500 text-white hover:bg-blue-600"
    }`}
    type="submit"
  >
    {disabled ? `Enter valid amount (min. ${minAmount})` : "Proceed"}
  </button>
);

export default FundWalletModal;