import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import close from "../assets/close.svg";
import { useWallet } from "../context/WalletContext";
import { AuthContext } from "../context/AuthenticationContext";
import { GeneralContext } from "../context/GeneralContext";

const FundWalletModal = ({ onClose }) => {
  const { authTokens, user } = useContext(AuthContext);
  const { walletData, updateWalletBalance } = useWallet();
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { api } = useContext(GeneralContext);

  const handleUpdateBalance = useCallback(() => {
    const numAmount = Number(amount);
    if (numAmount < 0) {
      setErrorMessage("Please enter a positive amount.");
      return;
    }
    if (numAmount < 500) {
      setErrorMessage("Amount is below minimum fund amount.");
      return;
    }
    const newBalance = Number(walletData.balance) + numAmount;
    updateWalletBalance(newBalance);
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
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
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
      onComplete: (response) => {
        handleUpdateBalance();
        api
          .put(
            `fund-wallet/${user.username}/`,
            { balance: amount },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authTokens.access}`,
              },
            }
          )
          .catch((error) => console.error("Error updating user data:", error));
        console.log("Transaction complete:", response);
      },
      onClose: (data) => console.log("Modal closed:", data),
    });
  }, [amount, walletData, user, authTokens, api, handleUpdateBalance]);

  const buttonDisabled = useMemo(() => Number(amount) < 500, [amount]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="bg-gray-200 dark:bg-gray-600 rounded-2xl p-8 z-10 mx-[4vw] max-w-[500px] relative">
        <button
          className="h-10 w-10 bg-red-600 hover:bg-red-700 transition duration-400 ease-in-out right-[-12px] top-[-12px] cursor-pointer rounded-full absolute flex items-center justify-center"
          onClick={onClose}
          aria-label="Close"
        >
          <img src={close} alt="" className="h-[1.5rem] w-[1.5rem]" />
        </button>
        <h2 className="text-2xl text-primary mb-4 font-bold">Fund Wallet</h2>
        <div>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <input
            type="number"
            placeholder="Enter Amount (min. 500)"
            aria-label="Enter Amount"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            min="500"
            className="transition duration-450 max-w-[428.40px] mx-auto w-full ease-in-out my-2 text-primary py-1 px-4 h-[3.5rem] text-[1.2rem] rounded-2xl outline-0 border border-gray-700 hover:border-black focus:border-link"
          />
          <button
            onClick={payWithMonnify}
            disabled={buttonDisabled}
            className={`text-[1rem] my-2 max-w-[428.40px] mx-auto w-full outline-none text-white p-1 h-[3.2rem] ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-link hover:bg-sky-400 cursor-pointer"
            } text-black rounded-2xl bg-opacity-[90%] font-semibold transition duration-450 ease-in-out`}
            type="button"
          >
            {buttonDisabled ? "Enter valid amount" : "Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundWalletModal;
