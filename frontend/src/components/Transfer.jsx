import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthenticationContext";
import { useGeneral } from "../context/GeneralContext";
import FloatingLabelInput from "./FloatingLabelInput";
import { useProduct } from "../context/ProductContext";

// Move styles outside component to prevent recreation on each render
const inputStyle =
  "transition duration-450 font-normal ease-in-out my-2 w-full text-primary dark:text-white py-1 px-3 h-[2.8rem] text-[1.2rem] rounded-2xl outline-none dark:bg-[#18202F] bg-white border border-[#1CCEFF] dark:border-gray-700 dark:hover:border-gray-500 dark:hover:border-black dark:focus:border-[#1CCEFF]";

const initialFormState = {
  username: "",
  amount: "",
  pin: "",
};

const Transfer = () => {
  const { api, setMobileTransferForm } = useGeneral();
  const { user } = useAuth();
  const { walletData, updateWalletBalance } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState({ type: "", text: "" });
  const { fetchNotifications } = useProduct();

  // Auto-dismiss message after 5 seconds
  useEffect(() => {
    let timeoutId;
    if (message.text) {
      timeoutId = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 2000);
    }

    // Clean up timeout on component unmount or when message changes
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [message.text]);

  // Validate inputs
  const validateInputs = () => {
    const { username, amount, pin } = formData;

    if (!username) {
      setMessage({
        type: "error",
        text: "Please enter the recipient's username",
      });
      return false;
    }

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return false;
    }

    if (!pin) {
      setMessage({ type: "error", text: "Please enter your PIN" });
      return false;
    }

    if (username.toLowerCase() === user.user.username.toLowerCase()) {
      setMessage({ type: "error", text: "Cannot transfer to yourself" });
      return false;
    }

    if (walletData.balance < amountNum) {
      setMessage({ type: "error", text: "Insufficient funds" });
      return false;
    }

    if (amountNum < 500) {
      setMessage({ type: "error", text: "Minimum transfer amount is 500" });
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      setLoading(true);

      if (user.user.transaction_pin !== formData.pin) {
        setMessage({ type: "error", text: "Incorrect PIN" });
        setLoading(false);
        return;
      }

      const amountNum = parseFloat(formData.amount);

      // Proceed with the transfer
      await api.post(
        "transfer/",
        {
          username: formData.username.toLowerCase(),
          amount: amountNum,
          transaction_pin: formData.pin,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      fetchNotifications();
      updateWalletBalance(walletData.balance - amountNum);

      // Success message
      setMessage({ type: "success", text: "Transfer Successful!" });

      // Reset form fields
      setFormData(initialFormState);

      // Close mobile transfer form if applicable
      if (setMobileTransferForm) {
        setTimeout(() => setMobileTransferForm(false), 1500);
      }
    } catch (error) {
      console.error("Transfer Error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "An error occurred during the transfer",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes with memoization
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-primary bg-opacity-0 max-w-[208px]">
      <div className="flex flex-col justify-center border-[0.01rem] border-link dark:border-gray-700 p-5 rounded-[1.5rem] bg-opacity-15 shadow-lg shadow-indigo-950/10">
        {/* Message Banner */}
        {message.text && (
          <div
            className={`mb-4 p-4 rounded-lg shadow-md flex items-start border-l-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {message.type === "success" ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
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
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.type === "success" ? "Success" : "Error"}
              </p>
              <p
                className={`mt-1 text-sm ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Transfer Form */}
        <form onSubmit={handleTransfer}>
          <FloatingLabelInput
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            type="text"
            placeholder="Username"
            aria-label="Username"
            className={inputStyle}
          />

          <FloatingLabelInput
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            type="text"
            placeholder="Amount"
            aria-label="Amount"
            className={inputStyle}
          />

          <FloatingLabelInput
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            type="password"
            placeholder="Pin"
            aria-label="Pin"
            autoComplete="current-password"
            className={inputStyle}
          />

          <SubmitButton label="Transfer" loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default Transfer;
